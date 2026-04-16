/**
 * Mock data layer — replaces Shopify Storefront API.
 * Products are stored in a mutable in-memory store so the admin can
 * add / edit / delete them at runtime without a database round-trip.
 */

import type { ShopifyProduct, ShopifyCollection, ShopifyCart, ShopifyCartLine } from './types';

// ---------------------------------------------------------------------------
// Mock collections
// ---------------------------------------------------------------------------

export const MOCK_COLLECTIONS: ShopifyCollection[] = [
  { id: 'col-1', title: 'Sneakers',     handle: 'sneakers',    description: 'Everyday sneakers for every style.' },
  { id: 'col-2', title: 'Running',      handle: 'running',     description: 'Performance shoes built for speed.' },
  { id: 'col-3', title: 'Boots',        handle: 'boots',       description: 'Durable boots for any terrain.' },
  { id: 'col-4', title: 'Sandals',      handle: 'sandals',     description: 'Light and breezy warm-weather footwear.' },
  { id: 'col-5', title: 'Loafers',      handle: 'loafers',     description: 'Slip-on comfort with a polished look.' },
  { id: 'col-6', title: 'Hiking',       handle: 'hiking',      description: 'Trail-ready shoes for the outdoors.' },
  { id: 'col-7', title: 'New Arrivals', handle: 'frontpage',   description: 'The latest drops from SoleVault.' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeVariants(productId: string, sizes: string[], price: string, currencyCode = 'KES') {
  return {
    edges: sizes.map((size, i) => ({
      node: {
        id: `${productId}-variant-${i}`,
        title: `Size ${size}`,
        price: { amount: price, currencyCode },
        availableForSale: i < sizes.length - 1,
        selectedOptions: [{ name: 'Size', value: size }],
      },
    })),
  };
}

function makeOptions(productId: string, sizes: string[]) {
  return [{ id: `${productId}-opt-size`, name: 'Size', values: sizes }];
}

const SIZES_STANDARD = ['7', '8', '9', '10', '11', '12'];
const SIZES_WIDE     = ['8', '9', '10', '11', '12', '13'];

// ---------------------------------------------------------------------------
// Mutable product store (admin can add/edit/delete)
// ---------------------------------------------------------------------------

const productStore: Map<string, ShopifyProduct> = new Map(
  [
    {
      id: 'prod-1', title: 'Air Stride Pro',
      description: 'Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.',
      descriptionHtml: '<p>Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.</p>',
      handle: 'air-stride-pro', productType: 'Sneakers',
      options: makeOptions('prod-1', SIZES_STANDARD),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', altText: 'Air Stride Pro' } },
        { node: { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', altText: 'Air Stride Pro side' } },
      ]},
      priceRange: { minVariantPrice: { amount: '12999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '15999', currencyCode: 'KES' } },
      variants: makeVariants('prod-1', SIZES_STANDARD, '12999'),
    },
    {
      id: 'prod-2', title: 'Urban Runner X',
      description: 'A versatile running shoe designed for city streets and light trails.',
      descriptionHtml: '<p>A versatile running shoe designed for city streets and light trails.</p>',
      handle: 'urban-runner-x', productType: 'Running',
      options: makeOptions('prod-2', SIZES_STANDARD),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', altText: 'Urban Runner X' } },
      ]},
      priceRange: { minVariantPrice: { amount: '8999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '8999', currencyCode: 'KES' } },
      variants: makeVariants('prod-2', SIZES_STANDARD, '8999'),
    },
    {
      id: 'prod-3', title: 'Classic Leather Boot',
      description: 'Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.',
      descriptionHtml: '<p>Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.</p>',
      handle: 'classic-leather-boot', productType: 'Boots',
      options: makeOptions('prod-3', SIZES_WIDE),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80', altText: 'Classic Leather Boot' } },
      ]},
      priceRange: { minVariantPrice: { amount: '19999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '24999', currencyCode: 'KES' } },
      variants: makeVariants('prod-3', SIZES_WIDE, '19999'),
    },
    {
      id: 'prod-4', title: 'Trail Blazer GTX',
      description: 'Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.',
      descriptionHtml: '<p>Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.</p>',
      handle: 'trail-blazer-gtx', productType: 'Hiking',
      options: makeOptions('prod-4', SIZES_STANDARD),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800&q=80', altText: 'Trail Blazer GTX' } },
      ]},
      priceRange: { minVariantPrice: { amount: '14999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '14999', currencyCode: 'KES' } },
      variants: makeVariants('prod-4', SIZES_STANDARD, '14999'),
    },
    {
      id: 'prod-5', title: 'Slip-On Canvas',
      description: 'Effortless canvas slip-on with a flexible sole — perfect for casual days.',
      descriptionHtml: '<p>Effortless canvas slip-on with a flexible sole — perfect for casual days.</p>',
      handle: 'slip-on-canvas', productType: 'Sneakers',
      options: makeOptions('prod-5', SIZES_STANDARD),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', altText: 'Slip-On Canvas' } },
      ]},
      priceRange: { minVariantPrice: { amount: '5999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '5999', currencyCode: 'KES' } },
      variants: makeVariants('prod-5', SIZES_STANDARD, '5999'),
    },
    {
      id: 'prod-6', title: 'Velvet Mule',
      description: 'Luxurious velvet mule with a block heel — from desk to dinner.',
      descriptionHtml: '<p>Luxurious velvet mule with a block heel — from desk to dinner.</p>',
      handle: 'velvet-mule', productType: 'Sandals',
      options: makeOptions('prod-6', ['5','6','7','8','9','10']),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', altText: 'Velvet Mule' } },
      ]},
      priceRange: { minVariantPrice: { amount: '7499', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '7499', currencyCode: 'KES' } },
      variants: makeVariants('prod-6', ['5','6','7','8','9','10'], '7499'),
    },
    {
      id: 'prod-7', title: 'High-Top Retro',
      description: 'Retro-inspired high-top with premium suede panels and a vulcanised sole.',
      descriptionHtml: '<p>Retro-inspired high-top with premium suede panels and a vulcanised sole.</p>',
      handle: 'high-top-retro', productType: 'Sneakers',
      options: makeOptions('prod-7', SIZES_STANDARD),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', altText: 'High-Top Retro' } },
      ]},
      priceRange: { minVariantPrice: { amount: '10999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '12999', currencyCode: 'KES' } },
      variants: makeVariants('prod-7', SIZES_STANDARD, '10999'),
    },
    {
      id: 'prod-8', title: 'Minimalist Loafer',
      description: 'Clean-lined leather loafer with a memory foam footbed for all-day comfort.',
      descriptionHtml: '<p>Clean-lined leather loafer with a memory foam footbed for all-day comfort.</p>',
      handle: 'minimalist-loafer', productType: 'Loafers',
      options: makeOptions('prod-8', SIZES_WIDE),
      images: { edges: [
        { node: { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80', altText: 'Minimalist Loafer' } },
      ]},
      priceRange: { minVariantPrice: { amount: '11999', currencyCode: 'KES' } },
      compareAtPriceRange: { minVariantPrice: { amount: '11999', currencyCode: 'KES' } },
      variants: makeVariants('prod-8', SIZES_WIDE, '11999'),
    },
  ].map(p => [p.id, p as ShopifyProduct])
);

// ---------------------------------------------------------------------------
// Hero image store (admin-editable)
// ---------------------------------------------------------------------------

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
  label: string;
  active: boolean;
}

export const heroStore: Map<string, HeroImage> = new Map([
  ['hero-1', { id: 'hero-1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80', alt: 'Air Stride Pro', label: 'New Season', active: true }],
  ['hero-2', { id: 'hero-2', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&q=80', alt: 'Urban Runner X', label: 'Run Faster', active: true }],
  ['hero-3', { id: 'hero-3', url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80', alt: 'High-Top Retro', label: 'Classic Style', active: false }],
]);

// ---------------------------------------------------------------------------
// Admin CRUD helpers (called from server actions)
// ---------------------------------------------------------------------------

export function adminGetAllProducts(): ShopifyProduct[] {
  return Array.from(productStore.values());
}

export function adminGetProduct(id: string): ShopifyProduct | undefined {
  return productStore.get(id);
}

export function adminUpsertProduct(product: ShopifyProduct): void {
  productStore.set(product.id, product);
}

export function adminDeleteProduct(id: string): void {
  productStore.delete(id);
}

export function adminGetHeroes(): HeroImage[] {
  return Array.from(heroStore.values());
}

export function adminUpsertHero(hero: HeroImage): void {
  heroStore.set(hero.id, hero);
}

export function adminDeleteHero(id: string): void {
  heroStore.delete(id);
}

// ---------------------------------------------------------------------------
// Collection product map
// ---------------------------------------------------------------------------

const COLLECTION_PRODUCT_MAP: Record<string, string[]> = {
  sneakers:         ['Sneakers'],
  running:          ['Running'],
  boots:            ['Boots'],
  sandals:          ['Sandals'],
  loafers:          ['Loafers'],
  hiking:           ['Hiking'],
  frontpage:        ['Sneakers', 'Running', 'Boots'],
  'solevault-root': [],
};

// ---------------------------------------------------------------------------
// In-memory cart store
// ---------------------------------------------------------------------------

const cartStore: Map<string, ShopifyCart> = new Map();

function buildCart(id: string, lines: ShopifyCartLine[]): ShopifyCart {
  const total = lines.reduce((sum, l) => sum + parseFloat(l.merchandise.price.amount) * l.quantity, 0);
  const totalStr = total.toFixed(2);
  return {
    id,
    lines: { edges: lines.map(node => ({ node })) },
    cost: {
      totalAmount:    { amount: totalStr, currencyCode: 'KES' },
      subtotalAmount: { amount: totalStr, currencyCode: 'KES' },
      totalTaxAmount: { amount: '0.00',   currencyCode: 'KES' },
    },
    checkoutUrl: '/checkout',
  };
}

// ---------------------------------------------------------------------------
// Public read API
// ---------------------------------------------------------------------------

export async function getCollections(): Promise<ShopifyCollection[]> {
  return MOCK_COLLECTIONS;
}

export async function getProducts({
  first, sortKey, reverse, query,
}: { first?: number; sortKey?: string; reverse?: boolean; query?: string } = {}): Promise<ShopifyProduct[]> {
  let results = Array.from(productStore.values());

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p => p.title.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q));
  }
  if (sortKey === 'PRICE') {
    results.sort((a, b) => {
      const diff = parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? -diff : diff;
    });
  } else if (sortKey === 'TITLE') {
    results.sort((a, b) => reverse ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title));
  }
  return first ? results.slice(0, first) : results;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  return Array.from(productStore.values()).find(p => p.handle === handle) ?? null;
}

export async function getCollectionProducts({
  collection, limit, sortKey, reverse,
}: { collection: string; limit?: number; sortKey?: string; reverse?: boolean; query?: string }): Promise<ShopifyProduct[]> {
  const types = COLLECTION_PRODUCT_MAP[collection];
  let results = (types === undefined || types.length === 0)
    ? Array.from(productStore.values())
    : Array.from(productStore.values()).filter(p => types.includes(p.productType));

  if (sortKey === 'PRICE') {
    results.sort((a, b) => {
      const diff = parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? -diff : diff;
    });
  }
  return limit ? results.slice(0, limit) : results;
}

// ---------------------------------------------------------------------------
// Cart mutations
// ---------------------------------------------------------------------------

export async function createCart(): Promise<ShopifyCart> {
  const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const cart = buildCart(id, []);
  cartStore.set(id, cart);
  return cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  return cartStore.get(cartId) ?? null;
}

export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart> {
  const cart = cartStore.get(cartId) ?? buildCart(cartId, []);
  const existing = cart.lines.edges.map(e => e.node);

  for (const { merchandiseId, quantity } of lines) {
    const product = Array.from(productStore.values()).find(p => p.variants.edges.some(v => v.node.id === merchandiseId));
    const variant = product?.variants.edges.find(v => v.node.id === merchandiseId)?.node;
    if (!product || !variant) continue;

    const existingLine = existing.find(l => l.merchandise.id === merchandiseId);
    if (existingLine) {
      existingLine.quantity += quantity;
    } else {
      existing.push({
        id: `line-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        quantity,
        merchandise: {
          id: variant.id, title: variant.title, price: variant.price,
          selectedOptions: variant.selectedOptions ?? [],
          product: { title: product.title, handle: product.handle, images: product.images },
        },
      });
    }
  }

  const updated = buildCart(cartId, existing);
  cartStore.set(cartId, updated);
  return updated;
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<ShopifyCart> {
  const cart = cartStore.get(cartId) ?? buildCart(cartId, []);
  const existing = cart.lines.edges.map(e => e.node);
  for (const { id, quantity } of lines) {
    const line = existing.find(l => l.id === id);
    if (line) line.quantity = quantity;
  }
  const updated = buildCart(cartId, existing.filter(l => l.quantity > 0));
  cartStore.set(cartId, updated);
  return updated;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const cart = cartStore.get(cartId) ?? buildCart(cartId, []);
  const remaining = cart.lines.edges.map(e => e.node).filter(l => !lineIds.includes(l.id));
  const updated = buildCart(cartId, remaining);
  cartStore.set(cartId, updated);
  return updated;
}
