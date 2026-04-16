import { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin-auth';
import { adminGetAllProducts } from '@/lib/shopify/shopify';
import { ShoesManager } from './shoes-manager';

export const metadata: Metadata = {
  title: 'SoleVault Admin — Shoes',
};

export default async function AdminShoesPage() {
  await requireAdmin();
  const products = adminGetAllProducts();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shoes</h1>
        <p className="text-muted-foreground text-sm mt-1">Add, edit, and remove shoes from your catalog.</p>
      </div>
      <ShoesManager products={products} />
    </div>
  );
}
