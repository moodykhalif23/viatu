'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Footprints,
  Menu,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Shoes', href: '/admin/shoes', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Collections', href: '/admin/collections', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminBrand() {
  return (
    <div className="flex items-center gap-2 px-6 py-5 border-b">
      <Footprints className="size-6 text-foreground" />
      <span className="font-bold text-lg tracking-tight">SoleVault</span>
      <span className="ml-auto text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Admin</span>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Footprints className="size-5 text-foreground" />
          <span className="font-semibold">SoleVault Admin</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open admin menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin navigation</SheetTitle>
              <SheetDescription>Open admin sections from the mobile menu.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full flex-col">
              <AdminBrand />
              <AdminNav onNavigate={() => setOpen(false)} />
              <div className="px-3 py-4 border-t">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <LogOut className="size-4 shrink-0" />
                  Back to Store
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden md:flex w-64 shrink-0 border-r bg-background flex-col min-h-screen sticky top-0">
        <AdminBrand />
        <AdminNav />
        <div className="px-3 py-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Back to Store
          </Link>
        </div>
      </aside>
    </>
  );
}
