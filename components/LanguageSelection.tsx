import React from 'react';
import { Language } from '../types';

interface LanguageSelectionProps {
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelectLanguage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8">
        Select a Language / اختر لغة
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => onSelectLanguage('en')}
          className="px-12 py-5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 text-2xl"
        >
          English
        </button>
        <button
          onClick={() => onSelectLanguage('ar')}
          className="px-12 py-5 bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal-300 text-2xl"
        >
          العربية
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
