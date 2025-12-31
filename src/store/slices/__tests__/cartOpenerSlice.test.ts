import cartOpenerReducer, {
  openCart,
  closeCart,
  selectShouldOpenCart,
} from '../cartOpenerSlice';

describe('cartOpenerSlice', () => {
  const initialState = { shouldOpen: false };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(cartOpenerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should open cart', () => {
      const action = openCart();
      const state = cartOpenerReducer(initialState, action);
      expect(state.shouldOpen).toBe(true);
    });

    it('should close cart', () => {
      const state1 = cartOpenerReducer(initialState, openCart());
      const state2 = cartOpenerReducer(state1, closeCart());
      expect(state2.shouldOpen).toBe(false);
    });

    it('should toggle cart state', () => {
      const state1 = cartOpenerReducer(initialState, openCart());
      expect(state1.shouldOpen).toBe(true);
      const state2 = cartOpenerReducer(state1, closeCart());
      expect(state2.shouldOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should select shouldOpen from state', () => {
      const state = { cartOpener: { shouldOpen: true } };
      expect(selectShouldOpenCart(state)).toBe(true);
    });

    it('should return false when cart is closed', () => {
      const state = { cartOpener: { shouldOpen: false } };
      expect(selectShouldOpenCart(state)).toBe(false);
    });
  });
});

