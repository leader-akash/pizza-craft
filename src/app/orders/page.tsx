'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { Button, ConfirmModal } from '@/components/common';
import { useOrder } from '@/contexts/OrderContext';
import { formatCurrency, formatRelativeTime, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { staggerContainer } from '@/utils/animations';
import { OrderStatus } from '@/types';
import { useState } from 'react';

const statusConfig: Record<
  OrderStatus,
  { icon: React.ReactNode; label: string; color: string; bgColor: string }
> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  confirmed: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Confirmed',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
  },
  preparing: {
    icon: <ChefHat className="w-4 h-4" />,
    label: 'Preparing',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
  },
  ready: {
    icon: <Package className="w-4 h-4" />,
    label: 'Ready',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
  },
  delivered: {
    icon: <Truck className="w-4 h-4" />,
    label: 'Delivered',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
  },
};

export default function OrdersPage() {
  const { orders, removeOrder, clearAllOrders } = useOrder();
  const [showClearModal, setShowClearModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleClearAll = () => {
    clearAllOrders();
    setShowClearModal(false);
  };

  const handleRemoveOrder = (orderId: string) => {
    removeOrder(orderId);
    setOrderToDelete(null);
  };

  // Calculate stats
  const totalOrders = orders.length;
  const totalItems = orders.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );
  const totalSpent = orders.reduce((total, order) => total + order.finalTotal, 0);
  const totalSaved = orders.reduce((total, order) => total + order.totalDiscount, 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Menu
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Order History</h1>
              <p className="text-slate-400">View and manage your past orders</p>
            </div>
            {orders.length > 0 && (
              <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {orders.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={totalOrders.toString()} />
            <StatCard icon={<Package className="w-5 h-5" />} label="Total Items" value={totalItems.toString()} />
            <StatCard icon={<DollarSign className="w-5 h-5" />} label="Total Spent" value={formatCurrency(totalSpent)} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Total Saved" value={formatCurrency(totalSaved)} />
          </motion.div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📋</p>
            <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
            <p className="text-slate-400 mb-6">You haven't placed any orders yet.</p>
            <Link href="/">
              <Button variant="primary">Start Ordering</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      'rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80',
                      'border border-slate-700/50 p-6',
                      'hover:border-slate-600/50 transition-all'
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">Order {order.id}</h3>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
                              status.color,
                              status.bgColor
                            )}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{formatRelativeTime(order.timestamp)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOrderToDelete(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.pizza.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.pizza.imageUrl}
                              alt={item.pizza.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-white">{item.pizza.name}</p>
                              <p className="text-sm text-slate-400">
                                {item.quantity} × {formatCurrency(item.pizza.price)}
                              </p>
                            </div>
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

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="text-sm text-slate-400">
                        {order.totalDiscount > 0 && (
                          <p>
                            Discount: <span className="text-emerald-400">-{formatCurrency(order.totalDiscount)}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Total</p>
                        <p className="text-xl font-bold text-orange-400">{formatCurrency(order.finalTotal)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title="Clear All Orders"
        message="Are you sure you want to clear all orders? This action cannot be undone."
        variant="danger"
      />

      {orderToDelete && (
        <ConfirmModal
          isOpen={!!orderToDelete}
          onClose={() => setOrderToDelete(null)}
          onConfirm={() => handleRemoveOrder(orderToDelete)}
          title="Delete Order"
          message="Are you sure you want to delete this order?"
          variant="danger"
        />
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-orange-400">{icon}</div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

