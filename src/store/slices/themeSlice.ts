import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'dark';

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state) => {
      state.theme = 'dark';
      if (typeof window !== 'undefined') {
        // Clear any old theme data from localStorage
        localStorage.removeItem('theme');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export default themeSlice.reducer;

