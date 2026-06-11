import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'jarvis';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isJarvis: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('phantom-theme');
    return (savedTheme as Theme) || 'jarvis';
  });

  const isDark = theme === 'dark' || theme === 'jarvis';
  const isJarvis = theme === 'jarvis';

  const toggleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'jarvis'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  useEffect(() => {
    localStorage.setItem('phantom-theme', theme);
    
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-jarvis');
    root.classList.add(`theme-${theme}`);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (theme === 'jarvis') {
        metaThemeColor.setAttribute('content', '#00f2ff');
      } else if (theme === 'dark') {
        metaThemeColor.setAttribute('content', '#1a1a1a');
      } else {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    isJarvis,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 