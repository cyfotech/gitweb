import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('preferred-tax-theme');
        if (saved === 'light' || saved === 'dark') return saved;
      } catch {
        // Continue to system preference if localStorage is unavailable.
      }

      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }

    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    // The project uses .dark for Tailwind and data-theme for theme-aware CSS.
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;

    try {
      localStorage.setItem('preferred-tax-theme', theme);
    } catch {
      // Ignore storage errors in restricted browser contexts.
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
