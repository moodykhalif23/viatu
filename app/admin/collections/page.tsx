import { db } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Collections</h1>
        <p className="text-sm text-muted-foreground mt-1">{collections.length} total collections</p>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Handle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((col) => (
                <TableRow key={col.id}>
                  <TableCell className="font-medium">{col.title}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{col.handle}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {col.description ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">{col._count.products}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(col.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
