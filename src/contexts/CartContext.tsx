'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { CartItem, OrderItem, Pizza } from '@/types';

// Discount threshold: 3 or more of the same pizza = 10% off that item
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_PERCENTAGE = 0.1;

interface CartContextType {
  items: CartItem[];
  addItem: (pizzaId: string, quantity: number) => void;
  removeItem: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  increment: (pizzaId: string) => void;
  decrement: (pizzaId: string) => void;
  clearCart: () => void;
  getItemQuantity: (pizzaId: string) => number;
  getOrderItems: (pizzas: Pizza[]) => OrderItem[];
  getSubtotal: (pizzas: Pizza[]) => number;
  getTotalDiscount: (pizzas: Pizza[]) => number;
  getFinalTotal: (pizzas: Pizza[]) => number;
  isCartEmpty: boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((pizzaId: string, quantity: number) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.pizzaId === pizzaId);
      if (existingItem) {
        return prev.map((item) =>
          item.pizzaId === pizzaId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { pizzaId, quantity }];
    });
  }, []);

  const removeItem = useCallback((pizzaId: string) => {
    setItems((prev) => prev.filter((item) => item.pizzaId !== pizzaId));
  }, []);

  const updateQuantity = useCallback((pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(pizzaId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.pizzaId === pizzaId ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const increment = useCallback((pizzaId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.pizzaId === pizzaId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrement = useCallback((pizzaId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.pizzaId === pizzaId);
      if (item && item.quantity > 1) {
        return prev.map((i) => (i.pizzaId === pizzaId ? { ...i, quantity: i.quantity - 1 } : i));
      } else {
        return prev.filter((i) => i.pizzaId !== pizzaId);
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (pizzaId: string) => {
      const item = items.find((item) => item.pizzaId === pizzaId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  const getOrderItems = useCallback(
    (pizzas: Pizza[]): OrderItem[] => {
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
    },
    [items]
  );

  const getSubtotal = useCallback(
    (pizzas: Pizza[]): number => {
      const orderItems = getOrderItems(pizzas);
      return orderItems.reduce((total, item) => total + item.originalPrice, 0);
    },
    [getOrderItems]
  );

  const getTotalDiscount = useCallback(
    (pizzas: Pizza[]): number => {
      const orderItems = getOrderItems(pizzas);
      return orderItems.reduce((total, item) => total + item.discountAmount, 0);
    },
    [getOrderItems]
  );

  const getFinalTotal = useCallback(
    (pizzas: Pizza[]): number => {
      const orderItems = getOrderItems(pizzas);
      return orderItems.reduce((total, item) => total + item.finalPrice, 0);
    },
    [getOrderItems]
  );

  const isCartEmpty = useMemo(() => items.length === 0, [items.length]);
  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        increment,
        decrement,
        clearCart,
        getItemQuantity,
        getOrderItems,
        getSubtotal,
        getTotalDiscount,
        getFinalTotal,
        isCartEmpty,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

