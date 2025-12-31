'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { springTransition } from '@/utils/animations';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: {
    container: 'gap-2',
    button: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-base w-8',
  },
  md: {
    container: 'gap-3',
    button: 'w-10 h-10',
    icon: 'w-5 h-5',
    text: 'text-lg w-10',
  },
  lg: {
    container: 'gap-4',
    button: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-xl w-12',
  },
};

export const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) => {
  const styles = sizeStyles[size];
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <div className={cn('flex items-center', styles.container, className)}>
      <motion.button
        whileHover={canDecrement ? { scale: 1.1 } : undefined}
        whileTap={canDecrement ? { scale: 0.9 } : undefined}
        transition={springTransition}
        onClick={onDecrement}
        disabled={!canDecrement}
        className={cn(
          'flex items-center justify-center rounded-xl',
          'bg-slate-800 border border-slate-700',
          'text-white hover:bg-slate-700 hover:border-slate-600',
          'transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800',
          styles.button
        )}
      >
        <Minus className={styles.icon} />
      </motion.button>

      <motion.span
        key={quantity}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn('font-bold text-white text-center tabular-nums', styles.text)}
      >
        {quantity}
      </motion.span>

      <motion.button
        whileHover={canIncrement ? { scale: 1.1 } : undefined}
        whileTap={canIncrement ? { scale: 0.9 } : undefined}
        transition={springTransition}
        onClick={onIncrement}
        disabled={!canIncrement}
        className={cn(
          'flex items-center justify-center rounded-xl',
          'bg-linear-to-r from-orange-500 to-orange-600',
          'border border-orange-400/50',
          'text-white hover:from-orange-600 hover:to-orange-700',
          'shadow-lg shadow-orange-500/20',
          'transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          styles.button
        )}
      >
        <Plus className={styles.icon} />
      </motion.button>
    </div>
  );
};

