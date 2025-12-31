'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Toast as ToastType } from '@/store/slices/toastSlice';
import { cn } from '@/utils/cn';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: {
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: 'text-emerald-400',
    text: 'text-white',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-400',
    text: 'text-white',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-white',
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: 'text-amber-400',
    text: 'text-white',
  },
};

export const Toast = ({ toast, onRemove }: ToastProps) => {
  const Icon = toastIcons[toast.type];
  const styles = toastStyles[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 20, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md',
        'min-w-[320px] max-w-md shadow-xl',
        styles.bg
      )}
    >
      <div className={cn('shrink-0', styles.icon)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', styles.text)}>{toast.message}</p>
        {toast.type === 'success' && toast.message.includes('cart') && (
          <p className="text-xs text-slate-400 mt-0.5">Click cart to view items</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          'shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors',
          styles.text
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse items-center gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto"
          >
            <Toast toast={toast} onRemove={onRemove} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

