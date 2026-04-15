import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <h1 className="text-2xl font-bold capitalize">orders</h1>
      <p className="text-sm text-muted-foreground">
        This section is available from both desktop sidebar and mobile menu.
      </p>
      <Link href="/admin" className="text-sm font-medium underline-offset-4 hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
