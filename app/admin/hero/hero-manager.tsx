'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Eye, EyeOff, Pencil, Loader2, X } from 'lucide-react';
import { upsertHeroAction, deleteHeroAction, toggleHeroAction } from './actions';
import type { HeroImage } from '@/lib/shopify/shopify';

interface HeroManagerProps {
  heroes: HeroImage[];
}

function HeroForm({
  hero,
  onClose,
}: {
  hero?: HeroImage;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await upsertHeroAction(fd);
      if ('error' in result) setError(result.error as string);
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
      <div className="bg-background rounded-xl border shadow-lg w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{hero ? 'Edit Hero Image' : 'Add Hero Image'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hero && <input type="hidden" name="id" value={hero.id} />}
          <input type="hidden" name="active" value={hero?.active ? 'true' : 'false'} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Image URL</label>
            <input name="url" required defaultValue={hero?.url}
              className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Alt Text</label>
            <input name="alt" required defaultValue={hero?.alt}
              className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="Describe the image" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Label (shown on slide)</label>
            <input name="label" required defaultValue={hero?.label}
              className="w-full px-3 py-2 text-sm border rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              placeholder="e.g. New Season" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {hero ? 'Save Changes' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function HeroManager({ heroes: initialHeroes }: HeroManagerProps) {
  const [heroes, setHeroes] = useState(initialHeroes);
  const [editing, setEditing] = useState<HeroImage | null | 'new'>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Delete this hero image?')) return;
    const fd = new FormData();
    fd.set('id', id);
    startTransition(async () => {
      await deleteHeroAction(fd);
      setHeroes(h => h.filter(x => x.id !== id));
    });
  }

  function handleToggle(hero: HeroImage) {
    const fd = new FormData();
    fd.set('id', hero.id);
    startTransition(async () => {
      await toggleHeroAction(fd);
      setHeroes(h => h.map(x => x.id === hero.id ? { ...x, active: !x.active } : x));
    });
  }

  return (
    <>
      {editing && (
        <HeroForm
          hero={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-2 rounded-md hover:opacity-90"
        >
          <Plus className="size-4" /> Add Hero Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {heroes.map(hero => (
          <div key={hero.id} className={`bg-background rounded-xl border overflow-hidden ${!hero.active ? 'opacity-60' : ''}`}>
            <div className="relative aspect-video">
              <Image src={hero.url} alt={hero.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{hero.label}</span>
              <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full ${hero.active ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {hero.active ? 'Active' : 'Hidden'}
              </span>
            </div>
            <div className="p-3 flex items-center gap-2">
              <p className="text-xs text-muted-foreground flex-1 truncate">{hero.alt}</p>
              <button onClick={() => handleToggle(hero)} disabled={isPending}
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title={hero.active ? 'Hide' : 'Show'}>
                {hero.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
              <button onClick={() => setEditing(hero)}
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Pencil className="size-4" />
              </button>
              <button onClick={() => handleDelete(hero.id)} disabled={isPending}
                className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {heroes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground border rounded-xl bg-background">
          <p className="font-medium">No hero images yet</p>
          <p className="text-sm mt-1">Add your first hero image to display on the homepage.</p>
        </div>
      )}
    </>
  );
}
