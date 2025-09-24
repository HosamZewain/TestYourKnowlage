import React from 'react';
import { User, QuizResult } from '../types';

interface DashboardScreenProps {
  user: User;
  results: QuizResult[];
  onStartNewQuiz: () => void;
  onLogout: () => void;
  t: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, results, onStartNewQuiz, onLogout, t }) => {
  const formatTopics = (topics: string[]) => {
    if (topics.length > 2) {
      return `${topics.slice(0, 2).join(', ')} & more`;
    }
    return topics.join(', ');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            {t.dashboard.welcome(user.name)}
          </h1>
          <p className="text-lg text-gray-400">{t.dashboard.subtitle}</p>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-gray-600/80 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition-colors duration-300"
        >
          {t.dashboard.logout}
        </button>
      </header>

      <div className="text-center mb-10">
        <button
          onClick={onStartNewQuiz}
          className="px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xl rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
        >
          {t.dashboard.startNewQuiz}
        </button>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">{t.dashboard.quizHistory}</h2>
        {results.length === 0 ? (
          <div className="text-center py-10 bg-black bg-opacity-20 rounded-lg border border-gray-700/50">
            <p className="text-gray-400">{t.dashboard.noHistory}</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto ps-2">
            {results.map(result => (
              <div key={result.id} className="bg-black bg-opacity-30 p-4 rounded-lg border border-gray-700/50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-200">{formatTopics(result.topics)}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(result.date).toLocaleDateString()} - {result.difficulty}
                  </p>
                </div>
                <div className="text-right">
                   <p className={`text-2xl font-bold ${result.scorePercentage >= 75 ? 'text-green-400' : result.scorePercentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.scorePercentage}%
                   </p>
                   <p className="text-sm text-gray-400">{result.score}/{result.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
