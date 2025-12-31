import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/ReduxProvider';
import { Header, Footer } from '@/components/layout';
import { ToastProvider } from '@/components/common/ToastProvider';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'PizzaCraft - Artisan Pizzeria',
  description: 'Order delicious pizzas online',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'PizzaCraft - Artisan Pizzeria',
    description: 'Order delicious pizzas online. Craft your perfect pizza with premium ingredients.',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PizzaCraft - Artisan Pizzeria',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PizzaCraft - Artisan Pizzeria',
    description: 'Order delicious pizzas online. Craft your perfect pizza with premium ingredients.',
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
