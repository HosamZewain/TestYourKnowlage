import React, { useState } from 'react';
import { Category } from '../types';

interface CategorySelectionProps {
  onConfirmSelection: (categories: string[]) => void;
  t: any;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ onConfirmSelection, t }) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(t.categories[0]?.name || null);

  const handleToggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(item => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleToggleCategory = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-8">{t.chooseCategory}</h2>
      
      <div className="space-y-4">
        {t.categories.map((category: Category) => (
          <div key={category.name} className="bg-black bg-opacity-30 border border-purple-500/50 rounded-lg overflow-hidden transition-all duration-300">
            <button
              onClick={() => handleToggleCategory(category.name)}
              className="w-full p-4 flex justify-between items-center text-start text-xl font-semibold text-gray-200 hover:bg-purple-500/10"
              aria-expanded={expandedCategory === category.name}
            >
              <span>{category.name}</span>
              <svg 
                className={`w-6 h-6 transform transition-transform duration-300 ${expandedCategory === category.name ? 'rotate-180' : ''}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {expandedCategory === category.name && (
              <div className="p-4 border-t border-purple-500/30">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => handleToggleSubcategory(subcategory)}
                      className={`p-3 rounded-md text-center transform transition-all duration-200 ease-in-out
                                 ${selectedSubcategories.includes(subcategory)
                                   ? 'bg-cyan-500 text-white font-bold ring-2 ring-cyan-300 scale-105'
                                   : 'bg-black bg-opacity-40 text-gray-300 hover:bg-gray-700/50'}`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => onConfirmSelection(selectedSubcategories)}
          disabled={selectedSubcategories.length === 0}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg 
                     shadow-purple-500/30 hover:scale-105 transform transition-transform duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-cyan-300
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {t.continue}
        </button>
        {selectedSubcategories.length === 0 && (
          <p className="text-red-400 mt-3">{t.selectAtLeastOne}</p>
        )}
      </div>
    </div>
  );
};

export default CategorySelection;
