import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './firebase';
import { User, QuizResult } from '../types';

const PROFILES_KEY = 'quiz_user_profiles';
const RESULTS_KEY = 'quiz_results';

// Helper to get items from localStorage
const getFromStorage = <T>(key: string): T[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return [];
  }
};

// Helper to save items to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};


// --- User Management ---

// FIX: Add createUserProfile function to create a user profile in localStorage.
// This function is used by App.tsx, signUp, and signIn to ensure profiles are
// created consistently.
export async function createUserProfile(userId: string, name: string | null, email: string | null): Promise<User> {
  const newUser: User = {
    id: userId,
    name: name || (email && email.split('@')[0]) || 'User',
    email: email || '',
  };

  const profiles = getFromStorage<User>(PROFILES_KEY);
  const existingProfile = profiles.find(p => p.id === newUser.id);
  if (!existingProfile) {
    profiles.push(newUser);
    saveToStorage(PROFILES_KEY, profiles);
  }
  
  return newUser;
}

export async function signUp(name: string, email: string, password_used: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password_used);
  const firebaseUser = userCredential.user;
  return createUserProfile(firebaseUser.uid, name, firebaseUser.email);
}

export async function signIn(email: string, password_used: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password_used);
  const firebaseUser = userCredential.user;
  
  const userProfile = await getUserProfile(firebaseUser.uid);
  if (userProfile) {
    return userProfile;
  }

  // This can happen if localStorage was cleared but the user still exists in Firebase Auth.
  // We recreate the profile here for a better user experience.
  const name = firebaseUser.displayName || email.split('@')[0] || 'User';
  return createUserProfile(firebaseUser.uid, name, firebaseUser.email);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(userId: string): Promise<User | null> {
    const profiles = getFromStorage<User>(PROFILES_KEY);
    const profile = profiles.find(p => p.id === userId);
    return Promise.resolve(profile || null);
}


// --- Quiz Result Management ---

export async function saveQuizResult(resultData: Omit<QuizResult, 'id' | 'date'>): Promise<QuizResult> {
  const allResults = getFromStorage<QuizResult>(RESULTS_KEY);
  
  const newResult: QuizResult = {
      ...resultData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // simple unique id
      date: new Date().toISOString(),
  };

  allResults.push(newResult);
  saveToStorage(RESULTS_KEY, allResults);

  return Promise.resolve(newResult);
}

export async function getQuizResultsForUser(userId: string): Promise<QuizResult[]> {
    const allResults = getFromStorage<QuizResult>(RESULTS_KEY);
    const userResults = allResults
        .filter(result => result.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort descending

    return Promise.resolve(userResults);
}