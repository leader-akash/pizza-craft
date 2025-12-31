'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectTheme, toggleTheme } from '@/store/slices/themeSlice';
import { cn } from '@/utils/cn';

export const ThemeToggle = () => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();


  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={cn(
        'p-2.5 rounded-xl transition-all',
        'bg-slate-800/80 text-slate-400 hover:text-white',
        'border border-slate-700/50',
        'hover:bg-slate-800'
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

