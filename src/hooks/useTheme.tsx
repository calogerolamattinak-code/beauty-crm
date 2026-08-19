import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { getTheme, themeToCSSVars, type Theme, type ThemeName } from '../lib/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => Promise<void>;
  toggleMode: () => Promise<void>;
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
  if (theme.mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { firebaseUser } = useAuth();
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const local = localStorage.getItem('beauty_crm_theme') as ThemeName | null;
    return local || 'dark';
  });
  const [loading, setLoading] = useState(true);

  // Load theme on mount & sync with Firestore if logged in
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) {
      const initial = getTheme(themeName);
      applyThemeToDOM(initial);
      setLoading(false);
      return;
    }

    const loadTheme = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const saved = userDoc.data()?.settings?.theme as ThemeName | undefined;
          if (saved && ['dark', 'light', 'rose'].includes(saved)) {
            setThemeName(saved);
            localStorage.setItem('beauty_crm_theme', saved);
            applyThemeToDOM(getTheme(saved));
          } else {
            applyThemeToDOM(getTheme(themeName));
          }
        } else {
          applyThemeToDOM(getTheme(themeName));
        }
      } catch {
        applyThemeToDOM(getTheme(themeName));
      }
      setLoading(false);
    };

    loadTheme();
  }, [firebaseUser?.uid]);

  const setTheme = useCallback(async (name: ThemeName) => {
    setThemeName(name);
    localStorage.setItem('beauty_crm_theme', name);
    const theme = getTheme(name);
    applyThemeToDOM(theme);

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

  const toggleMode = useCallback(async () => {
    const next: ThemeName = themeName === 'light' ? 'dark' : 'light';
    await setTheme(next);
  }, [themeName, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme: getTheme(themeName), themeName, setTheme, toggleMode, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
