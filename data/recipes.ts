import type { AffItem } from '@/lib/affiliates';

export type Recipe = {
  slug: string;
  title: string;
  tag: string;
  time: string; // e.g., "20 min"
  ingredients: string[];
  steps: string[];
  notes?: string;

  // Optional metadata used for JSON-LD and UI
  date?: string; // ISO date
  author?: string;
  image?: string;
  yield?: string; // e.g., "2 servings"
  nutrition?: { calories?: string };

  // Hints for affiliate system (all optional)
  tools?: string[]; // keys from DEFAULT_AFFILIATES (e.g., "chef-knife")
  affiliates?: { keys?: string[]; extra?: AffItem[] };

  // Optional FAQ for richer results
  faqs?: { q: string; a: string }[];
};

export const RECIPES: Recipe[] = [
  {
    slug: 'cold-sesame-noodles',
    title: 'Cold Sesame Noodles',
    tag: 'noodles',
    time: '20 min',
    yield: '2 servings',
    date: '2025-08-01',
    author: 'Recipe.System',
    ingredients: [
      '200g wheat noodles',
      '2 tbsp sesame paste or tahini',
      '1 tbsp soy sauce',
      '1 tsp rice vinegar',
      '1 tsp chili oil',
      '1 tsp sugar',
      '1 clove garlic, grated',
      '1 scallion, sliced',
      'Sesame seeds',
    ],
    steps: [
      'Boil noodles until tender, then rinse cold.',
      'Whisk dressing until smooth.',
      'Toss noodles with dressing and scallion.',
      'Finish with sesame seeds.',
    ],
    notes:
      'Good with shredded cucumber. Add a splash of noodle water to loosen the sauce if needed.',
    nutrition: { calories: '520 kcal (approx.)' },
    tools: ['chef-knife'],
    affiliates: {
      // natural inline matches will pick these up next to ingredients
      keys: ['sesame-paste', 'soy-sauce', 'rice-vinegar', 'chili-oil'],
    },
    faqs: [
      {
        q: 'Can I use peanut butter instead of sesame paste?',
        a: 'Yes. Thin with a little hot water and add a touch more vinegar to balance.',
      },
      {
        q: 'Serve chilled or room temp?',
        a: 'Room temp is ideal. If fully chilled, loosen with a spoon of hot water and toss.',
      },
    ],
  },
  {
    slug: 'sheet-pan-chicken',
    title: 'Sheet Pan Chicken',
    tag: 'weeknight',
    time: '35 min',
    yield: '2–3 servings',
    date: '2025-08-03',
    author: 'Recipe.System',
    ingredients: [
      '4 chicken thighs',
      '300g small potatoes, halved',
      '1 red onion, wedges',
      '2 tbsp olive oil',
      'Salt and pepper',
      'Paprika',
    ],
    steps: [
      'Heat oven to 220°C or 425°F.',
      'Toss everything with oil and seasoning.',
      'Roast until skin is crisp and potatoes are tender.',
    ],
    nutrition: { calories: '650 kcal (approx.)' },
    tools: ['sheet-pan', 'chef-knife'],
    affiliates: {
      keys: ['sheet-pan', 'chef-knife'],
    },
    faqs: [
      {
        q: 'Can I swap thighs for breasts?',
        a: 'Yes, but reduce time a little and check doneness early to avoid drying out.',
      },
    ],
  },
  {
    slug: 'miso-roasted-salmon',
    title: 'Miso Roasted Salmon',
    tag: 'seafood',
    time: '25 min',
    yield: '2 servings',
    date: '2025-08-05',
    author: 'Recipe.System',
    ingredients: [
      '2 salmon fillets',
      '1 tbsp white miso',
      '1 tsp honey',
      '1 tsp soy sauce',
      '1 tsp rice vinegar',
    ],
    steps: [
      'Mix glaze until smooth.',
      'Brush salmon and rest 10 minutes.',
      'Roast at 200°C or 400°F until flaky.',
    ],
    nutrition: { calories: '430 kcal (approx.)' },
    tools: ['sheet-pan'],
    affiliates: {
      keys: ['miso', 'soy-sauce', 'rice-vinegar', 'sheet-pan'],
    },
    faqs: [
      {
        q: 'Can I cook this in a skillet?',
        a: 'Yes. Sear skin-side down, then finish in the oven for a minute or two.',
      },
    ],
  },
  {
    slug: 'citrus-olive-salad',
    title: 'Citrus Olive Salad',
    tag: 'salad',
    time: '10 min',
    yield: '2 servings',
    date: '2025-08-07',
    author: 'Recipe.System',
    ingredients: [
      '2 oranges, segmented',
      'A handful of olives',
      'Thin red onion slices',
      'Olive oil',
      'Salt',
      'Black pepper',
    ],
    steps: ['Layer citrus, olives, and onion.', 'Dress with oil, salt, and pepper.'],
    notes: 'Add shaved fennel for more crunch.',
    nutrition: { calories: '260 kcal (approx.)' },
    tools: ['chef-knife'],
    affiliates: {
      keys: ['chef-knife'],
    },
  },
];

export function getRecipe(slug: string) {
  return RECIPES.find((r) => r.slug === slug);
}
