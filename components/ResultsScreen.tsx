import React from 'react';
import { Question } from '../types';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: string[];
  onBackToDashboard: () => void;
  t: any;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onBackToDashboard, t }) => {
  const score = questions.reduce((acc, question, index) => {
    return question.correctAnswer === userAnswers[index] ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((score / questions.length) * 100);
  
  const scoreColor = scorePercentage >= 75 ? 'text-green-400' : scorePercentage >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50 text-center">
        <h2 className="text-4xl font-bold text-gray-100">{t.quizComplete}</h2>
        <p className="text-xl text-gray-300 mt-2">{t.resultsSubtitle}</p>

        <div className="my-8">
          <p className={`text-7xl font-bold ${scoreColor}`}>{scorePercentage}%</p>
          <p className="text-2xl text-gray-200 font-semibold">
            {t.correctAnswers(score, questions.length)}
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
        >
          {t.backToDashboard}
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-100 mb-4 text-center">{t.reviewAnswers}</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto ps-2">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isSkipped = userAnswer === 'SKIPPED';
            const isCorrect = !isSkipped && question.correctAnswer === userAnswer;
            
            const containerClasses = isCorrect 
              ? 'border-green-500/50 bg-green-500/10' 
              : isSkipped 
                ? 'border-gray-500/50 bg-gray-500/10' 
                : 'border-red-500/50 bg-red-500/10';

            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${containerClasses}`}>
                <p className="font-semibold text-gray-200">{index + 1}. {question.question}</p>
                {isSkipped ? (
                  <p className="mt-2 text-gray-400 italic">{t.skippedQuestion}</p>
                ) : (
                  <>
                    <p className={`mt-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {t.yourAnswer}: {userAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="mt-1 text-yellow-300">
                        {t.correctAnswer}: {question.correctAnswer}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;