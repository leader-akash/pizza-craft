'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ShoppingCart, Plus, Home, History } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { selectShouldOpenCart, closeCart } from '@/store/slices/cartOpenerSlice';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Menu', icon: Home },
  { to: '/add-pizza', label: 'Create', icon: Plus },
  { to: '/orders', label: 'Orders', icon: History },
];

export const Header = () => {
  const pathname = usePathname();
  const itemCount = useAppSelector(selectCartItemCount);
  const shouldOpenCart = useAppSelector(selectShouldOpenCart);
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Listen to cart opener state
  useEffect(() => {
    if (shouldOpenCart) {
      setIsCartOpen(true);
      dispatch(closeCart());
    }
  }, [shouldOpenCart, dispatch]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'sticky top-0 left-0 right-0 z-40',
          'bg-slate-950/95 backdrop-blur-xl border-b border-orange-500/20 shadow-2xl shadow-black/30'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="text-2xl sm:text-3xl drop-shadow-lg">🍕</div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black text-white group-hover:text-orange-400 transition-colors duration-300">
                  PizzaCraft
                </span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-semibold tracking-[0.15em] uppercase hidden sm:block">
                  Artisan Pizzeria
                </span>
              </div>
            </Link>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.to;
                return (
                  <Link key={link.to} href={link.to}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all overflow-hidden group',
                        isActive
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      )}
                    >
                      <motion.div
                        className="absolute inset-0 bg-linear-to-r from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      />
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{link.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                          layoutId="activeTab"
                        />
                      )}
                    </motion.button>
                  </Link>
                );
              })}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-all"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-800 py-4"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      href={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        isActive
                          ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
          
          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-800/50 origin-left"
          >
            <motion.div
              className="h-full bg-linear-to-r from-orange-500 via-amber-500 to-red-500"
              style={{ scaleX }}
            />
          </motion.div>
        </div>
      </motion.header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

