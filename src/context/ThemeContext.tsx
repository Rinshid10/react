import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType } from '../types';

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
