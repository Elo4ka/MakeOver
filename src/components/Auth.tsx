import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Auth: React.FC<{ user: any }> = ({ user }) => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return user ? (
    <button onClick={handleSignOut}>Выйти</button>
  ) : (
    <button onClick={handleSignIn}>Войти через Google</button>
  );
};

export default Auth; 