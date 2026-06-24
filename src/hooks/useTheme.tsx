import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { getTheme, themeToCSSVars, type Theme, type ThemeName } from '../lib/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyThemeToDOM(theme: Theme) {
  const vars = themeToCSSVars(theme);
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  document.documentElement.setAttribute('data-theme', theme.name);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { firebaseUser } = useAuth();
  const [themeName, setThemeName] = useState<ThemeName>('green');
  const [loading, setLoading] = useState(true);

  // Load theme from Firestore on mount & user change
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) {
      // Default theme for non-logged-in users
      applyThemeToDOM(getTheme('green'));
      setThemeName('green');
      setLoading(false);
      return;
    }

    const loadTheme = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const saved = userDoc.data()?.settings?.theme as ThemeName | undefined;
          if (saved && ['rose', 'purple', 'green'].includes(saved)) {
            setThemeName(saved);
            applyThemeToDOM(getTheme(saved));
          } else {
            applyThemeToDOM(getTheme('green'));
          }
        } else {
          applyThemeToDOM(getTheme('green'));
        }
      } catch {
        applyThemeToDOM(getTheme('green'));
      }
      setLoading(false);
    };

    loadTheme();
  }, [firebaseUser?.uid]);

  const setTheme = useCallback(async (name: ThemeName) => {
    setThemeName(name);
    const theme = getTheme(name);
    applyThemeToDOM(theme);

    // Save to Firestore
    const uid = firebaseUser?.uid;
    if (uid) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          'settings.theme': name,
        });
      } catch (err) {
        console.error('Error saving theme:', err);
      }
    }
  }, [firebaseUser?.uid]);

  return (
    <ThemeContext.Provider value={{ theme: getTheme(themeName), themeName, setTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}