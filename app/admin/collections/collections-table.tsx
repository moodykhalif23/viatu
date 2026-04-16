'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

export type CollectionRow = {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  productCount: number;
  createdAt: Date;
};

const col = createColumnHelper<CollectionRow>();

const columns = [
  col.accessor('title', {
    header: 'Title',
    cell: (i) => <span className="font-medium">{i.getValue()}</span>,
  }),
  col.accessor('handle', {
    header: 'Handle',
    cell: (i) => <span className="font-mono text-xs text-muted-foreground">{i.getValue()}</span>,
  }),
  col.accessor('description', {
    header: 'Description',
    cell: (i) => <span className="text-muted-foreground truncate max-w-xs block">{i.getValue() ?? '—'}</span>,
    enableSorting: false,
  }),
  col.accessor('productCount', {
    header: 'Products',
    cell: (i) => <span className="text-right block">{i.getValue()}</span>,
  }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (i) => (
      <span className="text-muted-foreground text-sm">
        {new Date(i.getValue()).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    ),
  }),
];

export function CollectionsTable({ data }: { data: CollectionRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search collections…"
          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="rounded-md border bg-background overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/30">
                {hg.headers.map((header) => (
                  <th key={header.id} className="text-left px-5 py-3 font-medium text-muted-foreground">
                    {header.column.getCanSort() ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className="size-3" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className="size-3" />
                        ) : (
                          <ArrowUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                  No collections found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {data.length} collections
        </div>
      </div>
    </div>
  );
}
