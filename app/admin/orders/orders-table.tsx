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

const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED:    'bg-purple-100 text-purple-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
  REFUNDED:   'bg-gray-100 text-gray-800',
};

export type OrderRow = {
  id: string;
  orderNumber: number;
  customerName: string;
  itemSummary: string;
  status: string;
  totalAmount: number;
  currencyCode: string;
  createdAt: Date;
};

const col = createColumnHelper<OrderRow>();

const columns = [
  col.accessor('orderNumber', {
    header: 'Order',
    cell: (i) => <span className="font-medium">#{i.getValue()}</span>,
  }),
  col.accessor('customerName', { header: 'Customer' }),
  col.accessor('itemSummary', {
    header: 'Items',
    cell: (i) => <span className="text-muted-foreground truncate max-w-xs block">{i.getValue() || '—'}</span>,
    enableSorting: false,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (i) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[i.getValue()] ?? ''}`}>
        {i.getValue().charAt(0) + i.getValue().slice(1).toLowerCase()}
      </span>
    ),
  }),
  col.accessor('totalAmount', {
    header: 'Total',
    cell: (i) => (
      <span className="font-medium">
        {i.row.original.currencyCode} {i.getValue().toLocaleString()}
      </span>
    ),
  }),
  col.accessor('createdAt', {
    header: 'Date',
    cell: (i) => (
      <span className="text-muted-foreground text-sm">
        {new Date(i.getValue()).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    ),
  }),
];

export function OrdersTable({ data }: { data: OrderRow[] }) {
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
          placeholder="Search orders…"
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
                  No orders found.
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
          {table.getFilteredRowModel().rows.length} of {data.length} orders
        </div>
      </div>
    </div>
  );
}
