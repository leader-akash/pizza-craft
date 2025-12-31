'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { useGetPizzasQuery } from '@/store/api/pizzaApi';
import { selectCartItems, getOrderItems, getFinalTotal } from '@/store/slices/cartSlice';
import { OrderPieData } from '@/types';
import { formatCurrency } from '@/utils/format';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fbbf24', '#f59e0b', '#d97706', '#ea580c', '#c2410c'];

export const OrderPieChart = () => {
  const { data: pizzas = [] } = useGetPizzasQuery();
  const cartItems = useAppSelector(selectCartItems);

  const chartData: OrderPieData[] = useMemo(() => {
    const orderItems = getOrderItems(cartItems, pizzas);
    if (orderItems.length === 0) {
      return [];
    }

    return orderItems.map((item, index) => ({
      name: item.pizza.name.length > 15 ? item.pizza.name.substring(0, 15) + '...' : item.pizza.name,
      value: item.finalPrice,
      color: COLORS[index % COLORS.length],
    }));
  }, [cartItems, pizzas]);

  const total = getFinalTotal(cartItems, pizzas);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-4xl mb-2">🛒</p>
          <p className="text-slate-400">Add items to cart to see order breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 h-[400px] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Order Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-400">Total: {formatCurrency(total)}</p>
      </div>
    </div>
  );
};

