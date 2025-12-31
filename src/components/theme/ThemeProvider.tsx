'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectTheme, setTheme } from '@/store/slices/themeSlice';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  // Initialize theme on mount from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const initialTheme = savedTheme || 'dark';
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(initialTheme);
      
      // Update Redux store if different from saved theme
      if (savedTheme && savedTheme !== theme) {
        dispatch(setTheme(initialTheme));
      }
    }
  }, [dispatch, theme]);

  // Apply theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
};

