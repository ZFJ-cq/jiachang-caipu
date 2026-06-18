import { Recipe } from '@/types/recipe';
import howtocookData from '@/data/howtocook-recipes.json';

let cachedRecipes: Recipe[] | null = null;

export function getHowToCookRecipes(): Recipe[] {
  if (!cachedRecipes) {
    cachedRecipes = howtocookData as Recipe[];
  }
  return cachedRecipes;
}

export function searchHowToCookRecipes(keyword: string): Recipe[] {
  const recipes = getHowToCookRecipes();
  const lowerKeyword = keyword.toLowerCase();
  return recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerKeyword) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(lowerKeyword)) ||
      r.category.toLowerCase().includes(lowerKeyword)
  );
}

export function getHowToCookRecipesByCategory(category: string): Recipe[] {
  if (category === 'all') return getHowToCookRecipes();
  return getHowToCookRecipes().filter((r) => r.category === category);
}

export function getHowToCookRecipeById(id: string): Recipe | undefined {
  return getHowToCookRecipes().find((r) => r.id === id);
}

export function getRandomRecipes(count: number = 3): Recipe[] {
  const recipes = getHowToCookRecipes();
  const shuffled = [...recipes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
