# PizzaCraft - Next.js Pizza Ordering App

A modern, full-featured pizza ordering application built with Next.js, TypeScript, and Tailwind CSS. This application demonstrates state management, form validation, data visualization, and responsive design.

## Features

- 🍕 **Browse Pizza Menu**: View a curated selection of delicious pizzas with detailed information
- 🛒 **Shopping Cart**: Add pizzas to cart with quantity management
- 💰 **Discount System**: Automatic 10% discount when ordering 3+ of the same pizza
- 📊 **Data Visualization**: Interactive charts showing pizza prices and order breakdown
- 🔍 **Advanced Filtering**: Filter pizzas by category, price, dietary preferences, and spicy level
- 📝 **Add Custom Pizzas**: Create and add new pizzas to the menu
- 📋 **Order History**: View and manage past orders
- 📱 **Responsive Design**: Fully responsive, works on desktop and mobile devices
- ✨ **Modern UI**: Beautiful, animated UI with Framer Motion

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
pizza-craft/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx            # Dashboard/Menu page
│   │   ├── add-pizza/          # Add pizza page
│   │   ├── orders/             # Orders history page
│   │   ├── pizza/[id]/         # Pizza details page
│   │   └── layout.tsx           # Root layout
│   ├── components/             # React components
│   │   ├── cart/               # Cart components
│   │   ├── charts/             # Chart components
│   │   ├── common/              # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   └── pizza/               # Pizza-related components
│   ├── store/                  # Redux store configuration
│   │   ├── api/                # RTK Query API slices
│   │   │   ├── pizzaApi.ts     # Pizza API endpoints
│   │   │   └── orderApi.ts     # Order API endpoints
│   │   ├── slices/             # Redux slices for local state
│   │   │   ├── cartSlice.ts    # Cart state management
│   │   │   └── filterSlice.ts  # Filter state management
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   ├── index.ts            # Store configuration
│   │   └── ReduxProvider.tsx   # Redux Provider component
│   ├── data/                   # Static data
│   │   └── pizzas.json         # Initial pizza data
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   └── utils/                  # Utility functions
│       ├── animations.ts        # Animation variants
│       ├── cn.ts                # Class name utility
│       └── format.ts            # Formatting functions
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup file
└── package.json                # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pizza-craft
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Data Structure

### Pizzas (pizzas.json)

Pizzas are stored in `src/data/pizzas.json` with the following structure:

```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "description": "string",
  "ingredients": ["string"],
  "category": "classic" | "meat" | "vegetarian" | "specialty",
  "imageUrl": "string",
  "isVegetarian": "boolean",
  "isPopular": "boolean",
  "spicyLevel": 0 | 1 | 2 | 3
}
```

### Orders

Orders are stored in browser localStorage (simulated backend). Each order includes:

- Order ID (auto-generated)
- Items with quantities and discounts
- Subtotal, total discount, and final total
- Timestamp
- Status (pending, confirmed, preparing, ready, delivered)

## Discount Rules

- **Bulk Discount**: When a user orders 3 or more of the same pizza, that pizza line item receives a **10% discount**
- Discounts are automatically calculated and displayed in the cart
- The discount applies only to the specific pizza line item, not the entire order

## State Management

The application uses Redux Toolkit with RTK Query for state management:

- **RTK Query APIs**: 
  - **pizzaApi**: Manages pizza data (CRUD operations) with automatic caching and refetching
  - **orderApi**: Manages order history with localStorage persistence
- **Redux Slices**:
  - **cartSlice**: Manages shopping cart items and calculations (local state)
  - **filterSlice**: Manages filtering and sorting state (local state)

### Why RTK Query?

- **Automatic Caching**: RTK Query automatically caches API responses and manages cache invalidation
- **Optimistic Updates**: Built-in support for optimistic UI updates
- **Request Deduplication**: Automatically deduplicates identical requests
- **TypeScript Support**: Excellent TypeScript support with type inference
- **DevTools Integration**: Full Redux DevTools support for debugging
- **Code Splitting**: Better code organization with API slices

## Testing

Run tests with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Design Decisions

### Why RTK Query instead of Context API?

- **Better Performance**: Automatic caching and request deduplication reduce unnecessary re-renders
- **Scalability**: Better suited for applications that will grow and need more complex state management
- **Developer Experience**: Excellent TypeScript support and Redux DevTools integration
- **Data Fetching**: Built-in data fetching, caching, and synchronization capabilities
- **Code Organization**: Clear separation between server state (RTK Query) and client state (Redux slices)

### Why Next.js App Router?

- Modern React Server Components support
- Better performance with automatic code splitting
- Improved developer experience
- Built-in routing and layouts

### Why Tailwind CSS?

- Rapid UI development
- Consistent design system
- Responsive design utilities
- Small bundle size with purging

### Why Recharts?

- Simple and flexible charting library
- Good TypeScript support
- Responsive by default
- Active community

## Features Breakdown

### Dashboard/Menu Page
- Hero banner with call-to-action
- Statistics cards
- Pizza grid with filtering and sorting
- Data visualization charts
- Promotional banner

### Pizza Details Page
- Large pizza image
- Detailed information
- Ingredient list
- Add to cart functionality
- Quantity management

### Add Pizza Page
- Form validation with Zod
- Dynamic ingredient list
- Image URL input
- Category and spicy level selection

### Orders Page
- Order history list
- Order statistics
- Order details with items
- Delete orders functionality
