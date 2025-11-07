'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'relative text-sm transition-colors',
        active ? 'text-white' : 'text-zinc-300 hover:text-white',
      ].join(' ')}>
      <span className='px-0.5'>{label}</span>
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute -bottom-1 left-0 h-px w-full',
          active ? 'bg-zinc-400' : 'bg-transparent',
        ].join(' ')}
      />
    </Link>
  );
}

export default function SiteNav() {
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses desktop search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className='sticky top-0 z-50 border-b border-zinc-800/70 bg-[#0a0b0c]/80 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        {/* Brand */}
        <Link href='/' className='group inline-flex items-center gap-2'>
          <div className='grid size-8 place-items-center rounded-md border border-zinc-700/70 bg-zinc-900/60 shadow'>
            <ChefHat className='size-4 text-zinc-300' />
          </div>
          <span className='text-sm tracking-widest text-zinc-300 group-hover:text-white'>
            RECIPE.SYSTEM
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-6 md:flex'>
          <NavLink href='/recipes' label='Recipes' />
          <NavLink href='/tags' label='Tags' />
          <NavLink href='/about' label='About' />
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          {/* Desktop search */}
          <div
            className='hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm md:flex'
            role='search'>
            <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
              <Search className='size-4 text-zinc-400' />
            </div>
            <Input
              ref={searchRef}
              aria-label='Search recipes'
              placeholder='Search recipes  /'
              className='h-9 w-[240px] border-0 bg-transparent text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-0'
            />
          </div>

          {/* Primary action (author-only in your flow; keep if you use it) */}
          <Link href='/recipes/new'>
            <Button
              variant='outline'
              className='h-9 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800'>
              <Plus className='mr-2 size-4' /> New
            </Button>
          </Link>

          {/* Mobile search sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                className='size-9 p-0 text-zinc-200 hover:bg-zinc-800 md:hidden'
                aria-label='Open search'>
                <Search className='size-4' />
              </Button>
            </SheetTrigger>
            <SheetContent side='top' className='border-zinc-800 bg-zinc-950'>
              <div className='mx-auto mt-2 flex max-w-3xl items-center gap-2'>
                <Search className='size-4 text-zinc-400' />
                <Input
                  aria-label='Search recipes'
                  placeholder='Search recipes'
                  className='border-zinc-700 bg-zinc-900'
                />
              </div>
              <div className='mx-auto mt-4 flex max-w-3xl items-center gap-4 text-sm'>
                <NavLink href='/recipes' label='Recipes' />
                <span className='text-zinc-700'>|</span>
                <NavLink href='/tags' label='Tags' />
                <span className='text-zinc-700'>|</span>
                <NavLink href='/about' label='About' />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
