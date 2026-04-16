import { db } from '@/lib/db';
import { CustomersTable, type CustomerRow } from './customers-table';

export default async function CustomersPage() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  const data: CustomerRow[] = customers.map((c) => ({
    id: c.id,
    name: [c.firstName, c.lastName].filter(Boolean).join(' '),
    email: c.email,
    phone: c.phone,
    orderCount: c._count.orders,
    createdAt: c.createdAt,
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} total customers</p>
      </div>
      <CustomersTable data={data} />
    </div>
  );
}
