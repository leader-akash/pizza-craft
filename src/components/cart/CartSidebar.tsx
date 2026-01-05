'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { overlayVariants, slideInFromRight } from '@/utils/animations';
import { Button, EmptyCart, QuantitySelector } from '@/components/common';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useGetPizzasQuery } from '@/store/api/pizzaApi';
import {
  selectCartItems,
  selectCartItemCount,
  selectIsCartEmpty,
  getOrderItems,
  getSubtotal,
  getTotalDiscount,
  getFinalTotal,
  increment,
  decrement,
  removeItem,
  clearCart,
} from '@/store/slices/cartSlice';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import { useState } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { data: pizzas = [] } = useGetPizzasQuery();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const isCartEmpty = useAppSelector(selectIsCartEmpty);
  const dispatch = useAppDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const orderItems = getOrderItems(items, pizzas);
  const subtotal = getSubtotal(items, pizzas);
  const totalDiscount = getTotalDiscount(items, pizzas);
  const finalTotal = getFinalTotal(items, pizzas);

  const handleCheckout = () => {
    setShowConfirmation(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Sidebar */}
            <motion.div
              variants={slideInFromRight}
              initial="hidden"
              animate="show"
              exit="exit"
              className={cn(
                'fixed top-0 right-0 bottom-0 w-full sm:w-[440px]',
                'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
                'border-l border-slate-700/50',
                'flex flex-col z-50',
                'shadow-2xl shadow-black/50'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-2xl border border-orange-500/30">
                    <ShoppingBag className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Order</h2>
                    <p className="text-sm text-slate-400">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isCartEmpty && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(clearCart())}
                      className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isCartEmpty ? (
                  <div className="h-full flex items-center justify-center p-6">
                    <EmptyCart
                      action={
                        <Button variant="primary" onClick={onClose}>
                          Browse Menu
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="p-5 sm:p-6 space-y-4">
                    <AnimatePresence mode="popLayout">
                      {orderItems.map((item) => (
                        <motion.div
                          key={item.pizza.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          layout
                          className={cn(
                            'relative overflow-hidden rounded-2xl',
                            'bg-linear-to-br from-slate-800/80 to-slate-900/80',
                            'border border-slate-700/50',
                            'hover:border-slate-600/50 transition-all duration-300'
                          )}
                        >
                          <div className="flex gap-4 p-4">
                            {/* Image */}
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-700/50">
                              <Image
                                src={item.pizza.imageUrl}
                                alt={item.pizza.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-white text-lg truncate">
                                  {item.pizza.name}
                                </h4>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => dispatch(removeItem(item.pizza.id))}
                                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </div>
                              <p className="text-sm text-slate-400 mt-1">
                                {formatCurrency(item.pizza.price)} each
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-4">
                                <QuantitySelector
                                  quantity={item.quantity}
                                  onIncrement={() => dispatch(increment(item.pizza.id))}
                                  onDecrement={() => dispatch(decrement(item.pizza.id))}
                                  size="sm"
                                />
                                <div className="text-right">
                                  {item.discountAmount > 0 && (
                                    <p className="text-xs text-slate-500 line-through">
                                      {formatCurrency(item.originalPrice)}
                                    </p>
                                  )}
                                  <p className="font-bold text-orange-400">
                                    {formatCurrency(item.finalPrice)}
                                  </p>
                                  {item.discountAmount > 0 && (
                                    <p className="text-xs text-emerald-400">
                                      Save {formatCurrency(item.discountAmount)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer - Summary */}
              {!isCartEmpty && (
                <div className="border-t border-slate-800 p-5 sm:p-6 space-y-4 bg-slate-900/50">
                  <div className="space-y-2">
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
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-800">
                      <span className="text-white">Total</span>
                      <span className="text-orange-400">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                  <Button variant="primary" fullWidth onClick={handleCheckout} size="lg">
                    Confirm Order
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OrderConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false);
          onClose();
        }}
        orderItems={orderItems}
        subtotal={subtotal}
        totalDiscount={totalDiscount}
        finalTotal={finalTotal}
      />
    </>
  );
};

