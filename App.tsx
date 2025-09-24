import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { GameState, Question, Language, User, QuizResult } from './types';
import CategorySelection from './components/CategorySelection';
import DifficultySelection from './components/DifficultySelection';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import LanguageSelection from './components/LanguageSelection';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import { generateQuizQuestions } from './services/geminiService';
import * as authService from './services/authService';
import { auth } from './services/firebase'; // Import auth for the listener
import { translations } from './localization';
import { MAX_SKIPS, TOTAL_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LanguageSelection);
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userResults, setUserResults] = useState<QuizResult[]>([]);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to handle initial auth check
  const [error, setError] = useState<string | null>(null);
  const [skipsRemaining, setSkipsRemaining] = useState<number>(MAX_SKIPS);

  const t = translations[language];

  // Effect to handle Firebase auth state changes and initialize app
  useEffect(() => {
    const savedLang = localStorage.getItem('quiz_language');
    if (savedLang === 'en' || savedLang === 'ar') {
      setLanguage(savedLang);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        const results = await authService.getQuizResultsForUser(firebaseUser.uid);
        setCurrentUser(userProfile);
        setUserResults(results);
        setGameState(GameState.Dashboard);
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserResults([]);
        if (localStorage.getItem('quiz_language')) {
          setGameState(GameState.Auth);
        } else {
          setGameState(GameState.LanguageSelection);
        }
      }
      setIsLoading(false); // Auth check is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // This effect reacts to language changes to set document attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);


  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('quiz_language', lang);
    setGameState(GameState.Auth);
  };
  
  const handleLogout = async () => {
      await authService.signOut();
      localStorage.removeItem('quiz_language');
      // The onAuthStateChanged listener will handle resetting state and UI
  };

  const handleStartNewQuiz = () => {
    setQuestions([]);
    setUserAnswers([]);
    setSelectedSubCategories([]);
    setSelectedDifficulty('');
    setError(null);
    setSkipsRemaining(MAX_SKIPS);
    setGameState(GameState.CategorySelection);
  };

  const handleConfirmCategories = (subCategories: string[]) => {
    setSelectedSubCategories(subCategories);
    setGameState(GameState.DifficultySelection);
  };
  
  const handleSelectDifficulty = useCallback(async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions(selectedSubCategories, difficulty, language);
      setQuestions(fetchedQuestions);
      setGameState(GameState.Quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubCategories, language]);

  const handleQuizComplete = async (answers: string[]) => {
    setUserAnswers(answers);
    if (currentUser) {
        const score = questions.reduce((acc, question, index) => {
            return question.correctAnswer === answers[index] ? acc + 1 : acc;
        }, 0);
        const scorePercentage = Math.round((score / questions.length) * 100);
        
        const newResult = await authService.saveQuizResult({
            userId: currentUser.id,
            topics: selectedSubCategories,
            difficulty: selectedDifficulty,
            score,
            total: TOTAL_QUESTIONS,
            scorePercentage,
        });
        setUserResults(prev => [newResult, ...prev]);
    }
    setGameState(GameState.Results);
  };
  
  const handleBackToDashboard = () => {
    setGameState(GameState.Dashboard);
  };

  const handleBackToCategories = () => {
    setGameState(GameState.CategorySelection);
  };

  const handleUseSkip = () => {
    if (skipsRemaining > 0) {
      setSkipsRemaining(prev => prev - 1);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      const message = gameState === GameState.LanguageSelection ? 'Initializing...' : t.loadingMessage(selectedDifficulty, selectedSubCategories.join(', '));
      const subMessage = gameState === GameState.LanguageSelection ? 'Please wait' : t.loadingSubmessage;
      return <LoadingSpinner message={message} subMessage={subMessage} />;
    }
    
    if (error) {
      return (
        <div className="text-center p-8 bg-red-500/20 border border-red-500 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400">{t.errorTitle}</h2>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={handleStartNewQuiz}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.tryAgain}
          </button>
        </div>
      );
    }

    switch (gameState) {
      case GameState.LanguageSelection:
        return <LanguageSelection onSelectLanguage={handleSelectLanguage} />;
      case GameState.Auth:
        return <AuthScreen t={t} />;
      case GameState.Dashboard:
        return currentUser && <DashboardScreen user={currentUser} results={userResults} onStartNewQuiz={handleStartNewQuiz} onLogout={handleLogout} t={t} />;
      case GameState.CategorySelection:
        return <CategorySelection onConfirmSelection={handleConfirmCategories} t={t} />;
      case GameState.DifficultySelection:
        return <DifficultySelection subcategories={selectedSubCategories} onSelectDifficulty={handleSelectDifficulty} onBack={handleBackToCategories} t={t} />;
      case GameState.Quiz:
        return <QuizScreen questions={questions} onComplete={handleQuizComplete} t={t} skipsRemaining={skipsRemaining} onUseSkip={handleUseSkip} />;
      case GameState.Results:
        return <ResultsScreen questions={questions} userAnswers={userAnswers} onBackToDashboard={handleBackToDashboard} t={t} />;
      default:
        return <LanguageSelection onSelectLanguage={handleSelectLanguage} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 via-purple-900/60 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;