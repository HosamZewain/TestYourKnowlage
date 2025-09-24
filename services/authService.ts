import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, QuizResult } from '../types';

// --- User Management ---

export async function signUp(name: string, email: string, password_used: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password_used);
  const firebaseUser = userCredential.user;

  const newUser: User = {
    id: firebaseUser.uid, // Use Firebase UID as the user ID
    name,
    email: firebaseUser.email || '',
  };
  
  // Create a user profile document in Firestore
  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  
  return newUser;
}

export async function signIn(email: string, password_used: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password_used);
  const firebaseUser = userCredential.user;
  
  const userProfile = await getUserProfile(firebaseUser.uid);
  if (!userProfile) {
      throw new Error("User profile not found.");
  }
  return userProfile;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function getUserProfile(userId: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return userDocSnap.data() as User;
    }
    return null;
}


// --- Quiz Result Management ---

export async function saveQuizResult(resultData: Omit<QuizResult, 'id' | 'date'>): Promise<QuizResult> {
  const resultToSave = {
    ...resultData,
    date: Timestamp.now(), // Use Firestore Timestamp for accurate sorting
  };
  
  const docRef = await addDoc(collection(db, "results"), resultToSave);

  return {
      ...resultData,
      id: docRef.id,
      date: new Date().toISOString(), // Return as ISO string for frontend
  };
}

export async function getQuizResultsForUser(userId: string): Promise<QuizResult[]> {
    const resultsCollection = collection(db, 'results');
    const q = query(
        resultsCollection, 
        where("userId", "==", userId),
        orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as QuizResult;
    });
}