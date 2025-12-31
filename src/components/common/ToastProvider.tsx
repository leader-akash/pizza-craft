'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectToasts, removeToast } from '@/store/slices/toastSlice';
import { ToastContainer } from './Toast';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={(id) => dispatch(removeToast(id))} />
    </>
  );
};

