'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeUpItem } from '@/utils/animations';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      variants={fadeUpItem}
      initial="hidden"
      animate="show"
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
    >
      {icon && (
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-6xl mb-4"
        >
          {icon}
        </motion.div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-slate-300 max-w-sm mb-6">{description}</p>}
      {action}
    </motion.div>
  );
};

// Preset empty states
export const EmptyCart = ({ action }: { action?: ReactNode }) => (
  <EmptyState
    icon="🛒"
    title="Your cart is empty"
    description="Looks like you haven't added any delicious pizzas yet. Start exploring our menu!"
    action={action}
  />
);

export const NoPizzasFound = ({ onReset }: { onReset?: () => void }) => (
  <EmptyState
    icon="🔍"
    title="No pizzas found"
    description="We couldn't find any pizzas matching your filters. Try adjusting your search criteria."
    action={
      onReset && (
        <button
          onClick={onReset}
          className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          Reset filters
        </button>
      )
    }
  />
);

export const NoOrders = () => (
  <EmptyState
    icon="📋"
    title="No orders yet"
    description="You haven't placed any orders yet. Start ordering some delicious pizzas!"
  />
);

