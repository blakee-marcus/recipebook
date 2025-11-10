import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Search, Shield, Github, Tag } from 'lucide-react';

export const metadata = {
  title: 'About | RECIPE.SYSTEM',
  description: 'Find recipes fast. No fluff.',
};

export default function AboutPage() {
  return (
    <main className='mx-auto max-w-6xl px-4 py-12'>
      {/* Header */}
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-medium text-zinc-100'>About</CardTitle>
            <Badge variant='secondary' className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
              RECIPE.SYSTEM
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='text-sm text-zinc-300'>
          <p>Recipes, zero fluff. Find it fast. Cook it right.</p>
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      <section className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]'>
        {/* Left column */}
        <div className='space-y-6'>
          {/* What this is */}
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <ChefHat className='size-4 text-zinc-400' aria-hidden />
                <CardTitle className='text-lg font-semibold text-zinc-200'>What it is</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm text-zinc-300'>
              <p>
                A fast recipe index. Each recipe opens to ingredients, then steps, then quick notes.
                No popups. No stories. Just what you need to cook.
              </p>
            </CardContent>
          </Card>

          {/* How to use */}
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Search className='size-4 text-zinc-400' aria-hidden />
                <CardTitle className='text-lg font-semibold text-zinc-200'>How to use it</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm text-zinc-300'>
              <ol className='list-decimal space-y-2 pl-5'>
                <li>Search by name or tag.</li>
                <li>
                  Or browse{' '}
                  <Link href='/tags' className='underline underline-offset-2 hover:text-zinc-100'>
                    tags
                  </Link>{' '}
                  to see groups of recipes.
                </li>
                <li>Cook it as written, then tweak it next time.</li>
              </ol>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' aria-hidden />
                <CardTitle className='text-lg font-semibold text-zinc-200'>Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm text-zinc-300'>
              <p>
                No tracking. No analytics. No ads. Read the{' '}
                <Link href='/privacy' className='underline underline-offset-2 hover:text-zinc-100'>
                  privacy policy
                </Link>{' '}
                for details.
              </p>
            </CardContent>
          </Card>

          {/* Author */}
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg font-semibold text-zinc-200'>Author</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-zinc-300'>
              <p>
                Hi, I’m{' '}
                <Link
                  href='https://blakemarcus.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline underline-offset-2 hover:text-zinc-100'>
                  Blake Marcus
                </Link>
                . I built this to keep the good stuff in one place and easy to find.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right column: quick links */}
        <aside className='sticky top-24 hidden md:block'>
          <Card className='border-zinc-800 bg-zinc-950 p-0'>
            <CardHeader className='pb-3 pt-6'>
              <CardTitle className='text-sm font-semibold text-zinc-200'>Quick links</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 p-4 pt-0'>
              <Button asChild className='h-9 w-full bg-zinc-100 text-zinc-900 hover:bg-white'>
                <Link href='/recipes'>Browse recipes</Link>
              </Button>

              <Button asChild className='h-9 w-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                <Link href='/tags'>
                  <span className='flex items-center'>
                    <Tag className='mr-2 size-4 text-zinc-400' aria-hidden />
                    View tags
                  </span>
                </Link>
              </Button>

              <Button asChild className='h-9 w-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                <a
                  href='https://github.com/blakee-marcus/recipebook'
                  target='_blank'
                  rel='noopener noreferrer'>
                  <span className='flex items-center'>
                    <Github className='mr-2 size-4 text-zinc-400' aria-hidden />
                    Source
                  </span>
                </a>
              </Button>

              <Button asChild className='h-9 w-full bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                <Link href='/contact'>Contact</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
