'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

// Simple spinning loader
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className={cn(
      'border-2 border-slate-600 border-t-orange-500 rounded-full',
      spinnerSizes[size],
      className
    )}
  />
);

// Animated dots loader
interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots = ({ className }: LoadingDotsProps) => (
  <div className={cn('flex gap-1', className)}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
        }}
        className="w-2 h-2 rounded-full bg-orange-500"
      />
    ))}
  </div>
);

// Fun pizza loader
export const PizzaLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1, repeat: Infinity },
        }}
        className="text-6xl"
      >
        🍕
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-slate-300 font-medium"
      >
        Preparing your pizza...
      </motion.p>
    </div>
  );
};

// Full page loader
export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-50">
    <PizzaLoader />
  </div>
);

// Skeleton loader for cards
interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <motion.div
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={cn('bg-slate-700 rounded-lg', className)}
  />
);

// Pizza card skeleton
export const PizzaCardSkeleton = () => (
  <div className="bg-slate-800/80 border border-slate-600 rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  </div>
);

