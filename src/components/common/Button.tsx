'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { tapScale, springTransition } from '@/utils/animations';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-linear-to-r from-orange-500 via-orange-600 to-red-500
    hover:from-orange-600 hover:via-orange-700 hover:to-red-600
    text-white font-semibold
    shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
    border-0
  `,
  secondary: `
    bg-slate-800/90 backdrop-blur-sm
    hover:bg-slate-700
    text-white border border-slate-600 hover:border-slate-500
  `,
  ghost: `
    bg-transparent hover:bg-white/10
    text-slate-300 hover:text-white border border-transparent
  `,
  danger: `
    bg-linear-to-r from-red-500 to-red-600
    hover:from-red-600 hover:to-red-700
    text-white shadow-lg shadow-red-500/25
    border-0
  `,
  success: `
    bg-linear-to-r from-emerald-500 to-green-500
    hover:from-emerald-600 hover:to-green-600
    text-white shadow-lg shadow-emerald-500/25
    border-0
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-xl',
  md: 'px-5 py-2.5 text-base gap-2 rounded-xl',
  lg: 'px-6 py-3 text-lg gap-2.5 rounded-2xl',
  xl: 'px-8 py-4 text-xl gap-3 rounded-2xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={!isDisabled ? tapScale : undefined}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        transition={springTransition}
        className={cn(
          'relative inline-flex items-center justify-center',
          'font-semibold',
          'transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <svg
            className="absolute animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={cn('flex items-center gap-inherit', isLoading && 'invisible')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

