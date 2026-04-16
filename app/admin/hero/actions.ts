'use server';

import { requireAdmin } from '@/lib/admin-auth';
import { adminUpsertHero, adminDeleteHero, heroStore, type HeroImage } from '@/lib/shopify/shopify';
import { revalidatePath } from 'next/cache';

export async function upsertHeroAction(formData: FormData) {
  await requireAdmin();

  const id     = (formData.get('id') as string) || `hero-${Date.now()}`;
  const url    = formData.get('url') as string;
  const alt    = formData.get('alt') as string;
  const label  = formData.get('label') as string;
  const active = formData.get('active') === 'true';

  adminUpsertHero({ id, url, alt, label, active });
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

export async function deleteHeroAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  adminDeleteHero(id);
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}

export async function toggleHeroAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const hero = heroStore.get(id);
  if (hero) {
    adminUpsertHero({ ...hero, active: !hero.active });
  }
  revalidatePath('/');
  revalidatePath('/admin/hero');
  return { success: true };
}
