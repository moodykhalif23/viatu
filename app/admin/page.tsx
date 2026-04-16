import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getProducts } from '@/lib/shopify';

const STATUS_STYLES: Record<string, string> = {
  SHIPPED:    'bg-purple-100 text-purple-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
  PENDING:    'bg-gray-100 text-gray-800',
  REFUNDED:   'bg-gray-100 text-gray-800',
};

export default async function AdminDashboard() {
  const [orders, customerCount, products] = await Promise.all([
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        items: { select: { title: true, quantity: true } },
      },
    }),
    db.customer.count(),
    getProducts({}),
  ]);

  const totalOrders = await db.order.count();
  const revenue = orders.reduce((sum, o) =>
    o.status !== 'CANCELLED' && o.status !== 'REFUNDED' ? sum + Number(o.totalAmount) : sum, 0
  );

  const stats = [
    {
      label: 'Total Shoes',
      value: products.length.toLocaleString(),
      icon: Package,
      href: '/admin/shoes',
    },
    {
      label: 'Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    {
      label: 'Customers',
      value: customerCount.toLocaleString(),
      icon: Users,
      href: '/admin/customers',
    },
    {
      label: 'Revenue',
      value: `KES ${revenue.toLocaleString()}`,
      icon: TrendingUp,
      href: '/admin/analytics',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back — here's what's happening at SoleVault.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-background rounded-xl border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                <Icon className="size-4 text-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-xl border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Order</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Items</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No orders yet.</td>
                </tr>
              ) : orders.map((order) => {
                const name = order.customer
                  ? [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || order.customer.email
                  : '—';
                const items = order.items.map((i) => `${i.title}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).join(', ');
                return (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">#{order.orderNumber}</td>
                    <td className="px-6 py-4">{name}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{items || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] ?? ''}`}>
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {order.currencyCode} {Number(order.totalAmount).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
