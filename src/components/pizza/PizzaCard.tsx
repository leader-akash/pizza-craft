'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Leaf, Sparkles, Eye } from 'lucide-react';
import { Pizza } from '@/types';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { fadeUpItem, springTransition } from '@/utils/animations';
import { SpicyBadge } from '@/components/common';
import { useCart } from '@/contexts/CartContext';

interface PizzaCardProps {
  pizza: Pizza;
  index?: number;
}

export const PizzaCard = ({ pizza, index = 0 }: PizzaCardProps) => {
  const { addItem, increment, decrement, getItemQuantity } = useCart();
  const cartQuantity = getItemQuantity(pizza.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(pizza.id, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    increment(pizza.id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    decrement(pizza.id);
  };

  return (
    <motion.div
      variants={fadeUpItem}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      className="group h-full"
    >
      <Link href={`/pizza/${pizza.id}`} className="block h-full cursor-pointer">
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={springTransition}
          className={cn(
            'relative overflow-hidden rounded-2xl h-full',
            'bg-linear-to-br from-slate-800/90 via-slate-900 to-slate-950',
            'border border-slate-700/50',
            'shadow-xl shadow-black/20',
            'transition-all duration-500',
            'hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-2xl',
            'flex flex-col'
          )}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
            <img
              src={pizza.imageUrl}
              alt={pizza.name}
              className={cn(
                'w-full h-full object-cover transition-all duration-700',
                'group-hover:scale-110'
              )}
              loading="lazy"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {pizza.isPopular && (
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg"
                >
                  <Sparkles className="w-3 h-3" />
                  Popular
                </motion.div>
              )}
              {pizza.isVegetarian && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium shadow-lg"
                >
                  <Leaf className="w-3 h-3" />
                </motion.div>
              )}
            </div>

            {/* Quick view hint */}
            <div
              className={cn(
                'absolute top-3 right-3 p-2 rounded-xl',
                'bg-white/10 backdrop-blur-md border border-white/20',
                'opacity-0 group-hover:opacity-100 transition-all duration-300',
                'flex items-center gap-1.5'
              )}
            >
              <Eye className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">View</span>
            </div>

            {/* Price tag */}
            <div className="absolute bottom-3 left-3">
              <motion.div
                className={cn(
                  'px-3 py-1.5 rounded-xl',
                  'bg-slate-950/90 backdrop-blur-md',
                  'border border-slate-700/50',
                  'shadow-xl'
                )}
              >
                <span className="text-xl font-black bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {formatCurrency(pizza.price)}
                </span>
              </motion.div>
            </div>

            {/* Spicy badge */}
            {pizza.spicyLevel > 0 && (
              <div className="absolute bottom-3 right-3">
                <SpicyBadge level={pizza.spicyLevel} showLabel={false} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Header */}
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-300 line-clamp-1 mb-1.5">
              {pizza.name}
            </h3>

            {/* Description */}
            <p className="text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed flex-1">
              {pizza.description}
            </p>

            {/* Ingredients */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pizza.ingredients.slice(0, 3).map((ingredient) => (
                <span
                  key={ingredient}
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-md capitalize',
                    'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                  )}
                >
                  {ingredient}
                </span>
              ))}
              {pizza.ingredients.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800/50 text-slate-500">
                  +{pizza.ingredients.length - 3}
                </span>
              )}
            </div>

            {/* Add to cart section */}
            <div className="mt-auto">
              <AnimatePresence mode="wait">
                {cartQuantity > 0 ? (
                  <motion.div
                    key="counter"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between gap-3"
                  >
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDecrement}
                        className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <span className="w-10 text-center font-bold text-white text-lg">
                        {cartQuantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleIncrement}
                        className="w-9 h-9 rounded-lg bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Subtotal */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-400">
                        {formatCurrency(pizza.price * cartQuantity)}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={cn(
                      'w-full py-3 rounded-xl font-semibold',
                      'bg-linear-to-r from-orange-500 to-orange-600',
                      'hover:from-orange-400 hover:to-orange-500',
                      'text-white shadow-lg shadow-orange-500/20',
                      'flex items-center justify-center gap-2',
                      'transition-all duration-300'
                    )}
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Discount hint */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
              <span className="text-xs text-slate-400">🎉 Order 3+ for</span>
              <span className="text-xs font-bold text-orange-400">10% off</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

