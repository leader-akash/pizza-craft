'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pizza';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  animate?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/80 text-slate-200 border-slate-600/50',
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pizza: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  animate = false,
  icon,
}: BadgeProps) => {
  const Component = animate ? motion.span : 'span';
  const animateProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
      }
    : {};

  return (
    <Component
      {...animateProps}
      className={cn(
        'inline-flex items-center gap-1.5',
        'font-semibold rounded-full border',
        'backdrop-blur-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Component>
  );
};

// Spicy level indicator
interface SpicyBadgeProps {
  level: 0 | 1 | 2 | 3;
  showLabel?: boolean;
  className?: string;
}

export const SpicyBadge = ({ level, showLabel = true, className }: SpicyBadgeProps) => {
  if (level === 0) return null;

  const peppers = '🌶️'.repeat(level);
  const labels = ['', 'Mild', 'Medium', 'Hot'];
  const colors = ['', 'text-amber-400', 'text-orange-400', 'text-red-400'];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg',
        'bg-slate-800/80 border border-slate-700/50',
        colors[level],
        className
      )}
    >
      <span className="text-sm">{peppers}</span>
      {showLabel && <span className="text-xs font-semibold">{labels[level]}</span>}
    </span>
  );
};

// Vegetarian badge
export const VegetarianBadge = ({ className }: { className?: string }) => (
  <Badge variant="success" size="sm" className={className} icon="🥬">
    Vegetarian
  </Badge>
);

// Popular badge
export const PopularBadge = ({ className }: { className?: string }) => (
  <Badge variant="pizza" size="sm" className={cn(className)} icon="⭐">
    Popular
  </Badge>
);

// Category badge
interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const categoryIcons: Record<string, string> = {
    classic: '🍕',
    meat: '🥩',
    vegetarian: '🥗',
    specialty: '✨',
  };

  return (
    <Badge
      variant="default"
      size="sm"
      className={cn('capitalize', className)}
      icon={categoryIcons[category] || '🍕'}
    >
      {category}
    </Badge>
  );
};

