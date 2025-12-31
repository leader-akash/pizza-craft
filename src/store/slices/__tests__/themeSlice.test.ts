import themeReducer, { setTheme, toggleTheme, selectTheme } from '../themeSlice';

describe('themeSlice', () => {
  const initialState = { theme: 'dark' as const };

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as any;
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(localStorageMock.setItem);

    // Mock document.documentElement
    document.documentElement.classList.remove = jest.fn();
    document.documentElement.classList.add = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should set theme to light', () => {
      const action = setTheme('light');
      const state = themeReducer(initialState, action);
      expect(state.theme).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light');
    });

    it('should set theme to dark', () => {
      const state1 = themeReducer(initialState, setTheme('light'));
      const action = setTheme('dark');
      const state2 = themeReducer(state1, action);
      expect(state2.theme).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle theme from dark to light', () => {
      const state = themeReducer(initialState, toggleTheme());
      expect(state.theme).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should toggle theme from light to dark', () => {
      const state1 = themeReducer(initialState, setTheme('light'));
      const state2 = themeReducer(state1, toggleTheme());
      expect(state2.theme).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('selectors', () => {
    it('should select theme from state', () => {
      const state = { theme: { theme: 'light' as const } };
      expect(selectTheme(state)).toBe('light');
    });
  });
});

