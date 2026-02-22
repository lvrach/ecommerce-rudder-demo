import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import { CartProvider } from '@/lib/cart';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Serene Leaf — Premium Tea Collection',
  description:
    'Discover handcrafted artisan teas from around the world. From delicate white teas to bold pu-erh, find your perfect cup.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
