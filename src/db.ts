import Dexie, { type EntityTable } from 'dexie';
import type { Category, Recipe } from './types';

export const db = new Dexie('recipe-box') as Dexie & {
  recipes: EntityTable<Recipe, 'id'>;
};

db.version(1).stores({
  recipes: 'id, createdAt, category',
});

type Starter = Omit<Recipe, 'id' | 'createdAt'>;

const STARTERS: Starter[] = [
  { title: 'Pão de queijo', category: 'snack', origin: 'Brazilian', time: '45 min', servings: '20 pieces',
    ingredients: ['500 g polvilho azedo (sour tapioca starch)', '250 ml milk', '120 ml vegetable oil', '1 tsp salt', '2 eggs', '200 g grated Parmesan or Minas cheese'],
    steps: ['Bring the milk, oil and salt to a boil.', 'Pour it over the polvilho and mix until crumbly.', 'Let it cool a bit, then add the eggs one at a time, kneading well.', 'Add the cheese and knead into a soft, slightly sticky dough.', 'Roll into small balls with oiled hands.', 'Bake at 180 °C for 25–30 minutes until golden.'] },
  { title: 'Weeknight tomato pasta', category: 'main', origin: 'Italian', time: '25 min', servings: '2',
    ingredients: ['200 g spaghetti', '1 can whole tomatoes', '3 garlic cloves, sliced', '3 tbsp olive oil', 'Chili flakes', 'Fresh basil', 'Salt'],
    steps: ['Boil the pasta in well-salted water.', 'Gently fry the garlic and chili in olive oil.', 'Add the tomatoes, crush them and simmer 10 minutes.', 'Toss the pasta with the sauce and a splash of pasta water.', 'Finish with basil.'] },
  { title: 'Brigadeiro', category: 'sweet', origin: 'Brazilian', time: '20 min', servings: '25 pieces',
    ingredients: ['1 can condensed milk (395 g)', '1 tbsp butter', '2 tbsp cocoa powder', 'Chocolate sprinkles'],
    steps: ['Put condensed milk, butter and cocoa in a pan over low heat.', 'Stir until it pulls away from the bottom of the pan.', 'Move to a buttered plate and let it cool.', 'Roll into balls and coat in sprinkles.'] },
  { title: 'Caipirinha', category: 'drink', origin: 'Brazilian', time: '5 min', servings: '1',
    ingredients: ['1 lime, cut in wedges', '2 tsp sugar', '50 ml cachaça', 'Crushed ice'],
    steps: ['Muddle lime and sugar in the glass.', 'Fill with crushed ice.', 'Pour in the cachaça and stir.'] },
  { title: 'Shakshuka', category: 'main', origin: 'North African', time: '30 min', servings: '2',
    ingredients: ['1 onion', '1 red pepper', '2 garlic cloves', '1 tsp cumin', '1 tsp paprika', '1 can chopped tomatoes', '4 eggs', 'Feta and parsley to serve'],
    steps: ['Soften onion and pepper in olive oil.', 'Add garlic and spices, cook 1 minute.', 'Add tomatoes and simmer until thick.', 'Make 4 wells, crack in the eggs, cover until set.', 'Top with feta and parsley.'] },
  { title: 'Banana oat pancakes', category: 'sweet', origin: '', time: '15 min', servings: '2',
    ingredients: ['2 ripe bananas', '2 eggs', '80 g oats', '1 tsp baking powder', 'Pinch of cinnamon'],
    steps: ['Blend everything until smooth.', 'Cook small pancakes in a buttered pan, 2 minutes per side.', 'Serve with honey or fruit.'] },
];

// Runs once, when the database is first created on this device.
db.on('populate', (tx) => {
  const now = Date.now();
  tx.table('recipes').bulkAdd(
    STARTERS.map((s, i) => ({ ...s, id: crypto.randomUUID(), createdAt: now - i * 1000 })),
  );
});

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
