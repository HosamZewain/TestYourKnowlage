import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Question, Language } from './types';
import StartScreen from './components/StartScreen';
import CategorySelection from './components/CategorySelection';
import DifficultySelection from './components/DifficultySelection';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import LanguageSelection from './components/LanguageSelection';
import { generateQuizQuestions } from './services/geminiService';
import { translations } from './localization';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LanguageSelection);
  const [language, setLanguage] = useState<Language>('en');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setGameState(GameState.Start);
  };

  const handleStartGame = () => {
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

  const handleQuizComplete = (answers: string[]) => {
    setUserAnswers(answers);
    setGameState(GameState.Results);
  };
  
  const handlePlayAgain = () => {
    setQuestions([]);
    setUserAnswers([]);
    setSelectedSubCategories([]);
    setSelectedDifficulty('');
    setError(null);
    setGameState(GameState.CategorySelection);
  };

  const handleBackToCategories = () => {
    setGameState(GameState.CategorySelection);
  };

  const renderContent = () => {
    if (isLoading) {
      const categoryText = selectedSubCategories.length > 2 
        ? `${selectedSubCategories.slice(0, 2).join(', ')} & more` 
        : selectedSubCategories.join(', ');
      return <LoadingSpinner message={t.loadingMessage(selectedDifficulty, categoryText)} subMessage={t.loadingSubmessage} />;
    }
    
    if (error) {
      return (
        <div className="text-center p-8 bg-red-500/20 border border-red-500 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400">{t.errorTitle}</h2>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={handlePlayAgain}
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
      case GameState.Start:
        return <StartScreen onStart={handleStartGame} t={t} />;
      case GameState.CategorySelection:
        return <CategorySelection onConfirmSelection={handleConfirmCategories} t={t} />;
      case GameState.DifficultySelection:
        return <DifficultySelection subcategories={selectedSubCategories} onSelectDifficulty={handleSelectDifficulty} onBack={handleBackToCategories} t={t} />;
      case GameState.Quiz:
        return <QuizScreen questions={questions} onComplete={handleQuizComplete} t={t} />;
      case GameState.Results:
        return <ResultsScreen questions={questions} userAnswers={userAnswers} onPlayAgain={handlePlayAgain} t={t} />;
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
