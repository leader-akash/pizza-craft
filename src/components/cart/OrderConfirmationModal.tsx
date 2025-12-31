'use client';

import { Modal } from '@/components/common';
import { Button } from '@/components/common';
import { formatCurrency } from '@/utils/format';
import { OrderItem } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { useAddOrderMutation } from '@/store/api/orderApi';
import { clearCart } from '@/store/slices/cartSlice';
import { addToast } from '@/store/slices/toastSlice';
import { generateOrderId } from '@/utils/format';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
}

export const OrderConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderItems,
  subtotal,
  totalDiscount,
  finalTotal,
}: OrderConfirmationModalProps) => {
  const dispatch = useAppDispatch();
  const [addOrder] = useAddOrderMutation();

  const handleConfirm = async () => {
    const order = {
      id: generateOrderId(),
      items: orderItems,
      subtotal,
      totalDiscount,
      finalTotal,
      timestamp: new Date().toISOString(),
      status: 'confirmed' as const,
    };

    await addOrder(order);
    dispatch(clearCart());
    dispatch(
      addToast({
        type: 'success',
        message: `Order confirmed! 🎉 Order #${order.id.slice(-6)}`,
        duration: 4000,
      })
    );
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Your Order"
      description="Please review your order before confirming"
      size="md"
    >
      <div className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {orderItems.map((item) => (
            <div
              key={item.pizza.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{item.pizza.name}</p>
                <p className="text-sm text-slate-400">
                  {item.quantity} × {formatCurrency(item.pizza.price)}
                </p>
              </div>
              <div className="text-right">
                {item.discountAmount > 0 && (
                  <p className="text-xs text-slate-500 line-through">
                    {formatCurrency(item.originalPrice)}
                  </p>
                )}
                <p className="font-bold text-orange-400">{formatCurrency(item.finalPrice)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-slate-700 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white">{formatCurrency(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-400">Discount</span>
              <span className="text-emerald-400">-{formatCurrency(totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
            <span className="text-white">Total</span>
            <span className="text-orange-400">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} fullWidth>
            Confirm Order
          </Button>
        </div>
      </div>
    </Modal>
  );
};

