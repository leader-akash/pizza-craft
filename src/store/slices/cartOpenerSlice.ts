import { createSlice } from '@reduxjs/toolkit';

interface CartOpenerState {
  shouldOpen: boolean;
}

const initialState: CartOpenerState = {
  shouldOpen: false,
};

const cartOpenerSlice = createSlice({
  name: 'cartOpener',
  initialState,
  reducers: {
    openCart: (state) => {
      state.shouldOpen = true;
    },
    closeCart: (state) => {
      state.shouldOpen = false;
    },
  },
});

export const { openCart, closeCart } = cartOpenerSlice.actions;
export const selectShouldOpenCart = (state: { cartOpener: CartOpenerState }) =>
  state.cartOpener.shouldOpen;
export default cartOpenerSlice.reducer;

