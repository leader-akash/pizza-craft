import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Pizza } from '@/types';

// Discount threshold: 3 or more of the same pizza = 10% off that item
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_PERCENTAGE = 0.1;

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ pizzaId: string; quantity: number }>) => {
      const { pizzaId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.pizzaId === pizzaId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ pizzaId, quantity });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.pizzaId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ pizzaId: string; quantity: number }>) => {
      const { pizzaId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.pizzaId !== pizzaId);
      } else {
        const item = state.items.find((item) => item.pizzaId === pizzaId);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.pizzaId === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.pizzaId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.items = state.items.filter((i) => i.pizzaId !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, increment, decrement, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectIsCartEmpty = (state: { cart: CartState }) => state.cart.items.length === 0;
export const selectCartItemQuantity = (pizzaId: string) => (state: { cart: CartState }) => {
  const item = state.cart.items.find((item) => item.pizzaId === pizzaId);
  return item?.quantity ?? 0;
};

// Helper functions for calculations
export const getOrderItems = (items: CartItem[], pizzas: Pizza[]) => {
  return items.map((cartItem) => {
    const pizza = pizzas.find((p) => p.id === cartItem.pizzaId);
    if (!pizza) {
      throw new Error(`Pizza not found: ${cartItem.pizzaId}`);
    }

    const originalPrice = pizza.price * cartItem.quantity;
    const qualifiesForDiscount = cartItem.quantity >= DISCOUNT_THRESHOLD;
    const discountAmount = qualifiesForDiscount ? originalPrice * DISCOUNT_PERCENTAGE : 0;
    const finalPrice = originalPrice - discountAmount;

    return {
      pizza,
      quantity: cartItem.quantity,
      originalPrice,
      discountAmount,
      finalPrice,
    };
  });
};

export const getSubtotal = (items: CartItem[], pizzas: Pizza[]): number => {
  const orderItems = getOrderItems(items, pizzas);
  return orderItems.reduce((total, item) => total + item.originalPrice, 0);
};

export const getTotalDiscount = (items: CartItem[], pizzas: Pizza[]): number => {
  const orderItems = getOrderItems(items, pizzas);
  return orderItems.reduce((total, item) => total + item.discountAmount, 0);
};

export const getFinalTotal = (items: CartItem[], pizzas: Pizza[]): number => {
  const orderItems = getOrderItems(items, pizzas);
  return orderItems.reduce((total, item) => total + item.finalPrice, 0);
};

export default cartSlice.reducer;

