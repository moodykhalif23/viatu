import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const SIZES_STANDARD = ['7', '8', '9', '10', '11', '12'];
const SIZES_WIDE = ['8', '9', '10', '11', '12', '13'];
const SIZES_WOMENS = ['5', '6', '7', '8', '9', '10'];

const collections = [
  { handle: 'sneakers',  title: 'Sneakers',     description: 'Everyday sneakers for every style.' },
  { handle: 'running',   title: 'Running',      description: 'Performance shoes built for speed.' },
  { handle: 'boots',     title: 'Boots',        description: 'Durable boots for any terrain.' },
  { handle: 'sandals',   title: 'Sandals',      description: 'Light and breezy warm-weather footwear.' },
  { handle: 'loafers',   title: 'Loafers',      description: 'Slip-on comfort with a polished look.' },
  { handle: 'hiking',    title: 'Hiking',       description: 'Trail-ready shoes for the outdoors.' },
  { handle: 'frontpage', title: 'New Arrivals', description: 'The latest drops from SoleVault.' },
];

type ProductSeed = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  price: number;
  compareAtPrice?: number;
  sizes: string[];
  images: { url: string; altText: string }[];
  collections: string[];
};

const products: ProductSeed[] = [
  {
    handle: 'air-stride-pro',
    title: 'Air Stride Pro',
    description: 'Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.',
    descriptionHtml: '<p>Lightweight everyday sneaker with responsive cushioning and a breathable mesh upper.</p>',
    productType: 'Sneakers',
    price: 12999,
    compareAtPrice: 15999,
    sizes: SIZES_STANDARD,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', altText: 'Air Stride Pro' },
      { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', altText: 'Air Stride Pro side' },
    ],
    collections: ['sneakers', 'frontpage'],
  },
  {
    handle: 'urban-runner-x',
    title: 'Urban Runner X',
    description: 'A versatile running shoe designed for city streets and light trails.',
    descriptionHtml: '<p>A versatile running shoe designed for city streets and light trails.</p>',
    productType: 'Running',
    price: 8999,
    sizes: SIZES_STANDARD,
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', altText: 'Urban Runner X' },
    ],
    collections: ['running', 'frontpage'],
  },
  {
    handle: 'classic-leather-boot',
    title: 'Classic Leather Boot',
    description: 'Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.',
    descriptionHtml: '<p>Full-grain leather Chelsea boot with a cushioned insole and durable rubber sole.</p>',
    productType: 'Boots',
    price: 19999,
    compareAtPrice: 24999,
    sizes: SIZES_WIDE,
    images: [
      { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80', altText: 'Classic Leather Boot' },
    ],
    collections: ['boots'],
  },
  {
    handle: 'trail-blazer-gtx',
    title: 'Trail Blazer GTX',
    description: 'Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.',
    descriptionHtml: '<p>Waterproof hiking shoe with aggressive grip and ankle support for tough terrain.</p>',
    productType: 'Hiking',
    price: 14999,
    sizes: SIZES_STANDARD,
    images: [
      { url: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800&q=80', altText: 'Trail Blazer GTX' },
    ],
    collections: ['hiking'],
  },
  {
    handle: 'slip-on-canvas',
    title: 'Slip-On Canvas',
    description: 'Effortless canvas slip-on with a flexible sole — perfect for casual days.',
    descriptionHtml: '<p>Effortless canvas slip-on with a flexible sole — perfect for casual days.</p>',
    productType: 'Sneakers',
    price: 5999,
    sizes: SIZES_STANDARD,
    images: [
      { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', altText: 'Slip-On Canvas' },
    ],
    collections: ['sneakers'],
  },
  {
    handle: 'velvet-mule',
    title: 'Velvet Mule',
    description: 'Luxurious velvet mule with a block heel — from desk to dinner.',
    descriptionHtml: '<p>Luxurious velvet mule with a block heel — from desk to dinner.</p>',
    productType: 'Sandals',
    price: 7499,
    sizes: SIZES_WOMENS,
    images: [
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80', altText: 'Velvet Mule' },
    ],
    collections: ['sandals'],
  },
  {
    handle: 'high-top-retro',
    title: 'High-Top Retro',
    description: 'Retro-inspired high-top with premium suede panels and a vulcanised sole.',
    descriptionHtml: '<p>Retro-inspired high-top with premium suede panels and a vulcanised sole.</p>',
    productType: 'Sneakers',
    price: 10999,
    compareAtPrice: 12999,
    sizes: SIZES_STANDARD,
    images: [
      { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80', altText: 'High-Top Retro' },
    ],
    collections: ['sneakers', 'frontpage'],
  },
  {
    handle: 'minimalist-loafer',
    title: 'Minimalist Loafer',
    description: 'Clean-lined leather loafer with a memory foam footbed for all-day comfort.',
    descriptionHtml: '<p>Clean-lined leather loafer with a memory foam footbed for all-day comfort.</p>',
    productType: 'Loafers',
    price: 11999,
    sizes: SIZES_WIDE,
    images: [
      { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80', altText: 'Minimalist Loafer' },
    ],
    collections: ['loafers'],
  },
];

async function main() {
  console.log('Seeding collections…');
  const collectionMap = new Map<string, string>();

  for (const c of collections) {
    const record = await db.collection.upsert({
      where: { handle: c.handle },
      update: { title: c.title, description: c.description },
      create: { handle: c.handle, title: c.title, description: c.description },
    });
    collectionMap.set(c.handle, record.id);
    console.log(`  ✓ ${c.title}`);
  }

  console.log('\nSeeding products…');
  for (const p of products) {
    // Upsert product
    const product = await db.product.upsert({
      where: { handle: p.handle },
      update: {
        title: p.title,
        description: p.description,
        descriptionHtml: p.descriptionHtml,
        productType: p.productType,
        minPrice: p.price,
        maxPrice: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currencyCode: 'KES',
        availableForSale: true,
      },
      create: {
        handle: p.handle,
        title: p.title,
        description: p.description,
        descriptionHtml: p.descriptionHtml,
        productType: p.productType,
        minPrice: p.price,
        maxPrice: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        currencyCode: 'KES',
        availableForSale: true,
      },
    });

    // Replace images
    await db.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.images.length; i++) {
      await db.productImage.create({
        data: { url: p.images[i]!.url, altText: p.images[i]!.altText, position: i, productId: product.id },
      });
    }

    // Replace options + values
    await db.productOptionValue.deleteMany({ where: { option: { productId: product.id } } });
    await db.productOption.deleteMany({ where: { productId: product.id } });
    const option = await db.productOption.create({
      data: { name: 'Size', productId: product.id },
    });
    for (const size of p.sizes) {
      await db.productOptionValue.create({ data: { value: size, optionId: option.id } });
    }

    // Replace variants
    await db.variantOption.deleteMany({ where: { variant: { productId: product.id } } });
    await db.productVariant.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.sizes.length; i++) {
      const variant = await db.productVariant.create({
        data: {
          title: `Size ${p.sizes[i]}`,
          price: p.price,
          availableForSale: i < p.sizes.length - 1,
          productId: product.id,
        },
      });
      await db.variantOption.create({
        data: { name: 'Size', value: p.sizes[i]!, variantId: variant.id },
      });
    }

    // Sync collection memberships
    await db.productCollection.deleteMany({ where: { productId: product.id } });
    for (const handle of p.collections) {
      const colId = collectionMap.get(handle);
      if (colId) {
        await db.productCollection.create({
          data: { productId: product.id, collectionId: colId },
        });
      }
    }

    console.log(`  ✓ ${p.title}`);
  }

  console.log('\nDone!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
