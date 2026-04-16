'use client';

import Link from 'next/link';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-context';
import { formatPrice } from '@/lib/shopify/utils';
import { PaymentForm } from './components/payment-form';
import type { CartLineInput } from './actions';

export default function CheckoutPage() {
  const { cart } = useCart();

  const subtotal = cart?.cost.subtotalAmount;
  const total = cart?.cost.totalAmount;
  const hasItems = cart && cart.lines.length > 0;

  const lines: CartLineInput[] = (cart?.lines ?? []).map(item => ({
    title: item.merchandise.product.title,
    variantTitle: item.merchandise.title !== 'Default Title' ? item.merchandise.title : undefined,
    quantity: item.quantity,
    unitPrice: Number(item.cost.totalAmount.amount) / item.quantity,
  }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 md:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Review your order and complete payment below.</p>
      </div>

      <section className="rounded-xl border bg-background p-5 md:p-6" id="order-summary">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {hasItems ? (
          <ul className="mt-4 flex flex-col gap-3">
            {cart.lines.map(item => (
              <li key={item.merchandise.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {item.merchandise.product.title}
                  {item.merchandise.title !== 'Default Title' && (
                    <span className="ml-1 text-muted-foreground">— {item.merchandise.title}</span>
                  )}
                  <span className="ml-2 text-muted-foreground">× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Your cart is empty.</p>
        )}

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span>Subtotal</span>
            <span>{subtotal ? formatPrice(subtotal.amount, subtotal.currencyCode) : '—'}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>Shipping</span>
            <span className="text-muted-foreground">Calculated at payment</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>{total ? formatPrice(total.amount, total.currencyCode) : '—'}</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-background p-5 md:p-6" id="payment">
        <h2 className="mb-4 text-lg font-semibold">Payment</h2>

        <PaymentForm
          lines={lines}
          totalAmount={total ? Number(total.amount) : 0}
          currencyCode={total?.currencyCode ?? 'KES'}
          disabled={!hasItems}
        />

        {!hasItems && (
          <div className="mt-4">
            <Button size="lg" variant="outline" asChild>
              <Link href="/shop">Go Shopping</Link>
            </Button>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Lock className="size-3.5" /> SSL Encrypted
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> Fraud Protection
          </span>
        </div>
      </section>
    </main>
  );
}
