import themeReducer, { setTheme, selectTheme } from '../themeSlice';

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
    global.localStorage = localStorageMock as typeof localStorage;
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(localStorageMock.removeItem);

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

    it('should set theme to dark and clear localStorage', () => {
      const action = setTheme();
      const state = themeReducer(initialState, action);
      expect(state.theme).toBe('dark');
      expect(localStorage.removeItem).toHaveBeenCalledWith('theme');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    });
  });

  describe('selectors', () => {
    it('should select theme from state', () => {
      const state = { theme: { theme: 'dark' as const } };
      expect(selectTheme(state)).toBe('dark');
    });
  });
});

