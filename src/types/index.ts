// Pizza Types
export interface Pizza {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  category: PizzaCategory;
  imageUrl: string;
  isVegetarian: boolean;
  isPopular: boolean;
  spicyLevel: 0 | 1 | 2 | 3;
}

export type PizzaCategory = 'classic' | 'meat' | 'vegetarian' | 'specialty';

// Order Types
export interface OrderItem {
  pizza: Pizza;
  quantity: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  timestamp: string;
  status: OrderStatus;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

// Cart Types (current order being built)
export interface CartItem {
  pizzaId: string;
  quantity: number;
}

// Filter Types
export interface FilterState {
  searchQuery: string;
  category: PizzaCategory | 'all';
  isVegetarian: boolean | null;
  maxPrice: number | null;
  minPrice: number | null;
  spicyLevel: number | null;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 'name' | 'price' | 'popularity' | 'spicyLevel';

// Form Types
export interface AddPizzaFormData {
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  category: PizzaCategory;
  imageUrl: string;
  isVegetarian: boolean;
  spicyLevel: 0 | 1 | 2 | 3;
}

// Chart Data Types
export interface PriceChartData {
  name: string;
  price: number;
  category: string;
}

export interface OrderPieData {
  name: string;
  value: number;
  color: string;
}

// Animation Types
export interface AnimationConfig {
  initial: object;
  animate: object;
  exit?: object;
  transition?: object;
}

// Toast/Notification Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

