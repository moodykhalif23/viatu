import { db } from '@/lib/db';
import { OrdersTable, type OrderRow } from './orders-table';

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { firstName: true, lastName: true, email: true } },
      items: { select: { title: true, quantity: true } },
    },
  });

  const data: OrderRow[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customer
      ? [o.customer.firstName, o.customer.lastName].filter(Boolean).join(' ') || o.customer.email
      : '—',
    itemSummary: o.items.map((i) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', '),
    status: o.status,
    totalAmount: Number(o.totalAmount),
    currencyCode: o.currencyCode,
    createdAt: o.createdAt,
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>
      <OrdersTable data={data} />
    </div>
  );
}
