'use client';

import { Pizza } from '@/types';
import { PizzaCard } from './PizzaCard';
import { NoPizzasFound } from '@/components/common';
import { useAppDispatch } from '@/store/hooks';
import { resetFilters } from '@/store/slices/filterSlice';

interface PizzaListProps {
  pizzas: Pizza[];
}

export const PizzaList = ({ pizzas }: PizzaListProps) => {
  const dispatch = useAppDispatch();

  if (pizzas.length === 0) {
    return <NoPizzasFound onReset={() => dispatch(resetFilters())} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pizzas.map((pizza, index) => (
        <PizzaCard key={pizza.id} pizza={pizza} index={index} />
      ))}
    </div>
  );
};

