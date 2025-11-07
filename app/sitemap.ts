import { RECIPES } from '@/data/recipes';
import { getBaseUrl } from '@/lib/site';

export default function sitemap() {
  const base = getBaseUrl();
  const pages = ['/', '/recipes', '/tags', '/about'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }));

  const recipeUrls = RECIPES.map((r) => ({
    url: `${base}/recipes/${r.slug}`,
    lastModified: new Date(),
  }));

  return [...pages, ...recipeUrls];
}
