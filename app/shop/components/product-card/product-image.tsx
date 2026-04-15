'use client';

import { useProductImages, useSelectedVariant } from '@/components/products/variant-selector';
import { Product } from '@/lib/shopify/types';
import Image from 'next/image';

export const ProductImage = ({ product }: { product: Product }) => {
  const selectedVariant = useSelectedVariant(product);

  const [variantImage] = useProductImages(product, selectedVariant?.selectedOptions);

  return (
    <Image
      src={variantImage.url}
      alt={variantImage.altText || product.title}
      fill
      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      quality={80}
      placeholder={variantImage?.thumbhash ? 'blur' : undefined}
      blurDataURL={variantImage?.thumbhash}
    />
  );
};
