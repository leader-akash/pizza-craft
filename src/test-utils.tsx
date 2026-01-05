import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './store/slices/cartSlice';
import filterReducer from './store/slices/filterSlice';
import toastReducer from './store/slices/toastSlice';
import cartOpenerReducer from './store/slices/cartOpenerSlice';
import themeReducer from './store/slices/themeSlice';
import { pizzaApi } from './store/api/pizzaApi';
import { orderApi } from './store/api/orderApi';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      [pizzaApi.reducerPath]: pizzaApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      cart: cartReducer,
      filter: filterReducer,
      toast: toastReducer,
      cartOpener: cartOpenerReducer,
      theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pizzaApi.middleware, orderApi.middleware),
    preloadedState,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createTestStore>;
}

const AllTheProviders = ({ children, store }: { children: React.ReactNode; store: ReturnType<typeof createTestStore> }) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders store={store}>{children}</AllTheProviders>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from '@testing-library/react';
export { customRender as render, createTestStore };

