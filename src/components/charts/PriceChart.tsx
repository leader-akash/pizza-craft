'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGetPizzasQuery } from '@/store/api/pizzaApi';
import { PriceChartData } from '@/types';
import { formatCurrency } from '@/utils/format';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fbbf24', '#f59e0b', '#d97706'];

export const PriceChart = () => {
  const { data: pizzas = [] } = useGetPizzasQuery();

  const chartData: PriceChartData[] = useMemo(() => {
    return [...pizzas]
      .sort((a, b) => b.price - a.price)
      .slice(0, 8)
      .map((pizza) => ({
        name: pizza.name.length > 12 ? pizza.name.substring(0, 12) + '...' : pizza.name,
        price: pizza.price,
        category: pizza.category,
      }));
  }, [pizzas]);

  return (
    <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 h-[400px] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Pizza Prices</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="price" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

