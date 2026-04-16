'use client';

import { useState, useTransition } from 'react';
import { Search, ArrowUpDown, Pencil, Trash2, Plus, Loader2, X } from 'lucide-react';
import { createProductAction, updateProductAction, deleteProductAction } from './actions';
import type { ShopifyProduct } from '@/lib/shopify/types';

const CATEGORIES = ['Sneakers', 'Running', 'Boots', 'Sandals', 'Loafers', 'Hiking', 'Casual'];

function formatKES(amount: string) {
  return `KSh ${Number(amount).toLocaleString('en-KE')}`;
}

// ---- Product Form Modal ----
function ProductForm({ product, onClose }: { product?: ShopifyProduct; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const defaultSizes = product?.options?.[0]?.values?.join(', ') ?? '7, 8, 9, 10, 11, 12';
  const defaultPrice = product?.priceRange?.minVariantPrice?.amount ?? '';
  const defaultCompare = product?.compareAtPriceRange?.minVariantPrice?.amount ?? '';
  const defaultImage = product?.images?.edges?.[0]?.node?.url ?? '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = product ? await updateProductAction(fd) : await createProductAction(fd);
      if (result && 'error' in result) setError(result.error as string);
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 overflow-y-auto">
      <div className="bg-background rounded-xl border shadow-lg w-full max-w-lg my-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{product ? 'Edit Shoe' : 'Add New Shoe'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {product && <input type="hidden" name="id" value={product.id} />}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Name *</label>
              <input name="title" required defaultValue={product?.title}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="Air Stride Pro" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category *</label>
              <select name="productType" required defaultValue={product?.productType ?? ''}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20">
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Price (KES) *</label>
              <input name="price" required type="number" min="0" step="1" defaultValue={defaultPrice}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="12999" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Compare-at Price (KES)</label>
              <input name="compareAtPrice" type="number" min="0" step="1" defaultValue={defaultCompare}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="15999" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sizes (comma-separated) *</label>
              <input name="sizes" required defaultValue={defaultSizes}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="7, 8, 9, 10, 11, 12" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Image URL</label>
              <input name="imageUrl" type="url" defaultValue={defaultImage}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="https://images.unsplash.com/..." />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm font-medium">Description *</label>
              <textarea name="description" required rows={3} defaultValue={product?.description ?? ''}
                className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                placeholder="Describe this shoe…" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {product ? 'Save Changes' : 'Add Shoe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Main Manager ----
export function ShoesManager({ products: initialProducts }: { products: ShopifyProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editing, setEditing] = useState<ShopifyProduct | null | 'new'>(null);
  const [isPending, startTransition] = useTransition();

  function handleSort(field: string) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  function handleDelete(product: ShopifyProduct) {
    if (!confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    const fd = new FormData();
    fd.set('id', product.id);
    startTransition(async () => {
      await deleteProductAction(fd);
      setProducts(p => p.filter(x => x.id !== product.id));
    });
  }

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q);
      const matchCat = categoryFilter === 'All' || p.productType === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === 'price') {
        const diff = parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
        return sortDir === 'asc' ? diff : -diff;
      }
      if (sortField === 'title') {
        return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <>
      {editing && (
        <ProductForm
          product={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="bg-background rounded-xl border">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center px-5 py-4 border-b">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input type="text" placeholder="Search shoes…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${categoryFilter === cat ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {cat}
              </button>
            ))}
          </div>

          <button onClick={() => setEditing('new')}
            className="ml-auto shrink-0 inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90">
            <Plus className="size-4" /> Add Shoe
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                  <button onClick={() => handleSort('title')} className="flex items-center gap-1 hover:text-foreground">
                    Name <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Sizes</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                  <button onClick={() => handleSort('price')} className="flex items-center gap-1 hover:text-foreground">
                    Price <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No shoes found.</td></tr>
              ) : filtered.map(product => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{product.productType}</td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {product.options?.[0]?.values?.join(', ') ?? '—'}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    {formatKES(product.priceRange.minVariantPrice.amount)}
                    {product.compareAtPriceRange?.minVariantPrice?.amount &&
                      product.compareAtPriceRange.minVariantPrice.amount !== product.priceRange.minVariantPrice.amount && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {formatKES(product.compareAtPriceRange.minVariantPrice.amount)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(product)}
                        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="size-4" />
                      </button>
                      <button onClick={() => handleDelete(product)} disabled={isPending}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {products.length} shoes</span>
        </div>
      </div>
    </>
  );
}
