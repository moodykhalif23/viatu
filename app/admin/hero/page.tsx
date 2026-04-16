import { Metadata } from 'next';
import { requireAdmin } from '@/lib/admin-auth';
import { adminGetHeroes } from '@/lib/shopify/shopify';
import { HeroManager } from './hero-manager';

export const metadata: Metadata = {
  title: 'SoleVault Admin — Hero Images',
};

export default async function AdminHeroPage() {
  await requireAdmin();
  const heroes = adminGetHeroes();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hero Images</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage the homepage hero carousel. Active images appear on the storefront.
        </p>
      </div>
      <HeroManager heroes={heroes} />
    </div>
  );
}
