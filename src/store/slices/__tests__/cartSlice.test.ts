import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  increment,
  decrement,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectIsCartEmpty,
  selectCartItemQuantity,
  getOrderItems,
  getSubtotal,
  getTotalDiscount,
  getFinalTotal,
} from '../cartSlice';
import { CartItem, Pizza } from '@/types';

describe('cartSlice', () => {
  const initialState = { items: [] };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should add a new item to cart', () => {
      const action = addItem({ pizzaId: '1', quantity: 2 });
      const state = cartReducer(initialState, action);
      expect(state.items).toEqual([{ pizzaId: '1', quantity: 2 }]);
    });

    it('should increment quantity when adding existing item', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, addItem({ pizzaId: '1', quantity: 3 }));
      expect(state2.items).toEqual([{ pizzaId: '1', quantity: 5 }]);
    });

    it('should remove an item from cart', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, removeItem('1'));
      expect(state2.items).toEqual([]);
    });

    it('should update item quantity', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, updateQuantity({ pizzaId: '1', quantity: 5 }));
      expect(state2.items).toEqual([{ pizzaId: '1', quantity: 5 }]);
    });

    it('should remove item when quantity is set to 0', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, updateQuantity({ pizzaId: '1', quantity: 0 }));
      expect(state2.items).toEqual([]);
    });

    it('should increment item quantity', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, increment('1'));
      expect(state2.items).toEqual([{ pizzaId: '1', quantity: 3 }]);
    });

    it('should decrement item quantity', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 3 }));
      const state2 = cartReducer(state1, decrement('1'));
      expect(state2.items).toEqual([{ pizzaId: '1', quantity: 2 }]);
    });

    it('should remove item when decrementing quantity to 1', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 1 }));
      const state2 = cartReducer(state1, decrement('1'));
      expect(state2.items).toEqual([]);
    });

    it('should clear all items from cart', () => {
      const state1 = cartReducer(initialState, addItem({ pizzaId: '1', quantity: 2 }));
      const state2 = cartReducer(state1, addItem({ pizzaId: '2', quantity: 1 }));
      const state3 = cartReducer(state2, clearCart());
      expect(state3.items).toEqual([]);
    });
  });

  describe('selectors', () => {
    const state = {
      cart: {
        items: [
          { pizzaId: '1', quantity: 2 },
          { pizzaId: '2', quantity: 3 },
        ],
      },
    };

    it('should select cart items', () => {
      expect(selectCartItems(state)).toEqual(state.cart.items);
    });

    it('should select cart item count', () => {
      expect(selectCartItemCount(state)).toBe(5);
    });

    it('should select if cart is empty', () => {
      expect(selectIsCartEmpty(state)).toBe(false);
      expect(selectIsCartEmpty({ cart: { items: [] } })).toBe(true);
    });

    it('should select cart item quantity by pizzaId', () => {
      expect(selectCartItemQuantity('1')(state)).toBe(2);
      expect(selectCartItemQuantity('2')(state)).toBe(3);
      expect(selectCartItemQuantity('3')(state)).toBe(0);
    });
  });

  describe('helper functions', () => {
    const mockPizzas: Pizza[] = [
      {
        id: '1',
        name: 'Margherita',
        price: 10,
        description: 'Classic pizza',
        ingredients: ['tomato', 'mozzarella'],
        category: 'classic',
        imageUrl: '',
        isVegetarian: true,
        isPopular: false,
        spicyLevel: 0,
      },
      {
        id: '2',
        name: 'Pepperoni',
        price: 12,
        description: 'Spicy pizza',
        ingredients: ['pepperoni', 'cheese'],
        category: 'meat',
        imageUrl: '',
        isVegetarian: false,
        isPopular: true,
        spicyLevel: 1,
      },
    ];

    const cartItems: CartItem[] = [
      { pizzaId: '1', quantity: 2 }, // 2 items, no discount
      { pizzaId: '2', quantity: 3 }, // 3 items, qualifies for discount
    ];

    it('should get order items correctly', () => {
      const orderItems = getOrderItems(cartItems, mockPizzas);
      expect(orderItems).toHaveLength(2);
      expect(orderItems[0].pizza.id).toBe('1');
      expect(orderItems[0].quantity).toBe(2);
      expect(orderItems[0].originalPrice).toBe(20);
      expect(orderItems[0].discountAmount).toBe(0);
      expect(orderItems[0].finalPrice).toBe(20);
    });

    it('should apply discount for quantities >= 3', () => {
      const orderItems = getOrderItems(cartItems, mockPizzas);
      const itemWithDiscount = orderItems.find((item) => item.pizza.id === '2');
      expect(itemWithDiscount?.originalPrice).toBe(36); // 12 * 3
      expect(itemWithDiscount?.discountAmount).toBe(3.6); // 10% of 36
      expect(itemWithDiscount?.finalPrice).toBe(32.4); // 36 - 3.6
    });

    it('should throw error when pizza not found', () => {
      const invalidCartItems: CartItem[] = [{ pizzaId: '999', quantity: 1 }];
      expect(() => getOrderItems(invalidCartItems, mockPizzas)).toThrow('Pizza not found: 999');
    });

    it('should calculate subtotal correctly', () => {
      const subtotal = getSubtotal(cartItems, mockPizzas);
      expect(subtotal).toBe(56); // (10 * 2) + (12 * 3)
    });

    it('should calculate total discount correctly', () => {
      const totalDiscount = getTotalDiscount(cartItems, mockPizzas);
      expect(totalDiscount).toBe(3.6); // Only item 2 qualifies
    });

    it('should calculate final total correctly', () => {
      const finalTotal = getFinalTotal(cartItems, mockPizzas);
      expect(finalTotal).toBe(52.4); // 56 - 3.6
    });
  });
});

