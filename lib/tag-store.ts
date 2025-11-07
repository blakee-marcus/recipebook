import { RECIPES } from '@/data/recipes';

export type TagRow = { name: string; count: number };

// Simple in-memory store (persists while the server process lives)
declare global {
  // eslint-disable-next-line no-var
  var __tagStore: Map<string, number> | undefined;
}

function seedFromRecipes(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const r of RECIPES) {
    const t = String(r.tag || '')
      .trim()
      .toLowerCase();
    if (!t) continue;
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  return counts;
}

function getStore() {
  if (!global.__tagStore) {
    global.__tagStore = seedFromRecipes();
  }
  return global.__tagStore;
}

export function listTags(): TagRow[] {
  const store = getStore();
  return Array.from(store.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function addTag(nameRaw: string, count = 0): TagRow {
  const name = String(nameRaw).trim().toLowerCase();
  if (!name) throw new Error('Name required');
  const store = getStore();
  const next = Math.max(0, Number.isFinite(count) ? Number(count) : 0);
  const existing = store.get(name);
  if (typeof existing === 'number') {
    // if it exists, just update count (or keep the current one if next is zero)
    const finalCount = next > 0 ? next : existing;
    store.set(name, finalCount);
    return { name, count: finalCount };
  }
  store.set(name, next);
  return { name, count: next };
}

export function deleteTag(nameRaw: string) {
  const name = String(nameRaw).trim().toLowerCase();
  if (!name) throw new Error('Name required');
  const store = getStore();
  store.delete(name);
}
