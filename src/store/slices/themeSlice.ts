import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: 'dark', // Default to dark theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(action.payload);
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export default themeSlice.reducer;

