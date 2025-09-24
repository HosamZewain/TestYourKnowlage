export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum GameState {
  LanguageSelection,
  Start,
  CategorySelection,
  DifficultySelection,
  Quiz,
  Results,
}

export type Language = 'en' | 'ar';

export interface Category {
  name: string;
  subcategories: string[];
}
