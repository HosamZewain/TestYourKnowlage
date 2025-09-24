import React from 'react';

interface DifficultySelectionProps {
  subcategories: string[];
  onSelectDifficulty: (difficulty: string) => void;
  onBack: () => void;
  t: any;
}

const DifficultySelection: React.FC<DifficultySelectionProps> = ({ subcategories, onSelectDifficulty, onBack, t }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-2">{t.chooseDifficulty}</h2>
      <p className="text-center text-gray-400 mb-8 text-base">
        {t.category}: <span className="font-semibold text-cyan-400">{subcategories.join(', ')}</span>
      </p>

      <div className="flex flex-col items-center gap-4">
        {t.difficulties.map((difficulty: string) => (
          <button
            key={difficulty}
            onClick={() => onSelectDifficulty(difficulty)}
            className="w-full max-w-sm p-4 bg-black bg-opacity-30 border border-purple-500/50 rounded-lg text-gray-200 font-semibold text-center text-xl
                       hover:bg-purple-500/30 hover:border-cyan-400 hover:scale-105 transform transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {difficulty}
          </button>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Go back to category selection"
        >
          {t.backToCategories}
        </button>
      </div>
    </div>
  );
};

export default DifficultySelection;
