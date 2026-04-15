import {
  getCollections as getRawCollections,
  getProducts as getRawProducts,
  getCollectionProducts as getRawCollectionProducts,
  getProduct as getRawProduct,
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from './shopify';
import { thumbhashToDataURL } from './utils';
import type {
  ShopifyProduct,
  ShopifyCollection,
  Product,
  Collection,
  Cart,
  ProductOption,
  ProductVariant,
  Money,
  ProductCollectionSortKey,
  ProductSortKey,
} from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFirstSentence(text: string): string {
  if (!text) return '';
  const cleaned = text.trim();
  const match = cleaned.match(/^[^.!?]*[.!?]/);
  if (match) return match[0].trim();
  if (cleaned.length > 100) return cleaned.substring(0, 100).trim() + '...';
  return cleaned;
}

function transformShopifyMoney(shopifyMoney: { amount: string; currencyCode: string } | undefined): Money {
  return {
    amount: shopifyMoney?.amount || '0',
    currencyCode: shopifyMoney?.currencyCode || 'USD',
  };
}

function transformShopifyOptions(
  shopifyOptions: Array<{ id?: string; name: string; values: string[] }>
): ProductOption[] {
  return shopifyOptions.map(option => ({
    id: option.id || option.name.toLowerCase().replace(/\s+/g, '-'),
    name: option.name,
    values: option.values.map(value => ({
      id: value.toLowerCase().replace(/\s+/g, '-'),
      name: value,
    })),
  }));
}

function transformShopifyVariants(shopifyVariants: { edges: Array<{ node: any }> } | undefined): ProductVariant[] {
  if (!Array.isArray(shopifyVariants?.edges)) return [];
  return shopifyVariants!.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title || '',
    availableForSale: edge.node.availableForSale !== false,
    price: transformShopifyMoney(edge.node.price),
    selectedOptions: edge.node.selectedOptions || [],
  }));
}

function adaptShopifyCollection(c: ShopifyCollection): Collection {
  return {
    ...c,
    seo: { title: c.title, description: c.description || '' },
    parentCategoryTree: [],
    updatedAt: new Date().toISOString(),
    path: `/shop/${c.handle}`,
  };
}

function adaptShopifyProduct(p: ShopifyProduct): Product {
  const firstImage = p.images?.edges?.[0]?.node;
  const description = getFirstSentence(p.description || '');

  return {
    ...p,
    description,
    categoryId: p.productType || p.category?.name,
    tags: [],
    availableForSale: true,
    currencyCode: p.priceRange?.minVariantPrice?.currencyCode || 'USD',
    featuredImage: firstImage
      ? {
          ...firstImage,
          altText: firstImage.altText || p.title || '',
          height: 600,
          width: 600,
          thumbhash: firstImage.thumbhash ? thumbhashToDataURL(firstImage.thumbhash) : undefined,
        }
      : { url: '', altText: '', height: 0, width: 0 },
    seo: { title: p.title || '', description },
    priceRange: {
      minVariantPrice: transformShopifyMoney(p.priceRange?.minVariantPrice),
      maxVariantPrice: transformShopifyMoney(p.priceRange?.minVariantPrice),
    },
    compareAtPrice:
      p.compareAtPriceRange?.minVariantPrice &&
      parseFloat(p.compareAtPriceRange.minVariantPrice.amount) >
        parseFloat(p.priceRange?.minVariantPrice?.amount || '0')
        ? transformShopifyMoney(p.compareAtPriceRange.minVariantPrice)
        : undefined,
    images:
      p.images?.edges?.map(edge => ({
        ...edge.node,
        altText: edge.node.altText || p.title || '',
        height: 600,
        width: 600,
        thumbhash: edge.node.thumbhash ? thumbhashToDataURL(edge.node.thumbhash) : undefined,
      })) || [],
    options: transformShopifyOptions(p.options || []),
    variants: transformShopifyVariants(p.variants),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getCollections(): Promise<Collection[]> {
  const collections = await getRawCollections();
  return collections.map(adaptShopifyCollection);
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const collections = await getRawCollections();
  const found = collections.find(c => c.handle === handle);
  return found ? adaptShopifyCollection(found) : null;
}

export async function getProduct(handle: string): Promise<Product | null> {
  const product = await getRawProduct(handle);
  return product ? adaptShopifyProduct(product) : null;
}

export async function getProducts(params: {
  limit?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  const products = await getRawProducts(params);
  return products.map(adaptShopifyProduct);
}

export async function getCollectionProducts(params: {
  collection: string;
  limit?: number;
  sortKey?: ProductCollectionSortKey;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  const products = await getRawCollectionProducts(params);
  return products.map(adaptShopifyProduct);
}

export async function getCart(): Promise<Cart | null> {
  try {
    const { getCart: getCartAction } = await import('@/components/cart/actions');
    return await getCartAction();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export { createCart, addCartLines, updateCartLines, removeCartLines };
