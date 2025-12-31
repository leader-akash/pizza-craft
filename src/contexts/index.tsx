'use client';

import React, { ReactNode } from 'react';
import { PizzaProvider } from './PizzaContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import { FilterProvider } from './FilterContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <PizzaProvider>
      <CartProvider>
        <OrderProvider>
          <FilterProvider>{children}</FilterProvider>
        </OrderProvider>
      </CartProvider>
    </PizzaProvider>
  );
};

