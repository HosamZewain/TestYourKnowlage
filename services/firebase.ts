import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace this with your own Firebase project's configuration
// You can find this in your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDrXIAeSoYJLYId7fCCeX2eNZRXoJcRM04",
  authDomain: "test-your-knowlage.firebaseapp.com",
  projectId: "test-your-knowlage",
  storageBucket: "test-your-knowlage.firebasestorage.app",
  messagingSenderId: "73216669654",
  appId: "1:73216669654:web:39159b1a1e0f8494ea5677",
  measurementId: "G-JV8NY3WKRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
