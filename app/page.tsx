'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  ChefHat,
  Tag,
  Github,
  ExternalLink,
  UtensilsCrossed,
  Drumstick,
  Fish,
  Citrus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  const [query, setQuery] = useState('');

  const featured = [
    {
      id: 1,
      title: 'Cold Sesame Noodles',
      tag: 'noodles',
      time: '20 min',
      slug: 'cold-sesame-noodles',
    },
    {
      id: 2,
      title: 'Sheet Pan Chicken',
      tag: 'weeknight',
      time: '35 min',
      slug: 'sheet-pan-chicken',
    },
    {
      id: 3,
      title: 'Miso Roasted Salmon',
      tag: 'seafood',
      time: '25 min',
      slug: 'miso-roasted-salmon',
    },
    {
      id: 4,
      title: 'Citrus Olive Salad',
      tag: 'salad',
      time: '10 min',
      slug: 'citrus-olive-salad',
    },
  ];

  const tags = [
    'breakfast',
    'noodles',
    'soups',
    'vegetarian',
    'seafood',
    'weeknight',
    'spicy',
    'sweet',
  ];

  function IconBadge({ r }: { r: { id: number; title: string; tag: string } }) {
    const base = 'grid size-16 place-items-center rounded-lg border border-zinc-800 bg-zinc-900/70';
    const common = 'size-6 text-zinc-300';

    if (r.title.toLowerCase().includes('salmon') || r.tag === 'seafood') {
      return (
        <div className={base}>
          <Fish className={common} />
        </div>
      );
    }
    if (r.title.toLowerCase().includes('chicken') || r.tag === 'weeknight') {
      return (
        <div className={base}>
          <Drumstick className={common} />
        </div>
      );
    }
    if (r.title.toLowerCase().includes('citrus') || r.tag === 'salad') {
      return (
        <div className={base}>
          <Citrus className={common} />
        </div>
      );
    }
    return (
      <div className={base}>
        <UtensilsCrossed className={common} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0a0b0c] text-zinc-200 antialiased'>
      <div className='pointer-events-none fixed inset-0 [background:radial-gradient(1200px_600px_at_80%_-20%,rgba(100,100,100,.08),transparent),radial-gradient(800px_400px_at_10%_20%,rgba(120,120,120,.06),transparent)]' />
      <div className='pointer-events-none fixed inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.09)_0px,rgba(255,255,255,.09)_1px,transparent_1px,transparent_2px)]' />

      <main>
        {/* Hero */}
        <section className='relative'>
          <div className='mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_.8fr] md:py-20'>
            <div>
              <h1 className='text-4xl font-medium tracking-tight text-white md:text-5xl'>
                Recipes. Precise. Quiet.
              </h1>
              <p className='mt-4 max-w-xl text-sm leading-relaxed text-zinc-400'>
                Save recipes. Find them fast. Search, tags, and clean indexing.
              </p>

              <div className='mt-6 flex flex-wrap items-center gap-3'>
                <div className='hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm md:flex'>
                  <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
                    <Search className='size-4 text-zinc-400' />
                  </div>
                  <Input
                    placeholder='Search recipes'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className='h-9 w-[320px] border-0 bg-transparent focus-visible:ring-0'
                  />
                </div>

                <Link href='/recipes'>
                  <Button className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'>
                    Browse all
                  </Button>
                </Link>
                <Link href='/recipes/new'>
                  <Button
                    variant='outline'
                    className='h-9 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800'>
                    New recipe
                  </Button>
                </Link>
              </div>

              <div className='mt-8 flex items-center gap-2 text-xs text-zinc-500'>
                <div className='size-1.5 rounded-full bg-emerald-400' />
                <span>Private by default. Public by choice.</span>
              </div>
            </div>

            <Card className='border-zinc-800 bg-zinc-950/70 backdrop-blur'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-zinc-200'>
                  <Tag className='size-4' /> Quick filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='all' className='w-full'>
                  <TabsList className='grid w-full grid-cols-4 bg-zinc-900 text-zinc-300'>
                    <TabsTrigger value='all'>All</TabsTrigger>
                    <TabsTrigger value='fast'>Fast</TabsTrigger>
                    <TabsTrigger value='weeknight'>Weeknight</TabsTrigger>
                    <TabsTrigger value='sweet'>Sweet</TabsTrigger>
                  </TabsList>

                  <TabsContent value='all' className='mt-4'>
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((t) => (
                        <Link key={t} href={`/tags/${encodeURIComponent(t)}`}>
                          <Badge
                            variant='secondary'
                            className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
                            {t}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value='fast' className='mt-4 text-sm text-zinc-400'>
                    Under thirty minutes.
                  </TabsContent>
                  <TabsContent value='weeknight' className='mt-4 text-sm text-zinc-400'>
                    Simple prep. Fewer dishes.
                  </TabsContent>
                  <TabsContent value='sweet' className='mt-4 text-sm text-zinc-400'>
                    Dessert and treats.
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className='mx-auto my-8 max-w-6xl border-zinc-800' />

        {/* Featured grid */}
        <section id='recipes' className='mx-auto max-w-6xl px-4 py-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-medium text-zinc-100'>Featured</h2>
            <Link href='/recipes' className='text-xs text-zinc-400 hover:text-zinc-200'>
              View all
            </Link>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {featured.map((r) => (
              <Card
                key={r.id}
                className='group relative overflow-hidden border-zinc-800 bg-zinc-950'>
                <CardContent className='p-4'>
                  <div className='mb-8 flex w-full items-center justify-center'>
                    <IconBadge r={r} />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-zinc-100'>{r.title}</h3>
                      <div className='mt-1 flex items-center gap-2 text-xs text-zinc-400'>
                        <Link href={`/tags/${encodeURIComponent(r.tag)}`}>
                          <Badge variant='outline' className='border-zinc-700 text-zinc-300'>
                            {r.tag}
                          </Badge>
                        </Link>
                        <span>{r.time}</span>
                      </div>
                    </div>
                    <Link href={`/recipes/${r.slug}`} className='inline-flex'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='size-8 text-zinc-300 hover:bg-zinc-800'>
                        <ExternalLink className='size-4' />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                <div className='pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-white/10 transition-opacity group-hover:opacity-100' />
              </Card>
            ))}
          </div>
        </section>

        {/* Tags cloud */}
        <section id='tags' className='mx-auto max-w-6xl px-4 py-10'>
          <div className='mb-4 flex items-center gap-2'>
            <Tag className='size-4 text-zinc-400' />
            <h2 className='text-lg font-medium text-zinc-100'>Tags</h2>
          </div>
          <div className='flex flex-wrap gap-2'>
            {tags.map((t) => (
              <Link key={t} href={`/tags/${encodeURIComponent(t)}`}>
                <Badge
                  variant='secondary'
                  className='border border-zinc-700 bg-zinc-900/70 text-zinc-300'>
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* About */}
        <section id='about' className='mx-auto max-w-6xl px-4 py-10'>
          <div className='grid gap-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-3'>
            <div className='md:col-span-2'>
              <h3 className='text-lg font-medium text-zinc-100'>About</h3>
              <p className='mt-2 text-sm leading-relaxed text-zinc-400'>
                Simple recipes. Fast lookup. Clean structure.
              </p>
            </div>
            <div className='flex items-end justify-start md:justify-end'>
              <Link
                href='https://github.com/blakee-marcus/recipebook'
                target='_blank'
                rel='noopener'>
                <Button className='border border-zinc-300 bg-zinc-100 text-zinc-900 hover:bg-white focus-visible:ring-2 focus-visible:ring-zinc-500'>
                  <Github className='mr-2 size-4' /> Source
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
