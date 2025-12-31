'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { FilterState, PizzaCategory, SortOption, Pizza } from '@/types';

interface FilterContextType {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setCategory: (category: PizzaCategory | 'all') => void;
  setVegetarian: (isVegetarian: boolean | null) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  setMinPrice: (minPrice: number | null) => void;
  setSpicyLevel: (spicyLevel: number | null) => void;
  setSortBy: (sortBy: SortOption) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  getFilteredPizzas: (pizzas: Pizza[]) => Pizza[];
  activeFilterCount: number;
}

const initialState: FilterState = {
  searchQuery: '',
  category: 'all',
  isVegetarian: null,
  maxPrice: null,
  minPrice: null,
  spicyLevel: null,
  sortBy: 'name',
  sortOrder: 'asc',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setCategory = useCallback((category: PizzaCategory | 'all') => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setVegetarian = useCallback((isVegetarian: boolean | null) => {
    setFilters((prev) => ({ ...prev, isVegetarian }));
  }, []);

  const setMaxPrice = useCallback((maxPrice: number | null) => {
    setFilters((prev) => ({ ...prev, maxPrice }));
  }, []);

  const setMinPrice = useCallback((minPrice: number | null) => {
    setFilters((prev) => ({ ...prev, minPrice }));
  }, []);

  const setSpicyLevel = useCallback((spicyLevel: number | null) => {
    setFilters((prev) => ({ ...prev, spicyLevel }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({ ...prev, sortOrder }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialState);
  }, []);

  const getFilteredPizzas = useCallback(
    (pizzas: Pizza[]): Pizza[] => {
      const { searchQuery, category, isVegetarian, maxPrice, minPrice, spicyLevel, sortBy, sortOrder } =
        filters;
      let filtered = [...pizzas];

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (pizza) =>
            pizza.name.toLowerCase().includes(query) ||
            pizza.description.toLowerCase().includes(query) ||
            pizza.ingredients.some((ing) => ing.toLowerCase().includes(query))
        );
      }

      // Apply category filter
      if (category !== 'all') {
        filtered = filtered.filter((pizza) => pizza.category === category);
      }

      // Apply vegetarian filter
      if (isVegetarian !== null) {
        filtered = filtered.filter((pizza) => pizza.isVegetarian === isVegetarian);
      }

      // Apply price range filters
      if (minPrice !== null) {
        filtered = filtered.filter((pizza) => pizza.price >= minPrice);
      }
      if (maxPrice !== null) {
        filtered = filtered.filter((pizza) => pizza.price <= maxPrice);
      }

      // Apply spicy level filter
      if (spicyLevel !== null) {
        filtered = filtered.filter((pizza) => pizza.spicyLevel === spicyLevel);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'popularity':
            comparison = (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
            break;
          case 'spicyLevel':
            comparison = a.spicyLevel - b.spicyLevel;
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      return filtered;
    },
    [filters]
  );

  const activeFilterCount = useMemo(() => {
    const { searchQuery, category, isVegetarian, maxPrice, minPrice, spicyLevel } = filters;
    let count = 0;
    if (searchQuery.trim()) count++;
    if (category !== 'all') count++;
    if (isVegetarian !== null) count++;
    if (maxPrice !== null) count++;
    if (minPrice !== null) count++;
    if (spicyLevel !== null) count++;
    return count;
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchQuery,
        setCategory,
        setVegetarian,
        setMaxPrice,
        setMinPrice,
        setSpicyLevel,
        setSortBy,
        setSortOrder,
        toggleSortOrder,
        resetFilters,
        getFilteredPizzas,
        activeFilterCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

