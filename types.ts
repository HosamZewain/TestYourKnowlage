export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum GameState {
  LanguageSelection,
  Auth,
  Dashboard,
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

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  date: string;
  topics: string[];
  difficulty: string;
  score: number;
  total: number;
  scorePercentage: number;
}