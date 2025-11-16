import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipe, RECIPES } from '@/data/recipes';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, BookOpenText, Info } from 'lucide-react';
import {
  matchAffiliatesFromIngredients,
  mergeRecipeHints,
  DEFAULT_AFFILIATES,
  type AffItem,
} from '@/lib/affiliates';
import { getBaseUrl } from '@/lib/site';
import { AffLink } from '@/components/AffLink';
import { StickyAffBar } from '@/components/StickyAffBar';
import TrackedAmazonLink from '@/components/TrackedAmazonLink';

export const revalidate = 3600;

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

// Safe helper for optional fields not on the Recipe type
function getSeoDesc(obj: unknown): string | undefined {
  const s = (obj as any)?.seoDescription;
  return typeof s === 'string' && s.trim() ? s : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};

  const base = getBaseUrl();
  const title = `${r.title} Recipe (${r.time})`;
  const desc =
    getSeoDesc(r) ??
    `Make ${r.title} at home. Ingredients, step-by-step instructions, timing (${r.time}), and tools.`;
  const url = `${base}/recipes/${r.slug}`;
  const og = `${base}/og/recipe/${r.slug}.png`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: 'max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    openGraph: {
      type: 'article',
      title,
      description: desc,
      url,
      images: [{ url: og, width: 1200, height: 630, alt: `${r.title} finished dish` }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [og] },
    other: {
      'og:site_name': 'Recipe.System',
      'article:section': r.tag || 'Recipes',
      'article:published_time': r.date || '',
    },
  };
}

function RecipeJsonLd({ recipe }: { recipe: NonNullable<ReturnType<typeof getRecipe>> }) {
  const toISO = (min?: string | number) =>
    typeof min === 'string' && /^\d+/.test(min)
      ? `PT${min.replace(/\D/g, '')}M`
      : typeof min === 'number'
      ? `PT${min}M`
      : undefined;

  const base = getBaseUrl();

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: getSeoDesc(recipe) || `Recipe for ${recipe.title}`,
    datePublished: recipe.date ?? undefined,
    image: recipe.image ? [recipe.image] : [`${base}/og/recipe/${recipe.slug}.png`],
    author: recipe.author
      ? { '@type': 'Person', name: recipe.author }
      : { '@type': 'Organization', name: 'Recipe.System' },
    recipeCategory: recipe.tag || undefined,
    recipeCuisine: (recipe as any).cuisine || undefined,
    keywords: [recipe.tag, recipe.title, ...(((recipe as any).keywords as string[]) || [])]
      .filter(Boolean)
      .join(', '),
    totalTime: toISO(recipe.time),
    prepTime: toISO((recipe as any).prepTime),
    cookTime: toISO((recipe as any).cookTime),
    recipeYield: recipe.yield ?? undefined,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((s: string, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
    nutrition: (recipe as any).nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: (recipe as any).nutrition.calories
            ? `${(recipe as any).nutrition.calories} calories`
            : undefined,
          fatContent: (recipe as any).nutrition.fatContent,
          carbohydrateContent: (recipe as any).nutrition.carbohydrateContent,
          proteinContent: (recipe as any).nutrition.proteinContent,
        }
      : undefined,
    aggregateRating: (recipe as any).rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: (recipe as any).rating.value,
          ratingCount: (recipe as any).rating.count,
        }
      : undefined,
    video: (recipe as any).video
      ? {
          '@type': 'VideoObject',
          name: `${recipe.title} recipe`,
          description: `How to make ${recipe.title}`,
          thumbnailUrl: (recipe as any).video.thumbnail || `${base}/og/recipe/${recipe.slug}.png`,
          uploadDate: recipe.date || undefined,
          contentUrl: (recipe as any).video.url,
          embedUrl: (recipe as any).video.embedUrl || undefined,
          duration: toISO((recipe as any).video.duration),
        }
      : undefined,
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
      { '@type': 'ListItem', position: 1, name: 'Recipes', item: `${base}/recipes` },
      { '@type': 'ListItem', position: 2, name: title, item: `${base}/recipes/${slug}` },
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

export default async function RecipeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return notFound();

  const baseMatches = matchAffiliatesFromIngredients(recipe.ingredients, DEFAULT_AFFILIATES);
  const mergedMatches = mergeRecipeHints(
    baseMatches,
    recipe.affiliates || { keys: recipe.tools },
    DEFAULT_AFFILIATES,
  );

  const pantry = mergedMatches.filter((m) => m.kind !== 'gear').slice(0, 6);
  const gear = mergedMatches.filter((m) => m.kind === 'gear').slice(0, 4);
  const related = RECIPES.filter((r) => r.tag === recipe.tag && r.slug !== recipe.slug).slice(0, 3);
  const faqs = recipe.faqs as { q: string; a: string }[] | undefined;

  return (
    <article className='mx-auto max-w-3xl px-4 py-10'>
      <RecipeJsonLd recipe={recipe} />
      <BreadcrumbJsonLd slug={recipe.slug} title={recipe.title} />
      <FaqJsonLd faqs={faqs} />

      <div className='mb-6 flex items-center justify-between'>
        <Link
          href='/recipes'
          className='inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100'>
          <ArrowLeft className='size-4' aria-hidden /> Back to recipes
        </Link>
        <div className='flex items-center gap-2 text-xs text-zinc-400'>
          <Clock className='size-4' aria-hidden />
          <span>{recipe.time}</span>
        </div>
      </div>

      <h1 className='text-2xl font-medium text-zinc-100'>{recipe.title}</h1>

      {recipe.image && (
        <div className='mt-4 overflow-hidden rounded-lg border border-zinc-800'>
          <Image
            src={recipe.image}
            alt={`${recipe.title} served on a plate`}
            width={1200}
            height={630}
            priority
          />
        </div>
      )}

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

      <p className='mt-3 text-[11px] text-zinc-500'>
        Links to recommended tools and pantry items may be affiliate links. If you buy, I may earn a
        small commission at no extra cost to you.
      </p>

      <Card className='mt-4 border-zinc-800 bg-zinc-950'>
        <CardContent className='p-4'>
          <div className='mb-2 flex items-center gap-2 text-zinc-300'>
            <BookOpenText className='size-4 text-zinc-400' aria-hidden />
            <span className='text-sm font-medium'>Notes</span>
          </div>
          <div className='text-sm text-zinc-300'>
            {recipe.notes ? recipe.notes : <em>No additional notes for this recipe.</em>}
          </div>

          {pantry.length > 0 && (
            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs'>
              <span className='text-zinc-500'>Pantry:</span>
              {pantry.slice(0, 3).map((item, i) => (
                <span key={item.key} className='text-zinc-400'>
                  <AffLink item={item} iconOnly position='notes_pantry' />
                  {i < Math.min(2, pantry.length - 1) ? (
                    <span className='px-1 text-zinc-600'>·</span>
                  ) : null}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className='my-6 border-zinc-800' />

      <div className='grid gap-6 md:grid-cols-[1fr_.8fr]'>
        <Card id='ingredients' className='border-zinc-800 bg-zinc-950'>
          <CardContent className='p-6'>
            <h2 className='text-sm font-medium text-zinc-200'>Ingredients</h2>

            <ul className='mt-3 space-y-1 text-sm text-zinc-300'>
              {recipe.ingredients.map((line, idx) => {
                const id = `ing-${idx + 1}`;
                const lower = line.toLowerCase();

                const matched = pantry.find((m) =>
                  [m.label, ...(m.queries || [])].some((q) => lower.includes(q.toLowerCase())),
                );

                const m = line.match(/^(\s*\d+([\/.\d]*)?\s*\w*\s*)?(.*)$/i);
                const qtyUnit = m?.[1] ?? '';
                const namePart = (m?.[3] ?? line).trim();

                const amazonUrl = matched
                  ? `https://www.amazon.com/s?k=${encodeURIComponent(namePart)}&tag=${
                      process.env.NEXT_PUBLIC_AMAZON_TAG
                    }`
                  : null;

                return (
                  <li key={idx} id={id} className='group list-inside list-disc pl-5'>
                    {matched && amazonUrl ? (
                      <>
                        <span className='text-zinc-400'>{qtyUnit}</span>
                        <TrackedAmazonLink
                          href={amazonUrl}
                          label={namePart}
                          itemKey={matched.key}
                          position='ingredients_list'
                        />
                      </>
                    ) : (
                      <span>{line}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className='border-zinc-800 bg-zinc-950'>
          <CardContent className='p-6'>
            <h2 className='text-sm font-medium text-zinc-200'>Steps</h2>
            <ol className='mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300'>
              {recipe.steps.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>

            {gear.length > 0 && (
              <div className='mt-5 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs'>
                <div className='mb-2 inline-flex items-center gap-2 text-zinc-400'>
                  <Info className='size-3.5' aria-hidden />
                  <span>Gear that fits</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {gear.map((item) => (
                    <AffLink
                      key={item.key}
                      item={item}
                      iconOnly
                      className='opacity-80 hover:opacity-100'
                      position='gear_box'
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {related.length > 0 && (
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
      )}
      <StickyAffBar items={pantry as AffItem[]} />
    </article>
  );
}
