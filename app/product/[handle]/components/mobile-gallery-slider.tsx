'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/lib/shopify/types';
import { Badge } from '@/components/ui/badge';
import { useProductImages, useSelectedVariant } from '@/components/products/variant-selector';

interface MobileGallerySliderProps {
  product: Product;
}

export function MobileGallerySlider({ product }: MobileGallerySliderProps) {
  const selectedVariant = useSelectedVariant(product);
  const images = useProductImages(product, selectedVariant?.selectedOptions);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    loop: false,
    watchDrag: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const totalImages = images.length;
  if (totalImages === 0) return null;

  return (
    <div className="relative w-full h-full">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="flex-shrink-0 w-full h-full relative"
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                quality={80}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="outline-secondary">
            {selectedIndex + 1} / {totalImages}
          </Badge>
        </div>
      )}
    </div>
  );
}
