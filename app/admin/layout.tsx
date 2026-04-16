import type { Metadata } from 'next';
import { AdminSidebar } from './components/admin-sidebar';

export const metadata: Metadata = {
  title: 'SoleVault Admin',
  description: 'SoleVault admin dashboard — manage your shoe inventory.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
