'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setTheme } from '@/store/slices/themeSlice';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  // Initialize dark theme on mount and clear any old theme localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any old theme data from localStorage
      localStorage.removeItem('theme');
      const root = document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
      dispatch(setTheme());
    }
  }, [dispatch]);

  return <>{children}</>;
};

