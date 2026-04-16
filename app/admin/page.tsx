import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Shoes',
    value: '248',
    change: '+12 this month',
    trend: 'up',
    icon: Package,
    href: '/admin/shoes',
  },
  {
    label: 'Orders',
    value: '1,340',
    change: '+8.2% vs last month',
    trend: 'up',
    icon: ShoppingCart,
    href: '/admin/orders',
  },
  {
    label: 'Customers',
    value: '5,892',
    change: '+3.1% vs last month',
    trend: 'up',
    icon: Users,
    href: '/admin/customers',
  },
  {
    label: 'Revenue',
    value: 'KSh 8,432,000',
    change: '-2.4% vs last month',
    trend: 'down',
    icon: TrendingUp,
    href: '/admin/analytics',
  },
];

const recentOrders = [
  { id: '#ORD-1042', customer: 'Alex Rivera', product: 'Air Stride Pro — Size 10', status: 'Shipped', amount: 'KSh 12,999' },
  { id: '#ORD-1041', customer: 'Jordan Lee', product: 'Urban Runner — Size 9', status: 'Processing', amount: 'KSh 8,999' },
  { id: '#ORD-1040', customer: 'Sam Chen', product: 'Classic Leather Boot — Size 11', status: 'Delivered', amount: 'KSh 19,999' },
  { id: '#ORD-1039', customer: 'Morgan Kim', product: 'Trail Blazer — Size 8', status: 'Shipped', amount: 'KSh 14,999' },
  { id: '#ORD-1038', customer: 'Taylor Brooks', product: 'Slip-On Canvas — Size 7', status: 'Delivered', amount: 'KSh 5,999' },
];

const statusColors: Record<string, string> = {
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back — here's what's happening at SoleVault.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, trend, icon: Icon, href }) => (
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
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p
                className={cn(
                  'text-xs mt-1 flex items-center gap-1',
                  trend === 'up' ? 'text-green-600' : 'text-red-500'
                )}
              >
                {trend === 'up' ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {change}
              </p>
            </div>
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
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-3 font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.product}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// inline cn helper since this is a server component
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
