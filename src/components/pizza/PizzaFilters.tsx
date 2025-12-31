'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, Leaf, Flame, RotateCcw, Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectFilters,
  selectActiveFilterCount,
  setCategory,
  setVegetarian,
  setMaxPrice,
  setSortBy,
  setSortOrder,
  setSpicyLevel,
  setSearchQuery,
  resetFilters,
} from '@/store/slices/filterSlice';
import { PizzaCategory, SortOption } from '@/types';
import { Button } from '@/components/common';

const categories: { value: PizzaCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🍕' },
  { value: 'classic', label: 'Classic', icon: '🇮🇹' },
  { value: 'meat', label: 'Meat', icon: '🥩' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { value: 'specialty', label: 'Specialty', icon: '✨' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'popularity', label: 'Popular' },
  { value: 'spicyLevel', label: 'Spicy' },
];

const priceRanges = [
  { value: null, label: 'Any Price' },
  { value: 15, label: 'Under $15' },
  { value: 18, label: 'Under $18' },
  { value: 20, label: 'Under $20' },
];

const spicyLevels = [
  { value: null, label: 'Any', icon: '🌡️' },
  { value: 0, label: 'Not Spicy', icon: '😊' },
  { value: 1, label: 'Mild', icon: '🌶️' },
  { value: 2, label: 'Medium', icon: '🌶️🌶️' },
  { value: 3, label: 'Hot', icon: '🌶️🌶️🌶️' },
];

export const PizzaFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search pizzas, ingredients, or flavors..."
            className={cn(
              'w-full pl-12 pr-12 py-3.5 rounded-2xl',
              'bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90',
              'backdrop-blur-sm border border-slate-700/50',
              'text-white text-sm placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50',
              'transition-all duration-300',
              'shadow-lg shadow-black/20',
              'hover:border-slate-600/50'
            )}
          />
          {filters.searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Top Row - Categories and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setCategory(cat.value))}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold',
                'border transition-all duration-300',
                'flex items-center gap-1.5',
                filters.category === cat.value
                  ? 'bg-linear-to-r from-orange-500 to-amber-500 border-orange-400/50 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-800'
              )}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {/* Filter Toggle Button */}
          <Button
            variant={isExpanded || activeFilterCount > 0 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className={cn('relative', isExpanded && 'ring-2 ring-orange-500/30')}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
              className={cn(
                'px-3 py-2 rounded-xl text-sm',
                'bg-slate-800/50 border border-slate-700/50 text-white',
                'focus:outline-none focus:ring-2 focus:ring-orange-500/50'
              )}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'))}
              className={cn(
                'p-2 rounded-xl',
                'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white'
              )}
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vegetarian Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Leaf className="w-4 h-4 inline mr-1" />
                Dietary
              </label>
              <select
                value={filters.isVegetarian === null ? 'all' : filters.isVegetarian ? 'veg' : 'non-veg'}
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(setVegetarian(value === 'all' ? null : value === 'veg'));
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Max Price</label>
              <select
                value={filters.maxPrice || ''}
                onChange={(e) => dispatch(setMaxPrice(e.target.value ? Number(e.target.value) : null))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm"
              >
                {priceRanges.map((range) => (
                  <option key={range.value || 'any'} value={range.value || ''}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Spicy Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <Flame className="w-4 h-4 inline mr-1" />
                Spicy Level
              </label>
              <select
                value={filters.spicyLevel === null ? '' : filters.spicyLevel}
                onChange={(e) => dispatch(setSpicyLevel(e.target.value ? Number(e.target.value) : null))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm"
              >
                {spicyLevels.map((level) => (
                  <option key={level.value === null ? 'any' : level.value} value={level.value ?? ''}>
                    {level.icon} {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(resetFilters())}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                fullWidth
              >
                Reset
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

