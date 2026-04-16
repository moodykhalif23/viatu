'use server';

import { requireAdmin } from '@/lib/admin-auth';
import { adminUpsertProduct, adminDeleteProduct, adminGetProduct } from '@/lib/shopify/shopify';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { revalidatePath } from 'next/cache';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeVariants(productId: string, sizes: string[], price: string) {
  return {
    edges: sizes.map((size, i) => ({
      node: {
        id: `${productId}-variant-${i}`,
        title: `Size ${size}`,
        price: { amount: price, currencyCode: 'KES' },
        availableForSale: true,
        selectedOptions: [{ name: 'Size', value: size }],
      },
    })),
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const title       = formData.get('title') as string;
  const description = formData.get('description') as string;
  const productType = formData.get('productType') as string;
  const price       = formData.get('price') as string;
  const compareAt   = formData.get('compareAtPrice') as string;
  const imageUrl    = formData.get('imageUrl') as string;
  const sizesRaw    = formData.get('sizes') as string;

  const id     = `prod-${Date.now()}`;
  const handle = slugify(title);
  const sizes  = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);

  const product: ShopifyProduct = {
    id, title, handle, productType,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `${id}-opt-size`, name: 'Size', values: sizes }],
    images: { edges: [{ node: { url: imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', altText: title } }] },
    priceRange: { minVariantPrice: { amount: price, currencyCode: 'KES' } },
    compareAtPriceRange: { minVariantPrice: { amount: compareAt || price, currencyCode: 'KES' } },
    variants: makeVariants(id, sizes, price),
  };

  adminUpsertProduct(product);
  revalidatePath('/admin/shoes');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();

  const id          = formData.get('id') as string;
  const title       = formData.get('title') as string;
  const description = formData.get('description') as string;
  const productType = formData.get('productType') as string;
  const price       = formData.get('price') as string;
  const compareAt   = formData.get('compareAtPrice') as string;
  const imageUrl    = formData.get('imageUrl') as string;
  const sizesRaw    = formData.get('sizes') as string;

  const existing = adminGetProduct(id);
  if (!existing) return { error: 'Product not found' };

  const sizes = sizesRaw.split(',').map(s => s.trim()).filter(Boolean);

  const updated: ShopifyProduct = {
    ...existing,
    title, description, productType,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `${id}-opt-size`, name: 'Size', values: sizes }],
    images: imageUrl
      ? { edges: [{ node: { url: imageUrl, altText: title } }] }
      : existing.images,
    priceRange: { minVariantPrice: { amount: price, currencyCode: 'KES' } },
    compareAtPriceRange: { minVariantPrice: { amount: compareAt || price, currencyCode: 'KES' } },
    variants: makeVariants(id, sizes, price),
  };

  adminUpsertProduct(updated);
  revalidatePath('/admin/shoes');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  adminDeleteProduct(id);
  revalidatePath('/admin/shoes');
  revalidatePath('/shop');
  return { success: true };
}
