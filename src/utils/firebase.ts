import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
export let db: Firestore | null = null;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Failed to initialize Firebase:", error);
  }
}

export const saveBallotToFirestore = async (ballotData: any) => {
  if (!db) return;
  try {
    const docId = (ballotData.userEmail || ballotData.userName || 'anonymous')
      .toLowerCase()
      .replace(/[^a-z0-9_@.-]/g, '_');
    await setDoc(doc(db, 'ballots', docId), {
      ...ballotData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save ballot to Firestore:", err);
  }
};

export interface GoogleUserProfile {
  name: string;
  email: string;
  avatar: string;
  uid?: string;
}

export const signInWithGoogle = async (): Promise<GoogleUserProfile> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      "Firebase credentials missing in .env file (VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID)"
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  return {
    name: user.displayName || user.email?.split('@')[0] || 'Google User',
    email: user.email || '',
    avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || user.email || 'User')}`,
    uid: user.uid
  };
};

export const logoutGoogle = async (): Promise<void> => {
  if (auth) {
    await firebaseSignOut(auth);
  }
};

export const subscribeToAuthChanges = (
  onUserChanged: (userProfile: GoogleUserProfile | null) => void
) => {
  if (!auth) {
    onUserChanged(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      onUserChanged({
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        email: user.email || '',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || user.email || 'User')}`,
        uid: user.uid
      });
    } else {
      onUserChanged(null);
    }
  });
};
