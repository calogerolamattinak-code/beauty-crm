import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, UserSettings } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, salonName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  workingHours: {
    monday: { start: '09:00', end: '19:00', isActive: true },
    tuesday: { start: '09:00', end: '19:00', isActive: true },
    wednesday: { start: '09:00', end: '19:00', isActive: true },
    thursday: { start: '09:00', end: '19:00', isActive: true },
    friday: { start: '09:00', end: '19:00', isActive: true },
    saturday: { start: '09:00', end: '17:00', isActive: true },
    sunday: { start: '00:00', end: '00:00', isActive: false },
  },
  breakDuration: 15,
  reminderEnabled: false,
  reminderHoursBefore: 24,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUserRef = { current: () => {} };

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      // Clean up previous user listener
      unsubUserRef.current();

      if (fbUser) {
        // Listen to user document in real-time — auto-updates after Settings saves
        const unsubUser = onSnapshot(
          doc(db, 'users', fbUser.uid),
          (snap) => {
            if (snap.exists()) {
              setUser(snap.data() as User);
            } else {
              // New user — create Firestore doc so updateDoc works in Settings/Onboarding
              const newUser: User = {
                id: fbUser.uid,
                name: fbUser.displayName || '',
                email: fbUser.email || '',
                phone: fbUser.phoneNumber || '',
                salonName: '',
                photoURL: fbUser.photoURL || '',
                createdAt: new Date(),
                isPremium: false,
                settings: defaultSettings,
              };
              setDoc(doc(db, 'users', fbUser.uid), {
                ...newUser,
                createdAt: serverTimestamp(),
              }).catch((e) =>
                console.error('Error creating user doc for Google sign-in:', e)
              );
              setUser(newUser);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to user doc:', error);
            setLoading(false);
          }
        );
        unsubUserRef.current = unsubUser;
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubUserRef.current();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string, salonName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    // Create user document in Firestore
    const newUser: User = {
      id: uid,
      name,
      email,
      phone: '',
      salonName,
      createdAt: new Date(),
      isPremium: false,
      settings: defaultSettings,
    };

    await setDoc(doc(db, 'users', uid), {
      ...newUser,
      createdAt: serverTimestamp(),
    });

    setUser(newUser);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}