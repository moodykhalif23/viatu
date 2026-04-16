'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import type { Collection } from '@/lib/shopify/types';

export function ConditionalHeader({ collections }: { collections: Collection[] }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Header collections={collections} />;
}
