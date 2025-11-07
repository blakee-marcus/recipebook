'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Item = { slug: string; title: string; tag: string; time?: string };

export default function TagResults({ initial, tagName }: { initial: Item[]; tagName: string }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'alpha' | 'time'>('alpha');

  const list = useMemo(() => {
    const filtered = q
      ? initial.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
      : [...initial];

    if (sort === 'alpha') filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'time') {
      // time formatted like "25 min" -> sort asc by minutes
      const toMin = (s?: string) => {
        if (!s) return Number.MAX_SAFE_INTEGER;
        const m = /(\d+)\s*min/i.exec(s);
        return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
      };
      filtered.sort((a, b) => toMin(a.time) - toMin(b.time) || a.title.localeCompare(b.title));
    }

    return filtered;
  }, [initial, q, sort]);

  return (
    <section className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]'>
      {/* Left: results */}
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pb-3'>
          {/* Controls */}
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm w-full sm:max-w-md'>
              <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
                <Search className='size-4 text-zinc-400' />
              </div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${tagName}`}
                className='h-9 w-full border-0 bg-transparent text-sm placeholder:text-zinc-500 focus-visible:ring-0'
                aria-label='Search recipes'
              />
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='h-9 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800'
                onClick={() => setSort(sort === 'alpha' ? 'time' : 'alpha')}
                aria-label='Toggle sort'>
                {sort === 'alpha' ? 'Sort: A to Z' : 'Sort: Time'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Result grid */}
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {list.map((r) => (
              <div key={r.slug} className='group rounded-xl border border-zinc-800 bg-zinc-950 p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <Link
                      href={`/recipes/${r.slug}`}
                      className='text-sm font-medium text-zinc-100 hover:underline'>
                      {r.title}
                    </Link>
                    <div className='mt-1 flex items-center gap-2 text-xs text-zinc-500'>
                      <Badge variant='outline' className='border-zinc-700 text-zinc-300'>
                        {r.tag}
                      </Badge>
                      {r.time ? (
                        <span className='inline-flex items-center gap-1'>
                          <Clock className='size-3' />
                          {r.time}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Link href={`/recipes/${r.slug}`} className='inline-flex'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='size-8 text-zinc-300 hover:bg-zinc-800'
                      aria-label='Open recipe'>
                      <ExternalLink className='size-4' />
                    </Button>
                  </Link>
                </div>

                <Separator className='my-3 border-zinc-800' />

                <div className='text-xs text-zinc-500'>
                  <span>Opens the recipe page.</span>
                </div>
              </div>
            ))}

            {!list.length && (
              <div className='rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center text-sm text-zinc-400'>
                No results
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right: quick links */}
      <aside className='top-24 hidden md:block'>
        <Card className='sticky border-zinc-800 bg-zinc-950 p-0'>
          <CardContent className='p-4'>
            <div className='text-sm text-zinc-300'>More tags</div>
            <Separator className='my-3 border-zinc-800' />
            <div className='flex flex-wrap gap-2'>
              <Link
                href='/tags'
                className='rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-900'>
                Browse all tags
              </Link>
            </div>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}
