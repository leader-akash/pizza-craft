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

// Helper function to parse price from search query
const parsePriceFromQuery = (query: string): { minPrice: number | null; maxPrice: number | null } => {
  const lowerQuery = query.toLowerCase().trim();
  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  // Match patterns like "$15", "15", "$15-20", "15-20", "under $20", "over $15", "below 20", "above 15"
  const pricePattern = /\$?(\d+(?:\.\d+)?)/g;
  const prices = [...lowerQuery.matchAll(pricePattern)].map((m) => parseFloat(m[1]));

  if (prices.length > 0) {
    if (lowerQuery.includes('under') || lowerQuery.includes('below') || lowerQuery.includes('less than')) {
      maxPrice = Math.max(...prices);
    } else if (lowerQuery.includes('over') || lowerQuery.includes('above') || lowerQuery.includes('more than')) {
      minPrice = Math.min(...prices);
    } else if (lowerQuery.includes('-') && prices.length >= 2) {
      // Range like "15-20" or "$15-$20"
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    } else if (prices.length === 1) {
      // Single price - search for pizzas around that price (±2)
      minPrice = prices[0] - 2;
      maxPrice = prices[0] + 2;
    }
  }

  return { minPrice, maxPrice };
};

// Helper function for filtering pizzas
export const getFilteredPizzas = (pizzas: Pizza[], filters: FilterState): Pizza[] => {
  const { searchQuery, category, isVegetarian, maxPrice, minPrice, spicyLevel, sortBy, sortOrder } =
    filters;
  let filtered = [...pizzas];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    const searchPriceFilter = parsePriceFromQuery(searchQuery);
    const hasPriceFilter = searchPriceFilter.minPrice !== null || searchPriceFilter.maxPrice !== null;
    
    // Remove price-related terms from text search
    const textQuery = query
      .replace(/\$?\d+(?:\.\d+)?/g, '')
      .replace(/\b(under|below|over|above|less than|more than)\b/gi, '')
      .replace(/-/g, '')
      .trim();

    filtered = filtered.filter((pizza) => {
      // Text search
      const matchesText = !textQuery || 
        pizza.name.toLowerCase().includes(textQuery) ||
        pizza.description.toLowerCase().includes(textQuery) ||
        pizza.ingredients.some((ing) => ing.toLowerCase().includes(textQuery));

      // Price filter from search
      const matchesPrice = !hasPriceFilter || (
        (searchPriceFilter.minPrice === null || pizza.price >= searchPriceFilter.minPrice) &&
        (searchPriceFilter.maxPrice === null || pizza.price <= searchPriceFilter.maxPrice)
      );

      return matchesText && matchesPrice;
    });
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

