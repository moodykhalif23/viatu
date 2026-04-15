import { Metadata } from 'next';
import { ShoesTable } from '../components/shoes-table';

export const metadata: Metadata = {
  title: 'SoleVault Admin — Shoes',
  description: 'Manage your shoe inventory.',
};

export default function AdminShoesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shoes</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your full shoe catalog.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
          + Add Shoe
        </button>
      </div>

      <ShoesTable />
    </div>
  );
}
