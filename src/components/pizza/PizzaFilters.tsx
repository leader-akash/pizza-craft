'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, Leaf, Flame, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFilter } from '@/contexts/FilterContext';
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
  const {
    filters,
    setCategory,
    setVegetarian,
    setMaxPrice,
    setSortBy,
    setSortOrder,
    setSpicyLevel,
    resetFilters,
    activeFilterCount,
  } = useFilter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Row - Categories and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat.value)}
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
              onChange={(e) => setSortBy(e.target.value as SortOption)}
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
              onClick={() => setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc')}
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
                  setVegetarian(value === 'all' ? null : value === 'veg');
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
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
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
                onChange={(e) => setSpicyLevel(e.target.value ? Number(e.target.value) : null)}
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
                onClick={resetFilters}
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

