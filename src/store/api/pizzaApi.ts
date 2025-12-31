import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pizza } from '@/types';
import pizzasData from '@/data/pizzas.json';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for pizzas (simulating a backend)
let pizzas: Pizza[] = [...(pizzasData as Pizza[])];

export const pizzaApi = createApi({
  reducerPath: 'pizzaApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Pizza'],
  endpoints: (builder) => ({
    getPizzas: builder.query<Pizza[], void>({
      queryFn: async () => {
        await delay(100);
        return { data: pizzas };
      },
      providesTags: ['Pizza'],
    }),
    getPizzaById: builder.query<Pizza, string>({
      queryFn: async (id) => {
        await delay(50);
        const pizza = pizzas.find((p) => p.id === id);
        if (!pizza) {
          return { error: { status: 404, data: 'Pizza not found' } };
        }
        return { data: pizza };
      },
      providesTags: (result, error, id) => [{ type: 'Pizza', id }],
    }),
    addPizza: builder.mutation<Pizza, Pizza>({
      queryFn: async (newPizza) => {
        await delay(200);
        pizzas = [...pizzas, newPizza];
        return { data: newPizza };
      },
      invalidatesTags: ['Pizza'],
    }),
    updatePizza: builder.mutation<Pizza, Pizza>({
      queryFn: async (updatedPizza) => {
        await delay(200);
        pizzas = pizzas.map((p) => (p.id === updatedPizza.id ? updatedPizza : p));
        return { data: updatedPizza };
      },
      invalidatesTags: (result, error, pizza) => [{ type: 'Pizza', id: pizza.id }, 'Pizza'],
    }),
    removePizza: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(200);
        pizzas = pizzas.filter((p) => p.id !== id);
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Pizza', id }, 'Pizza'],
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useGetPizzaByIdQuery,
  useAddPizzaMutation,
  useUpdatePizzaMutation,
  useRemovePizzaMutation,
} = pizzaApi;

