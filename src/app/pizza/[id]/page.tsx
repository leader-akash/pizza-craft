'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Leaf, Sparkles } from 'lucide-react';
import { useGetPizzaByIdQuery, useGetPizzasQuery } from '@/store/api/pizzaApi';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCartItemQuantity, addItem, increment, decrement } from '@/store/slices/cartSlice';
import { openCart } from '@/store/slices/cartOpenerSlice';
import { addToast } from '@/store/slices/toastSlice';
import { Button, SpicyBadge, CategoryBadge } from '@/components/common';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';
import { fadeUpItem, staggerContainer } from '@/utils/animations';

export default function PizzaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: pizza, isLoading } = useGetPizzaByIdQuery(params.id as string);
  const { data: pizzas = [] } = useGetPizzasQuery();
  
  // Call hook unconditionally at the top level (Rules of Hooks)
  const cartQuantity = useAppSelector(selectCartItemQuantity(pizza?.id || ''));

  // Get related pizzas (same category, excluding current pizza)
  const relatedPizzas = pizzas
    .filter((p) => p.id !== pizza?.id && p.category === pizza?.category)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🍕</p>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pizza) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🍕</p>
          <h1 className="text-2xl font-bold text-white mb-2">Pizza Not Found</h1>
          <p className="text-slate-400 mb-6">The pizza you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            variants={fadeUpItem}
            initial="hidden"
            animate="show"
            className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700/50"
          >
            <img
              src={pizza.imageUrl}
              alt={pizza.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {pizza.isPopular && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Popular
                </div>
              )}
              {pizza.isVegetarian && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white text-sm font-medium shadow-lg">
                  <Leaf className="w-4 h-4" />
                  Vegetarian
                </div>
              )}
              {pizza.spicyLevel > 0 && <SpicyBadge level={pizza.spicyLevel} />}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            variants={fadeUpItem}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <CategoryBadge category={pizza.category} className="mb-4" />
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{pizza.name}</h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-6">{pizza.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                {formatCurrency(pizza.price)}
              </span>
              {cartQuantity > 0 && (
                <span className="text-lg text-slate-400">
                  Total: {formatCurrency(pizza.price * cartQuantity)}
                </span>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium capitalize',
                      'bg-slate-800/80 text-slate-300 border border-slate-700/50'
                    )}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="pt-6 border-t border-slate-800">
              {cartQuantity > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(decrement(pizza.id))}
                      className="w-10 h-10 rounded-lg bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    <span className="w-12 text-center font-bold text-white text-xl">
                      {cartQuantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(increment(pizza.id))}
                      className="w-10 h-10 rounded-lg bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => {
                      dispatch(openCart());
                    }}
                    fullWidth
                  >
                    View Cart
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    dispatch(addItem({ pizzaId: pizza.id, quantity: 1 }));
                    dispatch(
                      addToast({
                        type: 'success',
                        message: `Added ${pizza.name} to cart! 🍕`,
                        duration: 3000,
                      })
                    );
                  }}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Add to Cart
                </Button>
              )}
            </div>

            {/* Discount Info */}
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-sm text-slate-400">
                <span className="font-bold text-orange-400">🎉 Special Offer:</span> Order 3 or more
                of this pizza and get <span className="font-bold text-orange-400">10% off</span> on
                that item!
              </p>
            </div>
          </motion.div>
        </div>

        {/* You Might Also Like Section */}
        {relatedPizzas.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 pt-12 border-t border-slate-800"
          >
            <h2 className="text-3xl font-black text-white mb-8">You Might Also Like</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {relatedPizzas.map((relatedPizza, index) => (
                <motion.div
                  key={relatedPizza.id}
                  variants={fadeUpItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/pizza/${relatedPizza.id}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-linear-to-br from-slate-800/80 to-slate-900/80 hover:border-orange-500/50 transition-all">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={relatedPizza.imageUrl}
                          alt={relatedPizza.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                          {relatedPizza.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black bg-linear-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            {formatCurrency(relatedPizza.price)}
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(addItem({ pizzaId: relatedPizza.id, quantity: 1 }));
                              dispatch(
                                addToast({
                                  type: 'success',
                                  message: `Added ${relatedPizza.name} to cart! 🍕`,
                                  duration: 3000,
                                })
                              );
                            }}
                            leftIcon={<Plus className="w-4 h-4" />}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

