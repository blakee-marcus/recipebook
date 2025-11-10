'use client';

import { ShoppingBag } from 'lucide-react';
import { AffLink } from '@/components/AffLink';
import type { AffItem } from '@/lib/affiliates';
import { useEffect, useState } from 'react';

export function StickyAffBar({ items }: { items: AffItem[] }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!items?.length || !show) return null;

  return (
    <div className='fixed inset-x-0 bottom-3 z-40 mx-auto w-[min(900px,92%)] rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70'>
      <div className='flex items-center gap-2 px-3 py-2'>
        <div className='flex items-center gap-2 text-xs text-zinc-300'>
          <ShoppingBag className='size-4 text-zinc-400' />
          <span>Shop ingredients</span>
        </div>
        <div className='ml-auto flex flex-wrap gap-2'>
          {items.slice(0, 4).map((it) => (
            <AffLink key={it.key} item={it} variant='button' position='sticky_bar' />
          ))}
        </div>
      </div>
    </div>
  );
}
