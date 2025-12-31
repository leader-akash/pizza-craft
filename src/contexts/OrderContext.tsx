'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Order } from '@/types';
import { generateOrderId } from '@/utils/format';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  removeOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  getOrderById: (orderId: string) => Order | undefined;
  currentOrderId: string | null;
  setCurrentOrderId: (id: string | null) => void;
}

const ORDER_STORAGE_KEY = 'pizza-orders';

const loadOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Failed to save orders to localStorage:', error);
  }
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const loadedOrders = loadOrdersFromStorage();
    setOrders(loadedOrders);
    setIsHydrated(true);
  }, []);

  // Save orders to localStorage whenever orders change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveOrdersToStorage(orders);
    }
  }, [orders, isHydrated]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => {
      const newOrders = [order, ...prev];
      return newOrders;
    });
    setCurrentOrderId(order.id);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  }, []);

  const removeOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    if (currentOrderId === orderId) {
      setCurrentOrderId(null);
    }
  }, [currentOrderId]);

  const clearAllOrders = useCallback(() => {
    setOrders([]);
    setCurrentOrderId(null);
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        removeOrder,
        clearAllOrders,
        getOrderById,
        currentOrderId,
        setCurrentOrderId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

