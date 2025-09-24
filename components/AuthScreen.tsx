import React, { useState } from 'react';
import { signIn, signUp } from '../services/authService';

type AuthMode = 'signin' | 'signup';

interface AuthScreenProps {
  t: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ t }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        if (!name) {
          throw new Error(t.auth.nameRequired);
        }
        await signUp(name, email, password);
      }
      // onAuthSuccess is no longer needed; the onAuthStateChanged listener in App.tsx will handle the state change.
    } catch (err) {
      // Basic error message handling
      let message = err instanceof Error ? err.message : t.auth.unknownError;
      if (message.includes('auth/invalid-credential')) {
        message = 'Invalid email or password.';
      } else if (message.includes('auth/email-already-in-use')) {
        message = 'An account with this email already exists.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 animate-fade-in">
      <div className="bg-black bg-opacity-30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-700/50">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
          {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
                {t.auth.nameLabel}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              {t.auth.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              {t.auth.passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-full shadow-lg 
                       hover:scale-105 transform transition-transform duration-300 ease-in-out
                       disabled:opacity-50 disabled:cursor-wait disabled:scale-100"
          >
            {isLoading ? t.auth.loading : (mode === 'signin' ? t.auth.signInButton : t.auth.signUpButton)}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          {mode === 'signin' ? t.auth.noAccountPrompt : t.auth.hasAccountPrompt}{' '}
          <button onClick={toggleMode} className="font-semibold text-cyan-400 hover:underline">
            {mode === 'signin' ? t.auth.signUpLink : t.auth.signInLink}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;