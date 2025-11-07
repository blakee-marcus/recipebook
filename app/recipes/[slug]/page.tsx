import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRecipe, RECIPES } from '@/data/recipes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Link2, BookOpenText, Info, ShoppingBag } from 'lucide-react';
import {
  matchAffiliatesFromIngredients,
  mergeRecipeHints,
  buildAffiliateUrl,
  DEFAULT_AFFILIATES,
  type AffItem,
} from '@/lib/affiliates';
import { getBaseUrl } from '@/lib/site';

// Revalidate to keep static pages fresh
export const revalidate = 60 * 60;

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  const base = getBaseUrl();
  const title = `${r.title} | Recipe`;
  const desc = `Ingredients and steps for ${r.title}. Ready in ${r.time}.`;
  const url = `${base}/recipes/${r.slug}`;
  const og = `${base}/og/recipe/${r.slug}.png`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      url,
      images: [{ url: og, width: 1200, height: 630, alt: r.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [og],
    },
  };
}

// JSON-LD helpers
function RecipeJsonLd({ recipe }: { recipe: NonNullable<ReturnType<typeof getRecipe>> }) {
  const totalTimeIso =
    typeof recipe.time === 'string' && /^\d+/.test(recipe.time)
      ? `PT${recipe.time.replace(/\D/g, '')}M`
      : undefined;
  
  const base = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: `Recipe for ${recipe.title}`,
    datePublished: recipe.date ?? undefined,
    author: recipe.author
      ? { '@type': 'Person', name: recipe.author }
      : { '@type': 'Person', name: 'Recipe.System' },
    image: recipe.image ? [recipe.image] : [`${base}/og/recipe/${recipe.slug}.png`],
    recipeCategory: recipe.tag || undefined,
    keywords: [recipe.tag, recipe.title].filter(Boolean).join(', '),
    totalTime: totalTimeIso,
    recipeYield: recipe.yield ?? undefined,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((s: string, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
  };
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd({ slug, title }: { slug: string; title: string }) {
  const base = getBaseUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Recipes', item: '${base}/recipes' },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: `${base}/recipes/${slug}`,
      },
    ],
  };
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function FaqJsonLd({ faqs }: { faqs?: { q: string; a: string }[] }) {
  if (!faqs?.length) return null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Affiliate anchor
function AffLink({ item, label }: { item: AffItem; label?: string }) {
  const href = buildAffiliateUrl(item);
  return (
    <a
      href={href}
      target='_blank'
      rel='nofollow sponsored noopener'
      data-affiliate={item.key}
      className='inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 underline-offset-2 hover:bg-zinc-900 hover:underline'>
      <Link2 className='size-3' />
      {label ?? item.label}
    </a>
  );
}

export default async function RecipeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return notFound();

  // 1) Auto-match from ingredients
  const baseMatches = matchAffiliatesFromIngredients(recipe.ingredients, DEFAULT_AFFILIATES);

  // 2) Merge optional hints from the recipe (tools or explicit keys)
  // In your recipe data you can add:
  // tools: ['wok-spatula', 'chef-knife']
  // affiliates: { keys: ['sesame-paste'], extra: [{ key:'my-item', label:'...', queries:['...'], kind:'pantry' }] }
  const mergedMatches = mergeRecipeHints(
    baseMatches,
    recipe.affiliates || { keys: recipe.tools },
    DEFAULT_AFFILIATES,
  );

  // 3) Split into pantry and gear to place contextually
  const pantry = mergedMatches.filter((m) => m.kind !== 'gear').slice(0, 6);
  const gear = mergedMatches.filter((m) => m.kind === 'gear').slice(0, 4);

  const related = RECIPES.filter((r) => r.tag === recipe.tag && r.slug !== recipe.slug).slice(0, 3);
  const faqs = recipe.faqs as { q: string; a: string }[] | undefined;

  return (
    <article className='mx-auto max-w-3xl px-4 py-10'>
      <RecipeJsonLd recipe={recipe} />
      <BreadcrumbJsonLd slug={recipe.slug} title={recipe.title} />
      <FaqJsonLd faqs={faqs} />

      {/* Top meta */}
      <div className='mb-6 flex items-center justify-between'>
        <Link
          href='/recipes'
          className='inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100'>
          <ArrowLeft className='size-4' /> Back to recipes
        </Link>
        <div className='flex items-center gap-2 text-xs text-zinc-400'>
          <Clock className='size-4' />
          <span>{recipe.time}</span>
        </div>
      </div>

      {/* Title + quick actions */}
      <h1 className='text-2xl font-medium text-zinc-100'>{recipe.title}</h1>
      <div className='mt-2 flex items-center gap-2'>
        <Badge variant='outline' className='border-zinc-700 text-zinc-300'>
          {recipe.tag}
        </Badge>
        <a
          href='#ingredients'
          className='text-xs text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline'>
          Jump to recipe
        </a>
      </div>

      {/* Minimal story block */}
      <Card className='mt-4 border-zinc-800 bg-zinc-950'>
        <CardContent className='p-4'>
          <div className='mb-2 flex items-center gap-2 text-zinc-300'>
            <BookOpenText className='size-4 text-zinc-400' />
            <span className='text-sm font-medium'>Notes</span>
          </div>
          <p className='text-sm leading-relaxed text-zinc-400'>
            Calm prep, clear steps, steady heat. Pantry staples do the work. Clean workflow keeps
            the pace even.
          </p>

          {/* High-intent CTA strip (top placement for CTR) */}
          {pantry.length > 0 && (
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <span className='text-xs text-zinc-500'>Pantry links:</span>
              {pantry.slice(0, 3).map((item) => (
                <AffLink key={item.key} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      {/* Body */}
      <div className='grid gap-6 md:grid-cols-[1fr_.8fr]'>
        {/* Ingredients with inline links next to matches */}
        <Card id='ingredients' className='border-zinc-800 bg-zinc-950'>
          <CardContent className='p-6'>
            <h2 className='text-sm font-medium text-zinc-200'>Ingredients</h2>
            <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300'>
              {recipe.ingredients.map((line, idx) => {
                const lower = line.toLowerCase();
                const matched = pantry.find((m) =>
                  [m.label, ...(m.queries || [])].some((q) => lower.includes(q.toLowerCase())),
                );
                return (
                  <li key={idx}>
                    {line}
                    {matched ? (
                      <span className='ml-2 inline-flex items-center gap-1 align-middle text-xs text-zinc-400'>
                        <AffLink item={matched} label={`Buy ${matched.label.toLowerCase()}`} />
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {/* Secondary pantry cluster for anyone who scrolls here */}
            {pantry.length > 3 && (
              <div className='mt-4 rounded-md border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-2 inline-flex items-center gap-2 text-xs text-zinc-400'>
                  <ShoppingBag className='size-3.5' />
                  <span>Pantry</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {pantry.slice(3, 8).map((item) => (
                    <AffLink key={item.key} item={item} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps + gear */}
        <Card className='border-zinc-800 bg-zinc-950'>
          <CardContent className='p-6'>
            <h2 className='text-sm font-medium text-zinc-200'>Steps</h2>
            <ol className='mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300'>
              {recipe.steps.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            {/* Gear cluster sits after steps for natural timing */}
            {gear.length > 0 && (
              <div className='mt-5 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs'>
                <div className='mb-2 inline-flex items-center gap-2 text-zinc-400'>
                  <Info className='size-3.5' />
                  <span>Gear that fits</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {gear.map((item) => (
                    <AffLink key={item.key} item={item} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Related recipes */}
      {related.length ? (
        <>
          <Separator className='my-8 border-zinc-800' />
          <section className='mt-2'>
            <h2 className='text-sm font-medium text-zinc-200'>More like this</h2>
            <ul className='mt-3 grid gap-2 sm:grid-cols-2'>
              {related.map((rr) => (
                <li key={rr.slug}>
                  <Link
                    href={`/recipes/${rr.slug}`}
                    className='inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white'>
                    <span className='rounded border border-zinc-800 px-2 py-1 text-xs text-zinc-400'>
                      {rr.tag}
                    </span>
                    {rr.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}

      {/* Back to top */}
      <div className='mt-8'>
        <Button asChild className='h-9 bg-zinc-100 text-zinc-900 hover:bg-white'>
          <a href='#ingredients'>Back to ingredients</a>
        </Button>
      </div>
    </article>
  );
}
