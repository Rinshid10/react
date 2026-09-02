import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType } from '../types';
import { fetchThemeSettings } from '../lib/appwrite';

// Convert "#rrggbb" to "r, g, b" for use inside rgba(...) CSS.
const hexToRgb = (hex: string): string => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

// Create context with undefined as initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to access theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider component that manages dark/light mode
 * and tracks the currently active section for navigation
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Initialize dark mode from localStorage or default to true
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('darkMode');
        if (saved) {
          const parsed = JSON.parse(saved);
          return typeof parsed === 'boolean' ? parsed : true;
        }
      }
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
    }
    return true;
  });

  // Track the currently visible section for navigation highlighting
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Persist theme preference and apply body class
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  // Fetch theme settings from the admin backend and apply them as CSS
  // variables. Falls back silently to the values baked into global.css.
  useEffect(() => {
    let cancelled = false;

    const applyTheme = async () => {
      try {
        const t = await fetchThemeSettings();
        if (cancelled || !t) return;

        const root = document.documentElement;
        if (t.primaryColor) {
          root.style.setProperty('--color-accent', t.primaryColor);
          root.style.setProperty('--color-accent-light', t.secondaryColor || t.primaryColor);
          root.style.setProperty('--shadow-glow', `0 0 40px rgba(${hexToRgb(t.primaryColor)}, 0.3)`);
        }
        if (t.primaryColor && t.secondaryColor) {
          root.style.setProperty(
            '--gradient-primary',
            `linear-gradient(135deg, ${t.primaryColor} 0%, ${t.secondaryColor} 50%, ${t.accentColor || t.secondaryColor} 100%)`
          );
        }
        if (t.darkBackground) {
          root.style.setProperty('--color-bg-primary', t.darkBackground);
        }

        // Honor the configured default mode only if the visitor has no
        // saved preference yet.
        if (localStorage.getItem('darkMode') == null && typeof t.defaultDarkMode === 'boolean') {
          setIsDarkMode(t.defaultDarkMode);
        }
      } catch {
        // Appwrite offline or unconfigured — keep CSS defaults.
      }
    };

    applyTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  // Toggle between dark and light mode
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    activeSection,
    setActiveSection,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
