import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Auth: React.FC<{ user: any; onBeforeSignOut?: () => void }> = ({ user, onBeforeSignOut }) => {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // Optionally show a message or just silently ignore
        console.log('Sign-in popup was closed by the user.');
      } else {
        console.error(error);
      }
    }
  };

  const handleSignOut = async () => {
    if (onBeforeSignOut) onBeforeSignOut();
    await signOut(auth);
  };

  return user ? (
    <button
      onClick={handleSignOut}
      className="bg-red-500 hover:bg-red-700 text-white border-2 border-white rounded-xl font-bold text-base sm:text-lg px-4 py-2 shadow-md transition-all duration-200 ml-0 sm:ml-4 mt-2 sm:mt-0 w-full sm:w-auto"
      style={{
        boxShadow: '0 0 8px #ef4444',
      }}
    >
      Выйти
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      className="bg-red-500 hover:bg-red-700 text-white border-2 border-white rounded-xl font-bold text-base sm:text-lg px-4 py-2 shadow-md transition-all duration-200 w-full sm:w-auto"
      style={{
        boxShadow: '0 0 8px #ef4444',
      }}
    >
      Войти
    </button>
  );
};

export default Auth; 