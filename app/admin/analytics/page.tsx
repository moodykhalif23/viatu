import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED:    'bg-purple-100 text-purple-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
  REFUNDED:   'bg-gray-100 text-gray-800',
};

export default async function AnalyticsPage() {
  const [orders, customers, products] = await Promise.all([
    db.order.findMany({ select: { status: true, totalAmount: true, currencyCode: true, createdAt: true } }),
    db.customer.count(),
    db.product.count(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const currency = orders[0]?.currencyCode ?? 'KES';

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  // Revenue by month (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { label: d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' }), year: d.getFullYear(), month: d.getMonth() };
  });

  const revenueByMonth = months.map(({ label, year, month }) => {
    const total = orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === year && d.getMonth() === month && o.status !== 'CANCELLED' && o.status !== 'REFUNDED';
      })
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
    return { label, total };
  });

  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.total), 1);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{currency} {totalRevenue.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{orders.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{customers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{products}</p></CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue bar chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue — Last 6 Months</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-36">
              {revenueByMonth.map(({ label, total }) => (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{total > 0 ? `${(total / 1000).toFixed(0)}k` : ''}</span>
                  <div
                    className="w-full rounded-t bg-foreground/80 transition-all"
                    style={{ height: `${(total / maxRevenue) * 100}%`, minHeight: total > 0 ? '4px' : '0' }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders by status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Orders by Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? ''}`}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${(count / orders.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
