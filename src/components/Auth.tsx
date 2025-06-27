import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Auth: React.FC<{ user: any }> = ({ user }) => {
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
    await signOut(auth);
  };

  return user ? (
    <button
      onClick={handleSignOut}
      style={{
        background: '#ef4444',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '1.1rem',
        padding: '0.5rem 1.5rem',
        boxShadow: '0 0 8px #ef4444',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        marginLeft: '1rem',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = '#b91c1c';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = '#ef4444';
      }}
    >
      Выйти
    </button>
  ) : (
    <button
      onClick={handleSignIn}
      style={{
        background: '#ef4444',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '1.1rem',
        padding: '0.5rem 1.5rem',
        boxShadow: '0 0 8px #ef4444',
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = '#b91c1c';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = '#ef4444';
      }}
    >
      Войти через Google
    </button>
  );
};

export default Auth; 