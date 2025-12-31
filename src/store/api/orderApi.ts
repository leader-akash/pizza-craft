import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ORDER_STORAGE_KEY = 'pizza-orders';

const loadOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Failed to save orders to localStorage:', error);
  }
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    fetchFn: (typeof window !== 'undefined' && window.fetch) 
      ? window.fetch 
      : (typeof global !== 'undefined' && global.fetch) 
        ? global.fetch 
        : fetch,
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      queryFn: async () => {
        await delay(100);
        const orders = loadOrdersFromStorage();
        return { data: orders };
      },
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<Order, string>({
      queryFn: async (id) => {
        await delay(50);
        const orders = loadOrdersFromStorage();
        const order = orders.find((o) => o.id === id);
        if (!order) {
          return { error: { status: 404, data: 'Order not found' } };
        }
        return { data: order };
      },
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    addOrder: builder.mutation<Order, Order>({
      queryFn: async (newOrder) => {
        await delay(200);
        const orders = loadOrdersFromStorage();
        const updatedOrders = [newOrder, ...orders];
        saveOrdersToStorage(updatedOrders);
        return { data: newOrder };
      },
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: Order['status'] }>({
      queryFn: async ({ orderId, status }) => {
        await delay(200);
        const orders = loadOrdersFromStorage();
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        saveOrdersToStorage(updatedOrders);
        const updatedOrder = updatedOrders.find((o) => o.id === orderId);
        if (!updatedOrder) {
          return { error: { status: 404, data: 'Order not found' } };
        }
        return { data: updatedOrder };
      },
      invalidatesTags: (result, error, { orderId }) => [{ type: 'Order', id: orderId }, 'Order'],
    }),
    removeOrder: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(200);
        const orders = loadOrdersFromStorage();
        const updatedOrders = orders.filter((order) => order.id !== id);
        saveOrdersToStorage(updatedOrders);
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }, 'Order'],
    }),
    clearAllOrders: builder.mutation<void, void>({
      queryFn: async () => {
        await delay(200);
        saveOrdersToStorage([]);
        return { data: undefined };
      },
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useAddOrderMutation,
  useUpdateOrderStatusMutation,
  useRemoveOrderMutation,
  useClearAllOrdersMutation,
} = orderApi;

