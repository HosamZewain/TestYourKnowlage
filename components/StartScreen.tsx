import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  t: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, t }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
        {t.title}
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
        {t.subtitle}
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
      >
        {t.startGame}
      </button>
    </div>
  );
};

export default StartScreen;
