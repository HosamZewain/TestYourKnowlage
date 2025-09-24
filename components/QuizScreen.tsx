import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: string[]) => void;
  t: any;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete, t }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / TOTAL_QUESTIONS) * 100;

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    if (!selectedOption) return;
    
    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const getOptionButtonClass = (option: string) => {
    if (!selectedOption) {
      return "bg-black bg-opacity-30 border-purple-500/50 hover:bg-purple-500/30";
    }
    if (option === selectedOption) {
        return "bg-cyan-500 border-cyan-400";
    }
    return "bg-black bg-opacity-30 border-purple-500/50 cursor-not-allowed opacity-60";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-200">{t.question} {currentQuestionIndex + 1} {t.of} {TOTAL_QUESTIONS}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
      </div>
      
      {/* Question Card */}
      <div className="bg-black bg-opacity-20 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-6 leading-tight">
          {currentQuestion.question}
        </h2>
        
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption}
              className={`p-4 rounded-lg text-start text-gray-100 font-medium border
                          transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-cyan-300
                          ${getOptionButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
        
        {/* Next Button */}
        <div className="mt-8 text-end">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedOption}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg 
                       hover:scale-105 transform transition-transform duration-300 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {currentQuestionIndex < TOTAL_QUESTIONS - 1 ? t.nextQuestion : t.finishQuiz}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
