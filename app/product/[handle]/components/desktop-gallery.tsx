'use client';

import { useProductImages, useSelectedVariant } from '@/components/products/variant-selector';
import { Product } from '@/lib/shopify/types';
import Image from 'next/image';

export const DesktopGallery = ({ product }: { product: Product }) => {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={`${image.url}-${image.selectedOptions?.map(o => `${o.name},${o.value}`).join('-')}`}
          src={image.url}
          alt={image.altText}
          width={800}
          height={800}
          sizes="(max-width: 1280px) 60vw, 50vw"
          className="w-full object-cover"
          quality={80}
          priority={index === 0}
        />
      ))}
    </>
  );
};
