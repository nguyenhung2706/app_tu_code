import { createContext, useContext, useState, ReactNode } from 'react';

const lightColors = {
  bg: '#f5f5f5',
  card: '#FFFFFF',
  text: '#222222',
  sub: 'gray',
  border: '#eeeeee',
};

const darkColors = {
  bg: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  sub: '#9E9E9E',
  border: '#333333',
};

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  colors: typeof lightColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const colors = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được dùng bên trong ThemeProvider');
  }
  return context;
}