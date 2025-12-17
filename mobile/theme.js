import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('theme');
        if (v) setTheme(v);
      } catch (e) {}
    })();
  }, []);
  const toggleTheme = async () => {
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', next).catch(() => {});
      return next;
    });
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
