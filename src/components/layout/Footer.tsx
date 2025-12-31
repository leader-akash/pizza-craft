'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Left Column - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍕</div>
              <div>
                <h3 className="text-xl font-black text-white">PizzaCraft</h3>
                <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
                  Artisan Pizzeria
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Crafting perfect pizzas with passion and premium ingredients since 2024. Every pizza
              tells a story of flavor and tradition.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: '𝕏', label: 'Twitter' },
                { icon: '📝', label: 'Blog' },
                { icon: '📷', label: 'Instagram' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-white hover:bg-slate-700/80 hover:border-orange-500/30 transition-all"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Middle Column - Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Our Menu' },
                { href: '/add-pizza', label: 'Create Pizza' },
                { href: '/orders', label: 'Order History' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-400 hover:text-orange-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Right Column - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span>123 Pizza Street, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span>hello@pizzacraft.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Made with <span className="text-red-500">❤️</span> by PizzaCraft Team
            </p>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} PizzaCraft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
