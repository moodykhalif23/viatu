'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, MoreHorizontal, ArrowUpDown } from 'lucide-react';

type ShoeStatus = 'Active' | 'Draft' | 'Out of Stock';

interface Shoe {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  sizes: string;
  status: ShoeStatus;
  sku: string;
}

const mockShoes: Shoe[] = [
  { id: '1', name: 'Air Stride Pro', brand: 'SoleVault', category: 'Sneakers', price: 129.99, stock: 84, sizes: '6–13', status: 'Active', sku: 'SV-SNK-001' },
  { id: '2', name: 'Urban Runner X', brand: 'SoleVault', category: 'Running', price: 89.99, stock: 52, sizes: '7–12', status: 'Active', sku: 'SV-RUN-002' },
  { id: '3', name: 'Classic Leather Boot', brand: 'SoleVault', category: 'Boots', price: 199.99, stock: 30, sizes: '8–13', status: 'Active', sku: 'SV-BOT-003' },
  { id: '4', name: 'Trail Blazer GTX', brand: 'SoleVault', category: 'Hiking', price: 149.99, stock: 0, sizes: '7–12', status: 'Out of Stock', sku: 'SV-HIK-004' },
  { id: '5', name: 'Slip-On Canvas', brand: 'SoleVault', category: 'Casual', price: 59.99, stock: 120, sizes: '5–12', status: 'Active', sku: 'SV-CAS-005' },
  { id: '6', name: 'Velvet Mule', brand: 'SoleVault', category: 'Sandals', price: 74.99, stock: 18, sizes: '5–11', status: 'Active', sku: 'SV-SAN-006' },
  { id: '7', name: 'High-Top Retro', brand: 'SoleVault', category: 'Sneakers', price: 109.99, stock: 45, sizes: '6–13', status: 'Active', sku: 'SV-SNK-007' },
  { id: '8', name: 'Minimalist Loafer', brand: 'SoleVault', category: 'Loafers', price: 119.99, stock: 0, sizes: '7–12', status: 'Draft', sku: 'SV-LOA-008' },
  { id: '9', name: 'Knit Sock Sneaker', brand: 'SoleVault', category: 'Running', price: 99.99, stock: 67, sizes: '6–12', status: 'Active', sku: 'SV-RUN-009' },
  { id: '10', name: 'Chelsea Boot', brand: 'SoleVault', category: 'Boots', price: 179.99, stock: 22, sizes: '8–13', status: 'Active', sku: 'SV-BOT-010' },
  { id: '11', name: 'Platform Sandal', brand: 'SoleVault', category: 'Sandals', price: 84.99, stock: 38, sizes: '5–11', status: 'Active', sku: 'SV-SAN-011' },
  { id: '12', name: 'Waterproof Hiker', brand: 'SoleVault', category: 'Hiking', price: 169.99, stock: 14, sizes: '7–13', status: 'Draft', sku: 'SV-HIK-012' },
];

const statusColors: Record<ShoeStatus, string> = {
  Active: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

const categories = ['All', 'Sneakers', 'Running', 'Boots', 'Hiking', 'Casual', 'Sandals', 'Loafers'];

export function ShoesTable() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<keyof Shoe | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Shoe) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = mockShoes
    .filter(shoe => {
      const matchesSearch =
        shoe.name.toLowerCase().includes(search.toLowerCase()) ||
        shoe.sku.toLowerCase().includes(search.toLowerCase()) ||
        shoe.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || shoe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  return (
    <div className="bg-background rounded-xl border">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center px-5 py-4 border-b">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shoes, SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-muted-foreground shrink-0">{filtered.length} shoes</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Name <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">SKU</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Sizes</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Price <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Stock <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                  No shoes found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map(shoe => (
                <tr key={shoe.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium">{shoe.name}</div>
                    <div className="text-xs text-muted-foreground">{shoe.brand}</div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{shoe.sku}</td>
                  <td className="px-5 py-4 text-muted-foreground">{shoe.category}</td>
                  <td className="px-5 py-4 text-muted-foreground">{shoe.sizes}</td>
                  <td className="px-5 py-4 font-medium">${shoe.price.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={shoe.stock === 0 ? 'text-red-500 font-medium' : ''}>{shoe.stock}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[shoe.status]}`}
                    >
                      {shoe.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      aria-label={`More options for ${shoe.name}`}
                      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between px-5 py-3 border-t text-sm text-muted-foreground">
        <span>Showing {filtered.length} of {mockShoes.length} shoes</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded border hover:bg-muted transition-colors disabled:opacity-40" disabled>
            Previous
          </button>
          <span className="px-3 py-1 rounded bg-foreground text-background text-xs font-medium">1</span>
          <button className="px-3 py-1 rounded border hover:bg-muted transition-colors disabled:opacity-40" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
