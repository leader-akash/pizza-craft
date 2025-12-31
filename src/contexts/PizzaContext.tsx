'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Pizza } from '@/types';
import pizzasData from '@/data/pizzas.json';

interface PizzaContextType {
  pizzas: Pizza[];
  addPizza: (pizza: Pizza) => void;
  updatePizza: (pizza: Pizza) => void;
  removePizza: (id: string) => void;
  getPizzaById: (id: string) => Pizza | undefined;
}

const PizzaContext = createContext<PizzaContextType | undefined>(undefined);

export const PizzaProvider = ({ children }: { children: ReactNode }) => {
  const [pizzas, setPizzas] = useState<Pizza[]>(pizzasData as Pizza[]);

  const addPizza = useCallback((pizza: Pizza) => {
    setPizzas((prev) => [...prev, pizza]);
  }, []);

  const updatePizza = useCallback((pizza: Pizza) => {
    setPizzas((prev) => prev.map((p) => (p.id === pizza.id ? pizza : p)));
  }, []);

  const removePizza = useCallback((id: string) => {
    setPizzas((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPizzaById = useCallback(
    (id: string) => {
      return pizzas.find((p) => p.id === id);
    },
    [pizzas]
  );

  return (
    <PizzaContext.Provider value={{ pizzas, addPizza, updatePizza, removePizza, getPizzaById }}>
      {children}
    </PizzaContext.Provider>
  );
};

export const usePizza = () => {
  const context = useContext(PizzaContext);
  if (!context) {
    throw new Error('usePizza must be used within a PizzaProvider');
  }
  return context;
};

