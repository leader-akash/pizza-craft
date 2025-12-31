import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/ReduxProvider';
import { Header, Footer } from '@/components/layout';
import { ToastProvider } from '@/components/common/ToastProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PizzaCraft - Artisan Pizzeria | Order Delicious Pizzas Online',
  description: 'PizzaCraft is your go-to destination for artisan pizzas crafted with premium ingredients. Browse our curated menu, customize your order, add pizzas to your cart, and enjoy automatic discounts. Track your orders, explore data visualizations, and create custom pizzas. Experience the perfect blend of taste and convenience.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'PizzaCraft - Artisan Pizzeria',
    description: 'Craft your perfect pizza with premium ingredients. Browse our menu, customize your order, and enjoy delicious pizzas with automatic discounts. Order online and track your orders with our modern pizza ordering platform.',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PizzaCraft - Artisan Pizzeria - Order Delicious Pizzas Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PizzaCraft - Artisan Pizzeria',
    description: 'Craft your perfect pizza with premium ingredients. Browse our menu, customize your order, and enjoy delicious pizzas with automatic discounts.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-white dark:bg-slate-950 dark:text-white light:bg-white light:text-slate-950" suppressHydrationWarning>
        <ReduxProvider>
          <ThemeProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
