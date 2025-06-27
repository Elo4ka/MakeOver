import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function saveProgress(userId: string, progress: any) {
  try {
    if (db) {
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
    if (db) {
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

// Avatar helpers
export async function updateUserAvatar(userId: string, avatar: string) {
  await setDoc(doc(db, 'users', userId), { avatar }, { merge: true });
}

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(avatarRef, file);
  const url = await getDownloadURL(avatarRef);
  return url;
} 