import Link from 'next/link';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 md:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">Review your order details and continue to secure payment.</p>
      </div>

      <section className="rounded-xl border bg-background p-5 md:p-6" id="order-summary">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your selected items are ready. Shipping and taxes will be calculated once payment details are confirmed.
        </p>

        <div className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span>Subtotal</span>
            <span>Calculated from cart</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span>Shipping</span>
            <span>Calculated at payment</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>Finalized at payment</span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-background p-5 md:p-6" id="payment">
        <h2 className="text-lg font-semibold">Payment</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue to payment to complete your order using a secure encrypted checkout flow.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2">
            <CreditCard className="size-4" />
            Continue to Payment
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">Keep Shopping</Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
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
