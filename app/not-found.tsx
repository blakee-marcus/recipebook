// app/not-found.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChefHat, Search, Home, FolderOpen, Tag } from 'lucide-react';
import NotFoundSearch from './not-found.search';

export default function NotFound() {
  return (
    <main className='mx-auto max-w-6xl px-4 py-16'>
      {/* Header card */}
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ChefHat className='size-4 text-zinc-400' />
              <CardTitle className='text-2xl font-medium text-zinc-100'>Page not found</CardTitle>
            </div>
            <span className='text-xs text-zinc-500'>404</span>
          </div>
        </CardHeader>
        <CardContent className='text-sm text-zinc-300'>
          <p>The address is empty. Use search or choose a path.</p>
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      <section className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]'>
        {/* Left: search and suggestions */}
        <Card className='border-zinc-800 bg-zinc-950'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2'>
              <Search className='size-4 text-zinc-400' />
              <CardTitle className='text-lg font-semibold text-zinc-200'>Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Fast search input (client) */}
            <NotFoundSearch />

            <Separator className='border-zinc-800' />

            {/* Helpful links (Fitts + Proximity) */}
            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
              <Link href='/'>
                <Button className='h-9 w-full bg-zinc-100 text-zinc-900 hover:bg-white'>
                  <Home className='mr-2 size-4' />
                  Home
                </Button>
              </Link>
              <Link href='/recipes'>
                <Button className='h-9 w-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                  <FolderOpen className='mr-2 size-4 text-zinc-400' />
                  Recipes
                </Button>
              </Link>
              <Link href='/tags'>
                <Button className='h-9 w-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                  <Tag className='mr-2 size-4 text-zinc-400' />
                  Tags
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Right: tips card (concise, user-only content) */}
        <aside className='top-24 hidden md:block'>
          <Card className='sticky border-zinc-800 bg-zinc-950 p-0'>
            <CardHeader className='pb-2 pt-6'>
              <CardTitle className='text-sm font-semibold text-zinc-200'>Tips</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 p-4 pt-0 text-xs text-zinc-400'>
              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 font-medium text-zinc-300'>Search format</div>
                <p>Try a dish name or tag. Example: “noodles”, “weeknight”.</p>
              </div>
              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 font-medium text-zinc-300'>Browse</div>
                <p>Open Tags to scan categories and jump to a recipe list.</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
