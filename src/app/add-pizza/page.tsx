'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, ArrowLeft, ChefHat, Zap, Settings, Image as ImageIcon, Sparkles, Leaf } from 'lucide-react';
import { Button, Input, TextArea, Select } from '@/components/common';
import { useAddPizzaMutation } from '@/store/api/pizzaApi';
import { PizzaCategory } from '@/types';
import { cn } from '@/utils/cn';
import { fadeUpItem } from '@/utils/animations';
import { formatCurrency } from '@/utils/format';
import { addToast } from '@/store/slices/toastSlice';
import { useAppDispatch } from '@/store/hooks';

const pizzaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  price: z.number({ message: 'Price must be a number' }).min(1, 'Price must be at least $1').max(100, 'Price must be less than $100'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(200, 'Description must be less than 200 characters'),
  ingredients: z.array(z.object({ value: z.string().min(1, 'Ingredient cannot be empty') })).min(1, 'Add at least one ingredient'),
  category: z.enum(['classic', 'meat', 'vegetarian', 'specialty']),
  imageUrl: z.string().url('Please enter a valid URL'),
  isVegetarian: z.boolean(),
  spicyLevel: z.number().min(0).max(3),
});

type PizzaFormData = z.infer<typeof pizzaSchema>;

const categories = [
  { value: 'classic', label: 'Classic' },
  { value: 'meat', label: 'Non veg' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'specialty', label: 'Specialty' },
];

const spicyLevels = [
  { value: 0, label: 'Not Spicy', icon: '😊', peppers: '' },
  { value: 1, label: 'Mild', icon: '🌶️', peppers: '🌶️' },
  { value: 2, label: 'Medium', icon: '🌶️🌶️', peppers: '🌶️🌶️' },
  { value: 3, label: 'Hot', icon: '🌶️🌶️🌶️', peppers: '🌶️🌶️🌶️' },
];

const defaultImages = [
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
];

export default function AddPizzaPage() {
  const router = useRouter();
  const [addPizza, { isLoading: isSubmitting }] = useAddPizzaMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PizzaFormData>({
    resolver: zodResolver(pizzaSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      ingredients: [{ value: '' }],
      category: 'classic',
      imageUrl: defaultImages[0],
      isVegetarian: false,
      spicyLevel: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const category = watch('category');
  const isVegetarian = watch('isVegetarian');
  const imageUrl = watch('imageUrl');
  const name = watch('name');
  const price = watch('price');
  const description = watch('description');
  const ingredients = watch('ingredients');
  const spicyLevel = watch('spicyLevel');
  const dispatch = useAppDispatch();

  const onSubmit = async (data: PizzaFormData) => {
    try {
      const newPizza = {
        id: uuidv4(),
        name: data.name,
        price: data.price,
        description: data.description,
        ingredients: data.ingredients.map((ing) => ing.value),
        category: data.category as PizzaCategory,
        imageUrl: data.imageUrl,
        isVegetarian: data.isVegetarian || data.category === 'vegetarian',
        isPopular: false,
        spicyLevel: data.spicyLevel as 0 | 1 | 2 | 3,
      };

      await addPizza(newPizza).unwrap();
      dispatch(addToast({
        type: 'success',
        message: 'Pizza created successfully',
        duration: 2000,
      }));
      // router.push('/');
    } catch (error) {
      console.error('Error adding pizza:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl sm:text-4xl font-black text-white">Create New Pizza</h1>
          </div>
          <p className="text-slate-400">Add your custom pizza to the menu</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column - Form */}
          <motion.div
            variants={fadeUpItem}
            initial="hidden"
            animate="show"
            className="space-y-6 h-full flex flex-col"
          >
            <div className="space-y-6">
              {/* Basic Information Card */}
              <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Pizza Name"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="e.g., Margherita Supreme"
                  />
                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    error={errors.price?.message}
                    placeholder="0"
                  />
                  <Select
                    label="Category"
                    options={categories}
                    {...register('category')}
                    error={errors.category?.message}
                  />
                  <TextArea
                    label="Description"
                    rows={3}
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Describe your delicious pizza..."
                  />
                </div>
              </div>

              {/* Ingredients Card */}
              <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🧀</span>
                  <h2 className="text-xl font-bold text-white">Ingredients</h2>
                </div>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...register(`ingredients.${index}.value`)}
                        error={errors.ingredients?.[index]?.value?.message}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.ingredients?.root && (
                    <p className="text-sm text-red-400">{errors.ingredients.root.message}</p>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => append({ value: '' })}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Ingredient
                  </Button>
                </div>
              </div>

              {/* Options Card */}
              <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-bold text-white">Options</h2>
                </div>
                <div className="space-y-6">
                  {/* Spicy Level - Radio Buttons */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Spicy Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {spicyLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setValue('spicyLevel', level.value)}
                          className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                            spicyLevel === level.value
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          )}
                        >
                          <span className="text-2xl">{level.icon}</span>
                          <span className="text-xs font-semibold">{level.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Vegetarian Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Leaf className="w-5 h-5 text-emerald-400" />
                      <div>
                        <label className="block text-sm font-semibold text-white">Vegetarian Pizza</label>
                        <p className="text-xs text-slate-400">Mark this pizza as vegetarian</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValue('isVegetarian', !isVegetarian)}
                      className={cn(
                        'relative w-14 h-7 rounded-full transition-colors',
                        isVegetarian ? 'bg-emerald-500' : 'bg-slate-600'
                      )}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: isVegetarian ? 28 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image & Preview */}
          <motion.div
            variants={fadeUpItem}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="space-y-6 h-full flex flex-col"
          >
            {/* Image URL Card */}
            <div className="rounded-2xl bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Pizza Image</h2>
              </div>
              <Input
                label="Image URL"
                {...register('imageUrl')}
                error={errors.imageUrl?.message}
                placeholder="https://..."
              />
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Quick Select:</p>
                <div className="grid grid-cols-4 gap-2">
                  {defaultImages.map((img, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setValue('imageUrl', img)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                        imageUrl === img
                          ? 'border-orange-500 ring-2 ring-orange-500/50'
                          : 'border-slate-700 hover:border-slate-600'
                      )}
                    >
                      <img src={img} alt={`Pizza ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="rounded-2xl h-full bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-bold text-white">Live Preview</h2>
              </div>
              <div className="relative lg:h-[70%] rounded-xl overflow-hidden border border-slate-700 bg-slate-900/50">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name || 'Pizza Preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
                {price > 0 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-slate-950/90 backdrop-blur-sm border border-slate-700/50">
                    <p className="text-orange-400 font-bold text-lg">{formatCurrency(price)}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-xl font-bold text-white">{name || 'Pizza Name'}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">
                  {description || 'Description will appear here...'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-medium capitalize">
                    {category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {ingredients.filter((ing) => ing.value).length} ingredients
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Buttons */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex gap-4 max-w-3xl mx-auto"
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<Sparkles className="w-5 h-5" />}
            >
              Create Pizza
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
