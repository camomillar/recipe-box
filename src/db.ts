import Dexie, { type EntityTable } from 'dexie';
import type { Category, Recipe } from './types';

export const db = new Dexie('recipe-box') as Dexie & {
  recipes: EntityTable<Recipe, 'id'>;
};

db.version(1).stores({
  recipes: 'id, createdAt, category',
});

// Early versions added six example recipes on first launch. Remove them from
// devices that still have them, but only if untouched (same title and ingredients),
// so a recipe someone edited or added themselves is never deleted.
const OLD_EXAMPLES: Record<string, string> = {
  'Pão de queijo': '500 g polvilho azedo (sour tapioca starch)',
  'Weeknight tomato pasta': '200 g spaghetti',
  Brigadeiro: '1 can condensed milk (395 g)',
  Caipirinha: '1 lime, cut in wedges',
  Shakshuka: '1 onion',
  'Banana oat pancakes': '2 ripe bananas',
};

db.version(2)
  .stores({ recipes: 'id, createdAt, category' })
  .upgrade((tx) =>
    tx.table('recipes')
      .filter((r: Recipe) => !r.photo && OLD_EXAMPLES[r.title] === r.ingredients[0])
      .delete(),
  );

export function allRecipes() {
  return db.recipes.orderBy('createdAt').reverse().toArray();
}

// ---- Backup ----

interface BackupRecipe extends Omit<Recipe, 'photo'> {
  photo?: string; // data URL
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function exportBackup(): Promise<Blob> {
  const recipes = await allRecipes();
  const out: BackupRecipe[] = await Promise.all(
    recipes.map(async (r) => ({ ...r, photo: r.photo ? await blobToDataUrl(r.photo) : undefined })),
  );
  return new Blob([JSON.stringify({ app: 'recipe-box', version: 1, recipes: out }, null, 2)], {
    type: 'application/json',
  });
}

const CATEGORIES: Category[] = ['main', 'snack', 'sweet', 'drink'];

export async function importBackup(file: File): Promise<number> {
  const data = JSON.parse(await file.text());
  const list: unknown[] = Array.isArray(data) ? data : data?.recipes;
  if (!Array.isArray(list)) throw new Error('Not a Recipe Box backup');
  const recipes: Recipe[] = [];
  for (const raw of list as Partial<BackupRecipe>[]) {
    if (!raw || typeof raw.title !== 'string' || !raw.title.trim()) continue;
    recipes.push({
      id: typeof raw.id === 'string' ? raw.id : crypto.randomUUID(),
      title: raw.title,
      category: CATEGORIES.includes(raw.category as Category) ? (raw.category as Category) : 'main',
      origin: raw.origin || '',
      time: raw.time || '',
      servings: raw.servings || '',
      ingredients: Array.isArray(raw.ingredients) ? raw.ingredients.map(String) : [],
      steps: Array.isArray(raw.steps) ? raw.steps.map(String) : [],
      photo: raw.photo ? await (await fetch(raw.photo)).blob() : undefined,
      createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
    });
  }
  await db.recipes.bulkPut(recipes);
  return recipes.length;
}
