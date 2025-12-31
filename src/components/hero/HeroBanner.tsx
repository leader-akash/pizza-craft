import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Clock, Award, Flame, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/utils/cn';

const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
    });
  }
};

export const HeroBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/15 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]"
        />

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating pizzas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { x: '10%', y: '20%', delay: 0, size: 80, rotate: 15 },
          { x: '85%', y: '15%', delay: 1, size: 60, rotate: -20 },
          { x: '75%', y: '70%', delay: 2, size: 70, rotate: 30 },
          { x: '15%', y: '75%', delay: 1.5, size: 65, rotate: -10 },
          { x: '50%', y: '85%', delay: 0.5, size: 50, rotate: 45 },
          { x: '90%', y: '50%', delay: 2.5, size: 55, rotate: -25 },
        ].map((pizza, index) => (
          <motion.div
            key={index}
            style={{ left: pizza.x, top: pizza.y, fontSize: pizza.size }}
            animate={{
              y: [0, -30, 0],
              rotate: [pizza.rotate, pizza.rotate + 15, pizza.rotate],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              delay: pizza.delay,
              ease: 'easeInOut',
            }}
            className="absolute opacity-20 drop-shadow-2xl"
          >
            🍕
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4 max-w-6xl mx-auto py-12 sm:py-16 pb-20 sm:pb-28"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-300 font-medium tracking-wide">Artisan Pizzas • Fresh Daily • Since 2024</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mb-8"
        >
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight">
            Craft Your
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 bg-clip-text text-transparent tracking-tight">
            Perfect Pizza
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Experience the art of authentic pizza making with{' '}
          <span className="text-orange-400 font-medium">premium ingredients</span>,
          hand-tossed dough, and recipes perfected over generations.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={() => smoothScrollTo('menu')}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'group px-8 py-4 rounded-2xl font-bold text-lg',
              'bg-gradient-to-r from-orange-500 via-orange-600 to-red-500',
              'text-white shadow-xl shadow-orange-500/30',
              'transition-all duration-300',
              'flex items-center gap-3 cursor-pointer'
            )}
          >
            <UtensilsCrossed className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Explore Menu
          </motion.button>
          <motion.button
            onClick={() => smoothScrollTo('menu')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'px-8 py-4 rounded-2xl font-bold text-lg',
              'bg-white/5 backdrop-blur-sm border border-white/10',
              'text-white hover:bg-white/10 hover:border-white/20',
              'transition-all duration-300 cursor-pointer'
            )}
          >
            Today's Specials ✨
          </motion.button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8"
        >
          <FeatureBadge icon={<Clock className="w-5 h-5" />} text="30 Min Delivery" />
          <FeatureBadge icon={<Award className="w-5 h-5" />} text="Premium Quality" />
          <FeatureBadge icon={<Flame className="w-5 h-5" />} text="Wood-Fired" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-slate-500 text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-orange-500"
            />
          </div>
        </motion.div>
      </motion.div> */}
    </div>
  );
};

// Feature Badge Component
const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -2 }}
    className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full"
  >
    <span className="text-orange-400">{icon}</span>
    <span className="text-slate-300 text-sm font-medium">{text}</span>
  </motion.div>
);
