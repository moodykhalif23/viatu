import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Saira_Stencil_One } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { CartProvider } from '@/components/cart/cart-context';
import { DebugGrid } from '@/components/debug-grid';
import { isDevelopment } from '@/lib/constants';
import { getCollections } from '@/lib/shopify';
import { Header } from '../components/layout/header';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { V0Provider } from '../lib/context';
import { cn } from '../lib/utils';
import { ScrollToTopOnRouteChange } from '@/components/layout/scroll-to-top-on-route-change';

const V0Setup = dynamic(() => import('@/components/v0-setup'));

const isV0 = process.env['VERCEL_URL']?.includes('vusercontent.net') ?? false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const sairaStencil = Saira_Stencil_One({
  variable: '--font-saira-stencil',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#f5f5f4',
};

export const metadata: Metadata = {
  title: 'SoleVault',
  description: 'SoleVault — premium footwear for every stride.',
  generator: 'v0.app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = await getCollections();

  return (
    <html lang="en">
      <body
        className={cn(geistSans.variable, geistMono.variable, sairaStencil.variable, 'antialiased min-h-screen', { 'is-v0': isV0 })}
        suppressHydrationWarning
      >
        <V0Provider isV0={isV0}>
          <CartProvider>
            <NuqsAdapter>
              <main data-vaul-drawer-wrapper="true">
                <Suspense fallback={null}>
                  <ScrollToTopOnRouteChange />
                </Suspense>
                <Header collections={collections} />
                {children}
              </main>
              {isDevelopment && <DebugGrid />}
              <Toaster closeButton position="bottom-right" />
            </NuqsAdapter>
          </CartProvider>
          {isV0 && <V0Setup />}
        </V0Provider>
      </body>
    </html>
  );
}
