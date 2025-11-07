'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { RECIPES } from '@/data/recipes';
import { Search, Tag, ExternalLink, UtensilsCrossed, Fish, Drumstick, Citrus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

function IconBadge({ tag, title }: { tag: string; title: string }) {
  const base = 'grid size-16 place-items-center rounded-lg border border-zinc-800 bg-zinc-900/70';
  const common = 'size-6 text-zinc-300';
  if (title.toLowerCase().includes('salmon') || tag === 'seafood')
    return (
      <div className={base}>
        <Fish className={common} />
      </div>
    );
  if (title.toLowerCase().includes('chicken') || tag === 'weeknight')
    return (
      <div className={base}>
        <Drumstick className={common} />
      </div>
    );
  if (title.toLowerCase().includes('citrus') || tag === 'salad')
    return (
      <div className={base}>
        <Citrus className={common} />
      </div>
    );
  return (
    <div className={base}>
      <UtensilsCrossed className={common} />
    </div>
  );
}
export default function RecipesPage() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return RECIPES;
    return RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(v) ||
        r.tag.toLowerCase().includes(v) ||
        r.ingredients.some((i) => i.toLowerCase().includes(v)),
    );
  }, [q]);

  return (
    <div className='mx-auto max-w-6xl px-4 py-10'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-xl font-medium text-zinc-100'>Recipes</h1>
        <div className='hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm md:flex'>
          <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
            <Search className='size-4 text-zinc-400' />
          </div>
          <Input
            placeholder='Search recipes'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className='h-9 w-[320px] border-0 bg-transparent focus-visible:ring-0'
          />
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {filtered.map((r) => (
          <Link key={r.slug} href={`/recipes/${r.slug}`} className='group'>
            <Card className='relative overflow-hidden border-zinc-800 bg-zinc-950 transition-colors hover:bg-zinc-900/70'>
              <CardContent className='p-4'>
                <div className='mb-8 flex w-full items-center justify-center'>
                  <IconBadge tag={r.tag} title={r.title} />
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-zinc-100'>{r.title}</h3>
                    <div className='mt-1 flex items-center gap-2 text-xs text-zinc-400'>
                      <Badge variant='outline' className='border-zinc-700 text-zinc-300'>
                        {r.tag}
                      </Badge>
                      <span>{r.time}</span>
                    </div>
                  </div>
                  <ExternalLink className='size-4 text-zinc-400 transition group-hover:text-zinc-200' />
                </div>
              </CardContent>
              <div className='pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-white/10 transition-opacity group-hover:opacity-100' />
            </Card>
          </Link>
        ))}
      </div>

      {/* Mobile search */}
      <div className='mt-6 md:hidden'>
        <div className='flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm'>
          <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
            <Search className='size-4 text-zinc-400' />
          </div>
          <Input
            placeholder='Search recipes'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className='h-9 w-full border-0 bg-transparent focus-visible:ring-0'
          />
        </div>
      </div>
    </div>
  );
}
