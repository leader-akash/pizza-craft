'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Pizza, DollarSign, Sparkles, ChevronDown, Clock, Award, Flame } from 'lucide-react';
import { PizzaFilters, PizzaList } from '@/components/pizza';
import { PriceChart, OrderPieChart } from '@/components/charts';
import { Badge } from '@/components/common';
import { useGetPizzasQuery } from '@/store/api/pizzaApi';
import { useAppSelector } from '@/store/hooks';
import { selectFilters, getFilteredPizzas } from '@/store/slices/filterSlice';
import { selectCartItems, selectCartItemCount, getFinalTotal } from '@/store/slices/cartSlice';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { staggerContainer, fadeUpItem } from '@/utils/animations';
import { HeroBanner } from '@/components/hero';

export default function Dashboard() {
  const { data: pizzas = [] } = useGetPizzasQuery();
  const filters = useAppSelector(selectFilters);
  const cartItems = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);

  const filteredPizzas = getFilteredPizzas(pizzas, filters);
  const cartTotal = getFinalTotal(cartItems, pizzas);

  // Generate random values only on client to avoid hydration mismatch
  const [pizzaAnimations, setPizzaAnimations] = useState<Array<{
    rotate: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Generate random values only on client side
    setPizzaAnimations(
      Array.from({ length: 8 }, () => ({
        rotate: Math.random() * 360,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const promotionalBadgeClass = 'bg-white/20 text-white border-transparent '

  const badges = [
    // {
    //   label: "Auto-applied at checkout",
    //   icon: "🎉",
    // },
    {
      label: "Save up to 10%",
      icon: "💰",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}

      <HeroBanner />


      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            <StatCard
              icon={<Pizza className="w-6 h-6" />}
              label="Menu Items"
              value={filteredPizzas.length.toString()}
              color="orange"
              delay={0}
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Happy Customers"
              value="10K+"
              color="emerald"
              delay={0.1}
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Items in Cart"
              value={itemCount.toString()}
              color="amber"
              delay={0.2}
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Cart Total"
              value={formatCurrency(cartTotal)}
              color="red"
              delay={0.3}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Menu Section */}
      <section id="menu" className="py-12 px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-medium text-sm mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Explore Our Menu
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Delicious <span className="bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Pizzas</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base lg:text-lg leading-relaxed">
              From classic favorites to bold specialty creations, discover your next favorite pizza
              crafted with premium ingredients.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <PizzaFilters />
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center justify-between"
          >
            <p className="text-slate-400 text-sm">
              Showing <span className="text-white font-bold text-base">{filteredPizzas.length}</span> pizzas
            </p>
          </motion.div>

          {/* Pizza Grid */}
          <PizzaList pizzas={filteredPizzas} />
        </div>
      </section>

      {/* Charts Section */}
      <section id="specials" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-4">
              📊 Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Menu Analytics</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base lg:text-lg">
              Explore pricing insights and track your current order breakdown
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceChart />
            <OrderPieChart />
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center !m-8">
        <div className="w-full p-4 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              'relative overflow-hidden rounded-3xl',
              'bg-linear-to-br from-orange-600 via-orange-500 to-red-500',
              'p-8 sm:p-12 lg:p-16'
            )}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full"
              />
              {/* Floating pizzas */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  className="absolute text-4xl opacity-20"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${20 + (i % 2) * 50}%`,
                  }}
                >
                  🍕
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  Order 3+ of the<br />Same Pizza
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-lg leading-relaxed ">
                  Get an instant <strong className="text-white">10% discount</strong> on that item! Perfect for parties,
                  gatherings, or just stocking up on your favorites.
                </p>
                <div className="flex flex-wrap gap-3 space-y-2 justify-center items-center lg:justify-start lg:items-center mt-4">
                  {badges.map((badge) => (
                    <Badge 
                    key={badge.label} 
                    className={promotionalBadgeClass}
                    size="md"
                    >
                      {badge.icon} {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="text-[100px] sm:text-[140px] drop-shadow-2xl"
                >
                  🍕
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'emerald' | 'amber' | 'red';
  delay?: number;
}

const colorStyles = {
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    icon: 'text-orange-400 bg-orange-500/10',
    glow: 'hover:shadow-orange-500/10',
  },
  emerald: {
    bg: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    icon: 'text-emerald-400 bg-emerald-500/10',
    glow: 'hover:shadow-emerald-500/10',
  },
  amber: {
    bg: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    icon: 'text-amber-400 bg-amber-500/10',
    glow: 'hover:shadow-amber-500/10',
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    border: 'border-red-500/20 hover:border-red-500/40',
    icon: 'text-red-400 bg-red-500/10',
    glow: 'hover:shadow-red-500/10',
  },
};

const StatCard = ({ icon, label, value, color, delay = 0 }: StatCardProps) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ delay }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-4 sm:p-5',
        'bg-linear-to-br border backdrop-blur-sm',
        'transition-all duration-300',
        'hover:shadow-xl',
        styles.bg,
        styles.border,
        styles.glow
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={cn('p-2.5 sm:p-3 rounded-xl', styles.icon)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-slate-400 text-xs sm:text-sm font-medium truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-black text-white truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};
