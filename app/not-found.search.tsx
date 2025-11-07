'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RECIPES } from '@/data/recipes';
import { Separator } from '@/components/ui/separator';

export default function NotFoundSearch() {
  const [q, setQ] = useState('');
  const [saving, setSaving] = useState(false); // Zeigarnik feedback
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus with '/'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return RECIPES.filter((r) => {
      const title = r.title.toLowerCase();
      const tag = String(r.tag || '').toLowerCase();
      return title.includes(s) || tag.includes(s);
    })
      .slice(0, 9)
      .map((r) => ({ slug: r.slug, title: r.title, tag: r.tag, time: r.time || '' }));
  }, [q]);

  function goFirst() {
    if (!results.length) return;
    setSaving(true);
    // tiny timeout for Doherty threshold feel
    setTimeout(() => {
      router.push(`/recipes/${results[0].slug}`);
    }, 120);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm">
        <div className="grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900">
          <Search className="size-4 text-zinc-400" />
        </div>
        <Input
          ref={ref}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes  /"
          aria-label="Search recipes"
          className="h-9 w-full border-0 bg-transparent text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') goFirst();
          }}
        />
      </div>

      {/* Progress shimmer when navigating */}
      {saving ? (
        <div className="h-1 w-full overflow-hidden rounded bg-zinc-800">
          <div className="h-full w-1/2 animate-pulse bg-zinc-300" />
        </div>
      ) : null}

      {/* Compact results list */}
      {q && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950">
          {results.length ? (
            <ul className="divide-y divide-zinc-800">
              {results.map((r) => (
                <li key={r.slug} className="p-3 hover:bg-zinc-900/60">
                  <Link href={`/recipes/${r.slug}`} className="block">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-100">{r.title}</span>
                      <span className="text-xs text-zinc-500">{r.time}</span>
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                        {r.tag}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="p-3 text-sm text-zinc-400">No matches</div>
              <Separator className="border-zinc-800" />
              <div className="p-3 text-xs text-zinc-500">
                Try a shorter word or check spelling.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
