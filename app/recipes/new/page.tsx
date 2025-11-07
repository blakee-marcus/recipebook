'use client';

import { useEffect, useId, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Hash,
  Inbox,
  List,
  Loader2,
  Plus,
  Save,
  Tag as TagIcon,
  Trash2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RECIPES } from '@/data/recipes';

type Draft = {
  title: string;
  slug: string;
  tag: string;
  time: string;
  intro: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
};

const EMPTY_DRAFT: Draft = {
  title: '',
  slug: '',
  tag: '',
  time: '',
  intro: '',
  ingredients: [''],
  steps: [''],
  notes: '',
};

const STORAGE_KEY = 'recipe.new.draft.v1';

const INPUT = 'border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 caret-zinc-200';
const INPUT_TRANSPARENT =
  'border-0 bg-transparent text-zinc-100 placeholder:text-zinc-500 caret-zinc-200 focus-visible:ring-0';
const TEXTAREA =
  'border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 caret-zinc-200';

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function Stepper({
  step,
  setStep,
  total = 3,
}: {
  step: number;
  setStep: (n: number) => void;
  total?: number;
}) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
      <div className='mb-2 flex items-center justify-between text-xs text-zinc-400'>
        <span>
          Step {step + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className='h-1 w-full overflow-hidden rounded bg-zinc-800'>
        <div className='h-full transition-[width]' style={{ width: `${pct}%` }} />
      </div>
      <div className='mt-3 grid grid-cols-3 gap-2'>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={[
              'h-8 rounded border text-xs',
              i === step
                ? 'border-zinc-600 bg-zinc-900 text-zinc-200'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900',
            ].join(' ')}
            aria-current={i === step ? 'step' : undefined}>
            {i === 0 ? 'Basics' : i === 1 ? 'Ingredients' : 'Steps'}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListEditor({
  label,
  items,
  setItems,
  placeholder,
  ariaId,
}: {
  label: string;
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
  ariaId: string;
}) {
  function updateItem(idx: number, val: string) {
    const next = items.slice();
    next[idx] = val;
    setItems(next);
  }
  function addItem() {
    setItems([...items, '']);
  }
  function removeItem(idx: number) {
    const next = items.slice();
    next.splice(idx, 1);
    if (next.length === 0) next.push('');
    setItems(next);
  }
  return (
    <div className='grid gap-2'>
      <label className='text-sm text-zinc-300' htmlFor={ariaId}>
        {label}
      </label>
      <div id={ariaId} className='space-y-2'>
        {items.map((v, i) => (
          <div key={i} className='flex gap-2'>
            <Input
              value={v}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className='border-zinc-700 bg-zinc-900'
            />
            <Button
              type='button'
              variant='outline'
              className='border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
              onClick={() => removeItem(i)}
              aria-label={`Remove ${label} ${i + 1}`}>
              <Trash2 className='size-4' />
            </Button>
          </div>
        ))}
      </div>
      <div className='mt-2'>
        <Button
          type='button'
          onClick={addItem}
          className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'>
          <Plus className='mr-2 size-4' /> Add {label.toLowerCase().slice(0, -1)}
        </Button>
      </div>
    </div>
  );
}

export default function NewRecipePage() {
  const router = useRouter();
  const formId = useId();

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  // new: track touch and submit attempt
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // helpers
  const markTouched = (key: string) => setTouched((t) => ({ ...t, [key]: true }));
  const showError = (key: string) => Boolean(errors[key] && (touched[key] || submitAttempted));

  // hydrate from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDraft({ ...EMPTY_DRAFT, ...parsed });
      } catch {
        // ignore
      }
    }
  }, []);

  // autosave
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setStatus('saved');
      const tid = setTimeout(() => setStatus('idle'), 1000);
      return () => clearTimeout(tid);
    }, 350);
    return () => clearTimeout(id);
  }, [draft]);

  // tag suggestions
  const tagSuggestions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of RECIPES) {
      const t = String(r.tag || '')
        .trim()
        .toLowerCase();
      if (!t) continue;
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 10);
  }, []);

  // validators
  const errors: Record<string, string> = (() => {
    const e: Record<string, string> = {};
    if (!draft.title.trim()) e.title = 'Title required';
    if (!draft.slug.trim()) e.slug = 'Slug required';
    if (draft.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug))
      e.slug = 'Use lowercase letters, numbers, hyphens';
    if (!draft.tag.trim()) e.tag = 'Tag required';
    if (!draft.time.trim()) e.time = 'Time required';
    if (!draft.ingredients.filter(Boolean).length) e.ingredients = 'Add at least one ingredient';
    if (!draft.steps.filter(Boolean).length) e.steps = 'Add at least one step';
    return e;
  })();

  function onTitleChange(v: string) {
    setDraft((d) => {
      const nextSlug = d.slug ? d.slug : toSlug(v);
      return { ...d, title: v, slug: nextSlug };
    });
  }

  async function onPublish(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true); // reveal any remaining errors
    if (Object.keys(errors).length > 0) return;

    setStatus('saving');
    setProgress(20);
    try {
      // await fetch('/api/recipes', { method: 'POST', body: JSON.stringify(draft) });
      await new Promise((r) => setTimeout(r, 300));
      setProgress(60);
      await new Promise((r) => setTimeout(r, 300));
      setProgress(100);

      localStorage.removeItem(STORAGE_KEY);
      setStatus('saved');
      startTransition(() => {
        router.push(`/recipes/${draft.slug}`);
      });
    } catch {
      setStatus('error');
      setProgress(0);
    }
  }

  return (
    <main className='mx-auto max-w-6xl px-4 py-12'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link
            href='/recipes'
            className='inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100'>
            <ChevronLeft className='size-4' />
            Back
          </Link>
          <span className='text-xs text-zinc-500' id={`${formId}-status`}>
            {status === 'idle' && 'Autosave active'}
            {status === 'saving' && 'Saving'}
            {status === 'saved' && 'Saved'}
            {status === 'error' && 'Error'}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            type='button'
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
              setStatus('saved');
            }}
            variant='outline'
            className='h-9 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
            <Save className='mr-2 size-4' />
            Save draft
          </Button>
          <Button
            onClick={onPublish}
            disabled={Object.keys(errors).length > 0 || status === 'saving'}
            className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'>
            {status === 'saving' ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' /> Publishing
              </>
            ) : (
              <>
                <Check className='mr-2 size-4' /> Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {status === 'saving' && (
        <div className='mb-6 h-1 w-full overflow-hidden rounded bg-zinc-800'>
          <div className='h-full transition-[width]' style={{ width: `${progress}%` }} />
        </div>
      )}

      <section className='grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]'>
        <form onSubmit={onPublish} className='contents' aria-describedby={`${formId}-status`}>
          <Card className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg font-semibold text-zinc-200'>New recipe</CardTitle>
                <Badge
                  variant='secondary'
                  className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
                  Draft
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='grid gap-6'>
              <Stepper step={step} setStep={setStep} />

              {step === 0 && (
                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <label className='text-sm text-zinc-300' htmlFor={`${formId}-title`}>
                      Title
                    </label>
                    <Input
                      id={`${formId}-title`}
                      placeholder='e.g. Cold Sesame Noodles'
                      className={[INPUT, showError('title') ? 'ring-1 ring-red-500' : ''].join(' ')}
                      value={draft.title}
                      onChange={(e) => onTitleChange(e.target.value)}
                      onBlur={() => markTouched('title')}
                      required
                    />
                    {showError('title') ? (
                      <p className='text-xs text-red-400'>{errors.title}</p>
                    ) : null}
                  </div>

                  <div className='grid gap-2 md:grid-cols-2'>
                    <div className='grid gap-2'>
                      <label className='text-sm text-zinc-300' htmlFor={`${formId}-slug`}>
                        Slug
                      </label>
                      <div className='flex gap-2'>
                        <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
                          <Hash className='size-4 text-zinc-400' />
                        </div>
                        <Input
                          id={`${formId}-slug`}
                          placeholder='cold-sesame-noodles'
                          className={[INPUT, showError('slug') ? 'ring-1 ring-red-500' : ''].join(
                            ' ',
                          )}
                          value={draft.slug}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, slug: toSlug(e.target.value) }))
                          }
                          onBlur={() => markTouched('slug')}
                          required
                        />
                      </div>
                      {showError('slug') ? (
                        <p className='text-xs text-red-400'>{errors.slug}</p>
                      ) : null}
                    </div>

                    <div className='grid gap-2'>
                      <label className='text-sm text-zinc-300' htmlFor={`${formId}-time`}>
                        Time
                      </label>
                      <div className='flex gap-2'>
                        <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
                          <Clock className='size-4 text-zinc-400' />
                        </div>
                        <Input
                          id={`${formId}-time`}
                          placeholder='20 min'
                          className={[INPUT, showError('time') ? 'ring-1 ring-red-500' : ''].join(
                            ' ',
                          )}
                          value={draft.time}
                          onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
                          onBlur={() => markTouched('time')}
                          required
                        />
                      </div>
                      {showError('time') ? (
                        <p className='text-xs text-red-400'>{errors.time}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <label className='text-sm text-zinc-300' htmlFor={`${formId}-tag`}>
                      Tag
                    </label>
                    <div className='flex flex-wrap items-center gap-2'>
                      <div className='flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-2'>
                        <div className='grid size-9 place-items-center rounded-lg border border-zinc-800 bg-zinc-900'>
                          <TagIcon className='size-4 text-zinc-400' />
                        </div>
                        <Input
                          id={`${formId}-tag`}
                          placeholder='e.g. weeknight'
                          className={INPUT_TRANSPARENT}
                          value={draft.tag}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, tag: e.target.value.toLowerCase() }))
                          }
                          onBlur={() => markTouched('tag')}
                          required
                        />
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {tagSuggestions.map((t) => (
                          <button
                            key={t.name}
                            type='button'
                            onClick={() => setDraft((d) => ({ ...d, tag: t.name }))}
                            className='rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900'
                            aria-label={`Use tag ${t.name}`}>
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    {showError('tag') ? <p className='text-xs text-red-400'>{errors.tag}</p> : null}
                  </div>

                  <div className='grid gap-2'>
                    <label className='text-sm text-zinc-300' htmlFor={`${formId}-intro`}>
                      Intro
                    </label>
                    <Textarea
                      id={`${formId}-intro`}
                      placeholder='Short, quiet context. Keep it useful.'
                      className={TEXTAREA}
                      value={draft.intro}
                      onChange={(e) => setDraft((d) => ({ ...d, intro: e.target.value }))}
                      rows={5}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className='grid gap-4'>
                  <ListEditor
                    label='Ingredients'
                    items={draft.ingredients}
                    setItems={(v) => setDraft((d) => ({ ...d, ingredients: v }))}
                    placeholder='e.g. 200g wheat noodles'
                    ariaId={`${formId}-ingredients`}
                  />
                  {showError('ingredients') ? (
                    <p className='text-xs text-red-400'>{errors.ingredients}</p>
                  ) : null}
                </div>
              )}

              {step === 2 && (
                <div className='grid gap-4'>
                  <ListEditor
                    label='Steps'
                    items={draft.steps}
                    setItems={(v) => setDraft((d) => ({ ...d, steps: v }))}
                    placeholder='e.g. Boil noodles until tender'
                    ariaId={`${formId}-steps`}
                  />
                  {showError('steps') ? (
                    <p className='text-xs text-red-400'>{errors.steps}</p>
                  ) : null}

                  <div className='grid gap-2'>
                    <label className='text-sm text-zinc-300' htmlFor={`${formId}-notes`}>
                      Notes
                    </label>
                    <Textarea
                      id={`${formId}-notes`}
                      placeholder='Optional'
                      className={TEXTAREA}
                      value={draft.notes ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  variant='outline'
                  className='h-9 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
                  disabled={step === 0}>
                  <ChevronLeft className='mr-2 size-4' />
                  Back
                </Button>

                <Button
                  type='button'
                  onClick={() => setStep((s) => Math.min(2, s + 1))}
                  className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'
                  disabled={step === 2}>
                  Next
                  <ChevronRight className='ml-2 size-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <aside className='top-24 hidden md:block'>
          <Card className='sticky border-zinc-800 bg-zinc-950 p-0'>
            <CardHeader className='pb-2 pt-6'>
              <CardTitle className='text-sm font-semibold text-zinc-200'>Review</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 p-4 pt-0 text-xs'>
              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 flex items-center gap-2 text-zinc-300'>
                  <FileText className='size-3.5 text-zinc-500' />
                  <span className='font-medium'>Basics</span>
                </div>
                <ul className='space-y-1 text-zinc-400'>
                  <li>Title: {draft.title || '—'}</li>
                  <li>Slug: {draft.slug || '—'}</li>
                  <li>Tag: {draft.tag || '—'}</li>
                  <li>Time: {draft.time || '—'}</li>
                </ul>
              </div>

              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 flex items-center gap-2 text-zinc-300'>
                  <Inbox className='size-3.5 text-zinc-500' />
                  <span className='font-medium'>Counts</span>
                </div>
                <ul className='space-y-1 text-zinc-400'>
                  <li>Ingredients: {draft.ingredients.filter(Boolean).length}</li>
                  <li>Steps: {draft.steps.filter(Boolean).length}</li>
                </ul>
              </div>

              <Separator className='border-zinc-800' />

              <div className='grid gap-2'>
                <Button
                  onClick={onPublish}
                  disabled={Object.keys(errors).length > 0 || status === 'saving'}
                  className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'>
                  {status === 'saving' ? (
                    <>
                      <Loader2 className='mr-2 size-4 animate-spin' /> Publishing
                    </>
                  ) : (
                    <>
                      <Check className='mr-2 size-4' /> Publish
                    </>
                  )}
                </Button>
                <Button
                  type='button'
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
                    setStatus('saved');
                  }}
                  variant='outline'
                  className='h-9 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'>
                  <Save className='mr-2 size-4' /> Save draft
                </Button>
              </div>

              <Separator className='border-zinc-800' />

              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 flex items-center gap-2 text-zinc-300'>
                  <List className='size-3.5 text-zinc-500' />
                  <span className='font-medium'>Short checklist</span>
                </div>
                <ul className='list-disc space-y-1 pl-5 text-zinc-400'>
                  <li>Short title with a clear keyword</li>
                  <li>Intro under 60 words</li>
                  <li>Tag selected for internal linking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
