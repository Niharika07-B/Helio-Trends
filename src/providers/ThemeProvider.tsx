'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'solar' | 'netflix' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTheme: 'solar' | 'netflix';
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('auto');
  const [currentTheme, setCurrentTheme] = useState<'solar' | 'netflix'>('solar');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDataSource, setActiveDataSource] = useState<'solar' | 'netflix'>('solar');

  // Auto theme switching based on data activity
  useEffect(() => {
    if (theme === 'auto') {
      // Simulate data source activity detection
      const interval = setInterval(() => {
        // In real implementation, this would check which data source is more active
        const shouldSwitch = Math.random() > 0.7; // 30% chance to switch
        if (shouldSwitch) {
          const newSource = activeDataSource === 'solar' ? 'netflix' : 'solar';
          setActiveDataSource(newSource);
          
          if (newSource !== currentTheme) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentTheme(newSource);
              setIsTransitioning(false);
            }, 250);
          }
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [theme, activeDataSource, currentTheme]);

  // Manual theme switching
  useEffect(() => {
    if (theme !== 'auto') {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTheme(theme);
        setIsTransitioning(false);
      }, 250);
    }
  }, [theme]);

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-solar', 'theme-netflix');
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Update CSS custom properties for smooth transitions
    if (currentTheme === 'solar') {
      root.style.setProperty('--theme-primary', '#f59e0b');
      root.style.setProperty('--theme-secondary', '#d97706');
      root.style.setProperty('--theme-accent', '#b45309');
      root.style.setProperty('--theme-gradient', 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)');
    } else {
      root.style.setProperty('--theme-primary', '#dc2626');
      root.style.setProperty('--theme-secondary', '#991b1b');
      root.style.setProperty('--theme-accent', '#450a0a');
      root.style.setProperty('--theme-gradient', 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #450a0a 100%)');
    }
  }, [currentTheme]);

  const value = {
    theme,
    setTheme,
    currentTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-transition ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}