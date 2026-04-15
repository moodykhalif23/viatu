/**
 * Mock data layer — replaces Shopify Storefront API.
 * All functions return the same types as before so nothing else needs to change.
 */

import type { ShopifyProduct, ShopifyCollection, ShopifyCart, ShopifyCartLine } from './types';

// ---------------------------------------------------------------------------
// Mock collections
// ---------------------------------------------------------------------------

const MOCK_COLLECTIONS: ShopifyCollection[] = [
  { id: 'col-1', title: 'Sneakers', handle: 'sneakers', description: 'Everyday sneakers for every style.' },
  { id: 'col-2', title: 'Running', handle: 'running', description: 'Performance shoes built for speed.' },
  { id: 'col-3', title: 'Boots', handle: 'boots', description: 'Durable boots for any terrain.' },
  { id: 'col-4', title: 'Sandals', handle: 'sandals', description: 'Light and breezy warm-weather footwear.' },
  { id: 'col-5', title: 'Loafers', handle: 'loafers', description: 'Slip-on comfort with a polished look.' },
  { id: 'col-6', title: 'Hiking', handle: 'hiking', description: 'Trail-ready shoes for the outdoors.' },
  { id: 'col-7', title: 'New Arrivals', handle: 'frontpage', description: 'The latest drops from SoleVault.' },
];

// ---------------------------------------------------------------------------
// Mock products
// ---------------------------------------------------------------------------

function makeVariants(productId: string, sizes: string[], price: string, currencyCode = 'USD') {
  return {
    edges: sizes.map((size, i) => ({
      node: {
        id: `${productId}-variant-${i}`,
        title: `Size ${size}`,
        price: { amount: price, currencyCode },
        availableForSale: i < sizes.length - 1, // last size out of stock
        selectedOptions: [{ name: 'Size', value: size }],
      },
    })),
  };
}

function makeOptions(productId: string, sizes: string[]) {
  return [
    {
      id: `${productId}-opt-size`,
      name: 'Size',
      values: sizes,
    },
  ];
}

const SIZES_STANDARD = ['7', '8', '9', '10', '11', '12'];
const SIZES_WIDE = ['8', '9', '10', '11', '12', '13'];

const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'prod-1',
    title: 'Air Stride Pro',
    description: 'Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.',
    descriptionHtml: '<p>Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.</p>',
    handle: 'air-stride-pro',
    productType: 'Sneakers',
    options: makeOptions('prod-1', SIZES_STANDARD),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', altText: 'Air Stride Pro' } },
        { node: { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', altText: 'Air Stride Pro side view' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '129.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '159.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-1', SIZES_STANDARD, '129.99'),
  },
  {
    id: 'prod-2',
    title: 'Urban Runner X',
    description: 'A versatile running shoe designed for city streets and light trails.',
    descriptionHtml: '<p>A versatile running shoe designed for city streets and light trails.</p>',
    handle: 'urban-runner-x',
    productType: 'Running',
    options: makeOptions('prod-2', SIZES_STANDARD),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', altText: 'Urban Runner X' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '89.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '89.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-2', SIZES_STANDARD, '89.99'),
  },
  {
    id: 'prod-3',
    title: 'Classic Leather Boot',
    description: 'Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.',
    descriptionHtml: '<p>Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.</p>',
    handle: 'classic-leather-boot',
    productType: 'Boots',
    options: makeOptions('prod-3', SIZES_WIDE),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80', altText: 'Classic Leather Boot' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '199.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '249.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-3', SIZES_WIDE, '199.99'),
  },
  {
    id: 'prod-4',
    title: 'Trail Blazer GTX',
    description: 'Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.',
    descriptionHtml: '<p>Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.</p>',
    handle: 'trail-blazer-gtx',
    productType: 'Hiking',
    options: makeOptions('prod-4', SIZES_STANDARD),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800&q=80', altText: 'Trail Blazer GTX' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '149.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '149.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-4', SIZES_STANDARD, '149.99'),
  },
  {
    id: 'prod-5',
    title: 'Slip-On Canvas',
    description: 'Effortless canvas slip-on with a flexible sole — perfect for casual days.',
    descriptionHtml: '<p>Effortless canvas slip-on with a flexible sole — perfect for casual days.</p>',
    handle: 'slip-on-canvas',
    productType: 'Sneakers',
    options: makeOptions('prod-5', SIZES_STANDARD),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', altText: 'Slip-On Canvas' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '59.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '59.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-5', SIZES_STANDARD, '59.99'),
  },
  {
    id: 'prod-6',
    title: 'Velvet Mule',
    description: 'Luxurious velvet mule with a block heel — from desk to dinner.',
    descriptionHtml: '<p>Luxurious velvet mule with a block heel — from desk to dinner.</p>',
    handle: 'velvet-mule',
    productType: 'Sandals',
    options: makeOptions('prod-6', ['5', '6', '7', '8', '9', '10']),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', altText: 'Velvet Mule' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '74.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '74.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-6', ['5', '6', '7', '8', '9', '10'], '74.99'),
  },
  {
    id: 'prod-7',
    title: 'High-Top Retro',
    description: 'Retro-inspired high-top with premium suede panels and a vulcanised sole.',
    descriptionHtml: '<p>Retro-inspired high-top with premium suede panels and a vulcanised sole.</p>',
    handle: 'high-top-retro',
    productType: 'Sneakers',
    options: makeOptions('prod-7', SIZES_STANDARD),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', altText: 'High-Top Retro' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '109.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '129.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-7', SIZES_STANDARD, '109.99'),
  },
  {
    id: 'prod-8',
    title: 'Minimalist Loafer',
    description: 'Clean-lined leather loafer with a memory foam footbed for all-day comfort.',
    descriptionHtml: '<p>Clean-lined leather loafer with a memory foam footbed for all-day comfort.</p>',
    handle: 'minimalist-loafer',
    productType: 'Loafers',
    options: makeOptions('prod-8', SIZES_WIDE),
    images: {
      edges: [
        { node: { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80', altText: 'Minimalist Loafer' } },
      ],
    },
    priceRange: { minVariantPrice: { amount: '119.99', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '119.99', currencyCode: 'USD' } },
    variants: makeVariants('prod-8', SIZES_WIDE, '119.99'),
  },
];

// Map collection handle → product types
const COLLECTION_PRODUCT_MAP: Record<string, string[]> = {
  sneakers: ['Sneakers'],
  running: ['Running'],
  boots: ['Boots'],
  sandals: ['Sandals'],
  loafers: ['Loafers'],
  hiking: ['Hiking'],
  frontpage: ['Sneakers', 'Running', 'Boots'], // new arrivals = first 3 types
  'solevault-root': [], // all products
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
      totalAmount: { amount: totalStr, currencyCode: 'USD' },
      subtotalAmount: { amount: totalStr, currencyCode: 'USD' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'USD' },
    },
    checkoutUrl: '#checkout',
  };
}

// ---------------------------------------------------------------------------
// Public API — same signatures as the old shopify.ts
// ---------------------------------------------------------------------------

export async function getCollections(): Promise<ShopifyCollection[]> {
  return MOCK_COLLECTIONS;
}

export async function getProducts({
  first,
  sortKey,
  reverse,
  query,
}: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
} = {}): Promise<ShopifyProduct[]> {
  let results = [...MOCK_PRODUCTS];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      p => p.title.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q)
    );
  }

  if (sortKey === 'PRICE') {
    results.sort((a, b) => {
      const diff =
        parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? -diff : diff;
    });
  } else if (sortKey === 'TITLE') {
    results.sort((a, b) => (reverse ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)));
  }

  return first ? results.slice(0, first) : results;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  return MOCK_PRODUCTS.find(p => p.handle === handle) ?? null;
}

export async function getCollectionProducts({
  collection,
  limit,
  sortKey,
  reverse,
}: {
  collection: string;
  limit?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
}): Promise<ShopifyProduct[]> {
  const types = COLLECTION_PRODUCT_MAP[collection];
  // undefined types = unknown collection → return all; empty array = all
  let results =
    types === undefined || types.length === 0
      ? [...MOCK_PRODUCTS]
      : MOCK_PRODUCTS.filter(p => types.includes(p.productType));

  if (sortKey === 'PRICE') {
    results.sort((a, b) => {
      const diff =
        parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
      return reverse ? -diff : diff;
    });
  }

  return limit ? results.slice(0, limit) : results;
}

export async function createCart(): Promise<ShopifyCart> {
  const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const cart = buildCart(id, []);
  cartStore.set(id, cart);
  return cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  return cartStore.get(cartId) ?? null;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const cart = cartStore.get(cartId) ?? buildCart(cartId, []);
  const existing = cart.lines.edges.map(e => e.node);

  for (const { merchandiseId, quantity } of lines) {
    const product = MOCK_PRODUCTS.find(p => p.variants.edges.some(v => v.node.id === merchandiseId));
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
          id: variant.id,
          title: variant.title,
          price: variant.price,
          selectedOptions: variant.selectedOptions ?? [],
          product: {
            title: product.title,
            handle: product.handle,
            images: product.images,
          },
        },
      });
    }
  }

  const updated = buildCart(cartId, existing);
  cartStore.set(cartId, updated);
  return updated;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart> {
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
