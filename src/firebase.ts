import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeU8L5QChWQH3s3Ie2x4mTsXu9cJDZK5M",
  authDomain: "geolum-6354d.firebaseapp.com",
  projectId: "geolum-6354d",
  storageBucket: "geolum-6354d.appspot.com",
  messagingSenderId: "1093226951167",
  appId: "1:1093226951167:web:15a7869790e4e0008db7ca"
  // measurementId: "G-EQ8F1YED4M" // (optional, only if you use analytics)
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
const storage = getStorage(app);

export { auth, db, provider, storage };

// Call this when the user changes their avatar
export async function updateUserAvatar(userId: string, avatar: string) {
  await setDoc(
    doc(db, "users", userId),
    { avatar },
    { merge: true }
  );
}

// file: a File object from an <input type=\"file\">
// userId: the user's UID
export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
  await uploadBytes(avatarRef, file);
  const url = await getDownloadURL(avatarRef);
  return url;
} 