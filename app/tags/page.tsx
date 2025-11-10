import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TagManager from './tag-manager';
import { RECIPES } from '@/data/recipes';

export const metadata = {
  title: 'Tags | RECIPE.SYSTEM',
  description: 'Browse recipe tags and find related dishes fast.',
};

function getTagsFromRecipes() {
  const counts = new Map<string, number>();
  for (const r of RECIPES) {
    const tag = String(r.tag || '')
      .trim()
      .toLowerCase();
    if (!tag) continue;
    counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function TagsPage() {
  const initial = getTagsFromRecipes();

  return (
    <main className='mx-auto max-w-6xl px-4 py-12'>
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-medium text-zinc-100'>Tags</CardTitle>
            <span className='text-xs text-zinc-500'>{initial.length} tags</span>
          </div>
        </CardHeader>
        <CardContent className='text-sm text-zinc-300'>
          <p>Browse by topic. Click a tag to view its recipes.</p>
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      <Suspense
        fallback={
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardContent className='p-6'>
              <div className='h-8 w-48 animate-pulse rounded bg-zinc-800' />
              <div className='mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-24 animate-pulse rounded border border-zinc-800 bg-zinc-900'
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        }>
        <TagManager initialTags={initial} />
      </Suspense>
    </main>
  );
}
