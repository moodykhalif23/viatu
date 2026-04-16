import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-20 text-center">
      <CheckCircle className="size-16 text-green-500" />
      <h1 className="text-3xl font-bold tracking-tight">Order Confirmed</h1>
      <p className="text-muted-foreground">
        Your payment was successful. We&apos;re processing your order and will be in touch shortly.
      </p>
      {searchParams.orderId && (
        <p className="text-sm text-muted-foreground">
          Order reference: <span className="font-mono font-medium text-foreground">{searchParams.orderId}</span>
        </p>
      )}
      <Button asChild size="lg">
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </main>
  );
}
