'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Plus, Search, Edit3, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

type TagRow = { name: string; count: number };

async function apiList(): Promise<TagRow[]> {
  const res = await fetch('/api/tags', { cache: 'no-store' });
  const json = await res.json();
  return json?.data ?? [];
}

async function apiCreate(tag: TagRow): Promise<TagRow> {
  const res = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tag),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to create');
  return json.data;
}

async function apiDelete(name: string): Promise<void> {
  const res = await fetch(`/api/tags?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json().catch(() => ({} as any));
    throw new Error(json?.error || 'Failed to delete');
  }
}

export default function TagManager({ initialTags }: { initialTags: TagRow[] }) {
  const [tags, setTags] = useState<TagRow[]>(initialTags);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'alpha' | 'count'>('alpha');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TagRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiList().then((rows) => {
      if (!mounted) return;
      if (rows?.length) setTags(rows);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? tags.filter((t) => t.name.includes(q)) : tags.slice();
    if (sort === 'alpha') base.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'count') base.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return base;
  }, [tags, query, sort]);

  const popular = useMemo(
    () => [...tags].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 8),
    [tags]
  );

  function onCreate() {
    setError(null);
    setDraft({ name: '', count: 0 });
    setOpen(true);
  }

  function onEdit(t: TagRow) {
    setError(null);
    setDraft({ ...t });
    setOpen(true);
  }

  function onDelete(name: string) {
    setError(null);
    startTransition(() => {
      const prev = tags;
      setTags((p) => p.filter((t) => t.name !== name)); // optimistic
      apiDelete(name).catch((e) => {
        setError(e.message);
        setTags(prev); // rollback
      });
    });
  }

  async function saveDraft() {
    if (!draft) return;
    const name = draft.name.trim().toLowerCase();
    if (!name) return;

    setError(null);
    startTransition(() => {
      setTags((prev) => {
        const next = [...prev];
        const i = next.findIndex((t) => t.name === name);
        if (i >= 0) next[i] = { ...next[i], count: draft.count };
        else next.push({ name, count: draft.count });
        return next;
      });
    });

    try {
      const saved = await apiCreate({ name, count: draft.count });
      setTags((prev) => {
        const i = prev.findIndex((t) => t.name === saved.name);
        if (i >= 0) {
          const copy = prev.slice();
          copy[i] = saved;
          return copy;
        }
        return [...prev, saved];
      });
      setOpen(false);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    }
  }

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
      <Card className="border-zinc-800 bg-zinc-950">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-zinc-200">All tags</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
                onClick={() => setSort((s) => (s === 'alpha' ? 'count' : 'alpha'))}
                aria-label="Toggle sort"
              >
                {sort === 'alpha' ? 'Sort: A to Z' : 'Sort: Count'}
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="h-9 bg-zinc-100 text-zinc-900 hover:bg-white" onClick={onCreate}>
                    <Plus className="mr-2 size-4" /> Add tag
                  </Button>
                </DialogTrigger>

                <DialogContent className="border-zinc-800 bg-zinc-950">
                  <DialogHeader>
                    <DialogTitle className="text-zinc-100">
                      {draft && draft.name ? 'Edit tag' : 'Create tag'}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-2 space-y-3">
                    {error ? (
                      <div className="rounded border border-red-900/50 bg-red-950/30 p-2 text-xs text-red-300">
                        {error}
                      </div>
                    ) : null}

                    <div className="grid gap-2">
                      <label className="text-xs text-zinc-400">Name</label>
                      <Input
                        autoFocus
                        placeholder="e.g. weeknight"
                        className="border-zinc-700 bg-zinc-900"
                        value={draft?.name ?? ''}
                        onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs text-zinc-400">Count</label>
                      <Input
                        type="number"
                        min={0}
                        className="border-zinc-700 bg-zinc-900"
                        value={draft?.count ?? 0}
                        onChange={(e) =>
                          setDraft((d) => (d ? { ...d, count: Math.max(0, Number(e.target.value || 0)) } : d))
                        }
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Button onClick={saveDraft} className="h-9 bg-zinc-100 text-zinc-900 hover:bg-white" disabled={isPending}>
                        <Check className="mr-2 size-4" /> Save
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                      >
                        <X className="mr-2 size-4" /> Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 pr-2 shadow-sm">
            <div className="grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900">
              <Search className="size-4 text-zinc-400" />
            </div>
            <Input
              placeholder="Search tags"
              className="h-9 w-full border-0 bg-transparent text-sm placeholder:text-zinc-500 focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <div key={t.name} className="group rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/tags/${encodeURIComponent(t.name)}`} className="text-sm font-medium text-zinc-100 hover:underline">
                      {t.name}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-500">{t.count} recipes</div>
                  </div>
                  <Badge variant="secondary" className="border border-zinc-700 bg-zinc-900 text-zinc-300">
                    tag
                  </Badge>
                </div>

                <Separator className="my-3 border-zinc-800" />

                <div className="flex items-center gap-2">
                  <Button onClick={() => onEdit(t)} className="h-9 flex-1 bg-zinc-100 text-zinc-900 hover:bg-white">
                    <Edit3 className="mr-2 size-4" /> Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(t.name)}
                    variant="outline"
                    className="h-9 flex-1 border-zinc-600 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  >
                    <Trash2 className="mr-2 size-4" /> Delete
                  </Button>
                </div>
              </div>
            ))}

            {!filtered.length && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center text-sm text-zinc-400">
                No tags match your query
              </div>
            )}
          </div>

          {isPending && (
            <div className="mt-4 h-8 w-full overflow-hidden rounded bg-zinc-800">
              <div className="h-full w-1/2 animate-pulse bg-zinc-300" />
            </div>
          )}
        </CardContent>
      </Card>

      <aside className="top-24 hidden md:block">
        <Card className="sticky border-zinc-800 bg-zinc-950 p-0">
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-sm font-semibold text-zinc-200">Popular</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 p-4 pt-0">
            {popular.length ? (
              popular.map((t) => (
                <Link
                  key={t.name}
                  href={`/tags/${encodeURIComponent(t.name)}`}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                >
                  {t.name} • {t.count}
                </Link>
              ))
            ) : (
              <span className="text-xs text-zinc-500">No tags yet</span>
            )}
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}
