import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
const lightColors = {
  primary: '#3B82F6',
  primaryLight: '#93C5FD',
  secondary: '#9333EA',
  backgroundLighter: '#F9FAFB',
  background: '#F3F4F6',
  backgroundDarker: '#E5E7EB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textDark: '#1F2937',
  border: '#E5E7EB',
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  tabInactive: '#9CA3AF',
  disabled: '#D1D5DB',
  inputBackground: '#F9FAFB',
};

const darkColors = {
  primary: '#3B82F6',
  primaryLight: '#1D4ED8',
  secondary: '#9333EA',
  backgroundLighter: '#1F2937',
  background: '#111827',
  backgroundDarker: '#0F172A',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textDark: '#F3F4F6',
  border: '#374151',
  success: '#22C55E',
  successLight: '#132E1F',
  warning: '#F59E0B',
  warningLight: '#422006',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  tabInactive: '#6B7280',
  disabled: '#4B5563',
  inputBackground: '#374151',
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(deviceTheme === 'dark');
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_preference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Toggle theme and save preference
  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  const themeContext: ThemeContextType = {
    isDark,
    toggleTheme,
    colors: isDark ? darkColors : lightColors,
  };
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;