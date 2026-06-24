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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  whatsappNumber: '',
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // New user — minimal data, needs onboarding
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || '',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            salonName: '',
            photoURL: fbUser.photoURL || '',
            createdAt: new Date(),
            isPremium: false,
            settings: defaultSettings,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
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