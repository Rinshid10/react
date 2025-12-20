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
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
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
