export type Category = 'main' | 'snack' | 'sweet' | 'drink';

export interface Recipe {
  id: string;
  title: string;
  category: Category;
  origin?: string;
  time?: string;
  servings?: string;
  ingredients: string[];
  steps: string[];
  photo?: Blob;
  createdAt: number;
}

export const CATS: Record<Category, { label: string; one: string; tint: string; dot: string; kicker: string }> = {
  main: { label: 'Mains', one: 'Main', tint: '#FFE3D1', dot: '#F08A4B', kicker: '#B4500F' },
  snack: { label: 'Snacks', one: 'Snack', tint: '#D3F1E4', dot: '#3DBE8B', kicker: '#17734D' },
  sweet: { label: 'Sweets', one: 'Sweet', tint: '#E8DCFB', dot: '#9A6BEA', kicker: '#6B3FC0' },
  drink: { label: 'Drinks', one: 'Drink', tint: '#D4EBFB', dot: '#3E9BE0', kicker: '#1C69A8' },
};

export const ORDER: Category[] = ['main', 'snack', 'sweet', 'drink'];

export function kicker(r: Recipe): string {
  const cat = CATS[r.category] ?? CATS.main;
  return r.origin ? `${r.origin} ${cat.one.toLowerCase()}` : cat.one;
}

export function servesLabel(r: Recipe): string {
  if (!r.servings) return 'Serves —';
  return /^\d+$/.test(r.servings) ? `Serves ${r.servings}` : r.servings;
}

export function timeLabel(r: Recipe): string {
  return r.time || '—';
}
