import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, PizzaCategory, SortOption, Pizza } from '@/types';

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

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<PizzaCategory | 'all'>) => {
      state.category = action.payload;
    },
    setVegetarian: (state, action: PayloadAction<boolean | null>) => {
      state.isVegetarian = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number | null>) => {
      state.maxPrice = action.payload;
    },
    setMinPrice: (state, action: PayloadAction<number | null>) => {
      state.minPrice = action.payload;
    },
    setSpicyLevel: (state, action: PayloadAction<number | null>) => {
      state.spicyLevel = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    resetFilters: () => initialState,
  },
});

export const {
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
} = filterSlice.actions;

// Selectors
export const selectFilters = (state: { filter: FilterState }) => state.filter;
export const selectActiveFilterCount = (state: { filter: FilterState }) => {
  const { searchQuery, category, isVegetarian, maxPrice, minPrice, spicyLevel } = state.filter;
  let count = 0;
  if (searchQuery.trim()) count++;
  if (category !== 'all') count++;
  if (isVegetarian !== null) count++;
  if (maxPrice !== null) count++;
  if (minPrice !== null) count++;
  if (spicyLevel !== null) count++;
  return count;
};

// Helper function for filtering pizzas
export const getFilteredPizzas = (pizzas: Pizza[], filters: FilterState): Pizza[] => {
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
};

export default filterSlice.reducer;

