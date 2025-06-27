import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if we have valid Firebase credentials
const hasValidFirebaseConfig = () => {
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mock-project",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock-app-id"
  };
  
  return config.apiKey !== "mock-api-key" && config.apiKey !== "YOUR_API_KEY";
};

// Mock Firebase config for development
const mockFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "mock-app-id"
};

let app: any;
let auth: any;
let db: any;

if (hasValidFirebaseConfig()) {
  // Use real Firebase config from environment variables
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Use mock Firebase
  console.log('Firebase not configured - using mock implementation');
  
  // Mock Firebase app
  app = {
    name: 'mock-app',
    options: mockFirebaseConfig
  };
  
  // Mock auth
  auth = {
    onAuthStateChanged: (callback: (user: any) => void) => {
      callback(null); // No user logged in
      return () => {}; // Return unsubscribe function
    },
    currentUser: null,
    signInAnonymously: () => Promise.resolve({ user: null }),
    signOut: () => Promise.resolve()
  };
  
  // Mock Firestore
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve()
      })
    })
  };
}

export { auth, db };

// Mock Firebase functions for development
export const mockFirebase = {
  auth: {
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Return a mock user or null
      callback(null);
      return () => {}; // Return unsubscribe function
    }
  }
}; 