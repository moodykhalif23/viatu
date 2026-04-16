import { db } from '@/lib/db';
import { CollectionsTable, type CollectionRow } from './collections-table';

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  const data: CollectionRow[] = collections.map((c) => ({
    id: c.id,
    title: c.title,
    handle: c.handle,
    description: c.description,
    productCount: c._count.products,
    createdAt: c.createdAt,
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">{collections.length} total collections</p>
      </div>
      <CollectionsTable data={data} />
    </div>
  );
}
