import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RECIPES } from '@/data/recipes';
import TagResults from './tag-results';

type Recipe = {
  slug: string;
  title: string;
  tag: string;
  time?: string;
};

function getAllTags() {
  const set = new Set<string>();
  for (const r of RECIPES) {
    const t = String(r.tag || '')
      .trim()
      .toLowerCase();
    if (t) set.add(t);
  }
  return Array.from(set).sort();
}

function getRecipesByTag(tag: string): Recipe[] {
  const t = tag.trim().toLowerCase();
  return RECIPES.filter(
    (r) =>
      String(r.tag || '')
        .trim()
        .toLowerCase() === t,
  )
    .map((r) => ({ slug: r.slug, title: r.title, tag: r.tag, time: r.time || '' }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const name = decodeURIComponent(tag).toLowerCase();
  const items = getRecipesByTag(name);
  const count = items.length;

  const title = `${name} recipes`;
  const desc = count
    ? `Browse ${count} ${name} recipes. Search, sort, and open a recipe.`
    : `No ${name} recipes found.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `/tags/${encodeURIComponent(name)}`,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'RECIPE.SYSTEM' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: ['/og.png'],
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const name = decodeURIComponent(tag).toLowerCase();
  const items = getRecipesByTag(name);
  if (!items.length) return notFound();

  return (
    <main className='mx-auto max-w-6xl px-4 py-12'>
      {/* Header */}
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-medium text-zinc-100'>{name}</CardTitle>
            <Badge variant='secondary' className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
              {items.length} {items.length === 1 ? 'recipe' : 'recipes'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='text-sm text-zinc-300'>
          <nav className='text-xs text-zinc-500'>
            <Link href='/' className='hover:text-zinc-300'>
              Home
            </Link>
            <span className='px-1 text-zinc-700'>/</span>
            <Link href='/tags' className='hover:text-zinc-300'>
              Tags
            </Link>
            <span className='px-1 text-zinc-700'>/</span>
            <span className='text-zinc-300'>{name}</span>
          </nav>
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      {/* Results */}
      <Suspense
        fallback={
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardContent className='p-6'>
              <div className='h-8 w-48 animate-pulse rounded bg-zinc-800' />
              <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-28 animate-pulse rounded border border-zinc-800 bg-zinc-900'
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        }>
        <TagResults initial={items} tagName={name} />
      </Suspense>
    </main>
  );
}
