import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function saveProgress(userId: string, progress: any) {
  try {
    // Check if we have a real Firebase db or mock
    if (db && typeof db.collection === 'function') {
      await setDoc(doc(db, 'progress', userId), progress);
    } else {
      // Mock implementation - save to localStorage instead
      localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
      console.log('Progress saved to localStorage (Firebase not available)');
    }
  } catch (error) {
    console.warn('Failed to save progress:', error);
    // Fallback to localStorage
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  }
}

export async function loadProgress(userId: string) {
  try {
    // Check if we have a real Firebase db or mock
    if (db && typeof db.collection === 'function') {
      const docSnap = await getDoc(doc(db, 'progress', userId));
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      // Mock implementation - load from localStorage
      const savedProgress = localStorage.getItem(`progress_${userId}`);
      return savedProgress ? JSON.parse(savedProgress) : null;
    }
  } catch (error) {
    console.warn('Failed to load progress from Firebase, trying localStorage:', error);
    // Fallback to localStorage
    const savedProgress = localStorage.getItem(`progress_${userId}`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  }
} 