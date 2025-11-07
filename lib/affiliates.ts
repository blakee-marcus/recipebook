// lib/affiliates.ts
export type PartnerId = 'amazon' | 'walmart' | 'target';

type Partner = {
  id: PartnerId;
  label: string;
  baseSearch: (q: string) => string;
  decorate?: (url: string) => string;
};

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || '';

export const PARTNERS: Record<PartnerId, Partner> = {
  amazon: {
    id: 'amazon',
    label: 'Amazon',
    baseSearch: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
    decorate: (u) => (AMAZON_TAG ? `${u}&tag=${encodeURIComponent(AMAZON_TAG)}` : u),
  },
  walmart: {
    id: 'walmart',
    label: 'Walmart',
    baseSearch: (q) =>
      `https://www.walmart.com/search?q=${encodeURIComponent(q)}`,
  },
  target: {
    id: 'target',
    label: 'Target',
    baseSearch: (q) =>
      `https://www.target.com/s?searchTerm=${encodeURIComponent(q)}`,
  },
};

export type AffItem = {
  key: string;        // unique key like "sesame-paste"
  label: string;      // “Sesame paste”
  queries: string[];  // search queries to try in order
  partner?: PartnerId;// default partner fallback
  directUrl?: string; // optional hard link (will still be decorated)
  kind?: 'pantry' | 'gear';
};

export type AffiliateConfig = {
  items: AffItem[];
};

/**
 * Default catalog of useful pantry items and gear.
 * Keep names lowercase for matching. You can expand this list anytime.
 */
export const DEFAULT_AFFILIATES: AffiliateConfig = {
  items: [
    { key: 'sesame-paste', label: 'Sesame paste', queries: ['sesame paste', 'tahini'], partner: 'amazon', kind: 'pantry' },
    { key: 'soy-sauce', label: 'Soy sauce', queries: ['soy sauce'], partner: 'amazon', kind: 'pantry' },
    { key: 'rice-vinegar', label: 'Rice vinegar', queries: ['rice vinegar'], partner: 'amazon', kind: 'pantry' },
    { key: 'chili-oil', label: 'Chili oil', queries: ['chili oil'], partner: 'amazon', kind: 'pantry' },
    { key: 'wok-spatula', label: 'Wok spatula', queries: ['wok spatula stainless steel'], partner: 'amazon', kind: 'gear' },
    { key: 'chef-knife', label: 'Chef knife', queries: ['8 inch chef knife'], partner: 'amazon', kind: 'gear' },
    { key: 'nonstick-pan', label: 'Nonstick pan', queries: ['nonstick frying pan 10 inch'], partner: 'amazon', kind: 'gear' },
    { key: 'sheet-pan', label: 'Sheet pan', queries: ['sheet pan aluminum'], partner: 'amazon', kind: 'gear' },
    { key: 'miso', label: 'White miso', queries: ['white miso paste'], partner: 'amazon', kind: 'pantry' },
  ],
};

export function buildAffiliateUrl(
  item: AffItem,
  partnerOverride?: PartnerId
): string {
  if (item.directUrl) {
    const decorated =
      (item.partner && PARTNERS[item.partner]?.decorate)
        ? PARTNERS[item.partner]!.decorate!(item.directUrl)
        : item.directUrl;
    return decorated;
  }

  const partner = PARTNERS[partnerOverride || item.partner || 'amazon'];
  const base = partner.baseSearch(item.queries[0] || item.label);
  return partner.decorate ? partner.decorate(base) : base;
}

/**
 * Greedy matcher: scans ingredient lines and maps likely items.
 * You can swap this for a fuzzy matcher later.
 */
export function matchAffiliatesFromIngredients(
  ingredients: string[],
  catalog: AffiliateConfig = DEFAULT_AFFILIATES
): AffItem[] {
  const text = ingredients.map((s) => s.toLowerCase()).join('\n');
  const out: AffItem[] = [];
  const seen = new Set<string>();

  for (const item of catalog.items) {
    if (seen.has(item.key)) continue;
    const found =
      item.queries.some((q) => text.includes(q.toLowerCase())) ||
      text.includes(item.label.toLowerCase());
    if (found) {
      out.push(item);
      seen.add(item.key);
    }
  }
  return out;
}

/**
 * Merge optional recipe-level hints (e.g., tools) into matches.
 */
export function mergeRecipeHints(
  base: AffItem[],
  hints?: { keys?: string[]; extra?: AffItem[] },
  catalog: AffiliateConfig = DEFAULT_AFFILIATES
): AffItem[] {
  const index = new Map(base.map((i) => [i.key, i]));
  if (hints?.keys?.length) {
    for (const k of hints.keys) {
      const match = catalog.items.find((i) => i.key === k);
      if (match && !index.has(k)) index.set(k, match);
    }
  }
  if (hints?.extra?.length) {
    for (const i of hints.extra) index.set(i.key, i);
  }
  return Array.from(index.values());
}
