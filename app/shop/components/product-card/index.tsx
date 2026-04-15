import React, { Suspense } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { AddToCart, AddToCartButton } from '@/components/cart/add-to-cart';
import { formatPrice } from '@/lib/shopify/utils';
import { VariantSelector } from '../variant-selector';
import { ProductImage } from './product-image';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export const ProductCard = ({ product }: { product: Product }) => {
  const hasNoOptions = product.options.length === 0;
  const hasOneOptionWithOneValue = product.options.length === 1 && product.options[0].values.length === 1;
  const justHasColorOption = product.options.length === 1 && product.options[0].name.toLowerCase() === 'color';
  const renderInCardAddToCart = hasNoOptions || hasOneOptionWithOneValue || justHasColorOption;

  return (
    <div className="relative w-full flex flex-col bg-muted group overflow-hidden">
      {/* Image */}
      <Link
        href={`/product/${product.handle}`}
        className="block w-full aspect-[3/4] focus-visible:outline-none overflow-hidden"
        aria-label={`View ${product.title}`}
        prefetch
      >
        <Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
          <ProductImage product={product} />
        </Suspense>
      </Link>

      {/* Info bar — always visible on mobile, hover-reveal on desktop */}
      <div className="p-3 flex flex-col gap-2 md:absolute md:inset-x-0 md:bottom-0 md:p-3 md:bg-popover/95 md:backdrop-blur-sm md:translate-y-full md:opacity-0 md:transition-all md:duration-200 group-hover:md:translate-y-0 group-hover:md:opacity-100">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight text-balance">{product.title}</p>
          <div className="flex gap-1.5 items-center text-sm font-semibold shrink-0">
            {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
            {product.compareAtPrice && (
              <span className="line-through opacity-40 text-xs">
                {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderInCardAddToCart ? (
            <>
              <Suspense fallback={null}>
                <VariantSelector product={product} />
              </Suspense>
              <Suspense fallback={<AddToCartButton className="flex-1" product={product} size="sm" />}>
                <AddToCart className="flex-1" size="sm" product={product} />
              </Suspense>
            </>
          ) : (
            <Button className="w-full" size="sm" variant="default" asChild>
              <Link href={`/product/${product.handle}`}>
                <span>View Shoe</span>
                <ArrowRightIcon className="size-3.5 ml-auto" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
