import { configureStore } from '@reduxjs/toolkit';
import { pizzaApi } from './api/pizzaApi';
import { orderApi } from './api/orderApi';
import cartReducer from './slices/cartSlice';
import filterReducer from './slices/filterSlice';
import toastReducer from './slices/toastSlice';
import cartOpenerReducer from './slices/cartOpenerSlice';

export const store = configureStore({
  reducer: {
    [pizzaApi.reducerPath]: pizzaApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    cart: cartReducer,
    filter: filterReducer,
    toast: toastReducer,
    cartOpener: cartOpenerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pizzaApi.middleware, orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

