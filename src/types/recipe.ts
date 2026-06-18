export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  index: number;
  content: string;
  image?: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  scene: string;
  difficulty: string;
  duration: string;
  calories: string;
  coverImage: string;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
  isFavorite?: boolean;
  cuisine?: string;
  image?: string;
  rating?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: 'vegetable' | 'meat' | 'seafood' | 'seasoning' | 'other';
  checked: boolean;
  fromRecipe: string;
}

export interface SearchFilters {
  keyword: string;
  category: string;
  difficulty: string;
  duration: string;
}

export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'meat_dish', label: '荤菜' },
  { key: 'vegetable_dish', label: '素菜' },
  { key: 'aquatic', label: '水产' },
  { key: 'breakfast', label: '早餐' },
  { key: 'staple', label: '主食' },
  { key: 'soup', label: '汤粥' },
  { key: 'dessert', label: '甜品' },
  { key: 'drink', label: '饮料' },
  { key: 'condiment', label: '酱料' },
];

export const DIFFICULTIES = [
  { key: '', label: '不限' },
  { key: '简单', label: '简单' },
  { key: '普通', label: '普通' },
  { key: '困难', label: '困难' },
];

export const DURATIONS = [
  { key: '', label: '不限' },
  { key: '15分钟以内', label: '15分钟以内' },
  { key: '15-30分钟', label: '15-30分钟' },
  { key: '30-60分钟', label: '30-60分钟' },
  { key: '60分钟以上', label: '60分钟以上' },
];

// 周菜单规划
export interface WeekMeal {
  day: number; // 0-6
  meal: 'breakfast' | 'lunch' | 'dinner';
  recipeId: string;
  recipeName: string;
}

// 烹饪记录（营养分析）
export interface CookRecord {
  recipeId: string;
  recipeName: string;
  calories: string;
  cookedAt: string; // ISO date
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
  progress: number;
  target: number;
}

// 收藏夹分组
export interface FavoriteGroup {
  id: string;
  name: string;
  recipeIds: string[];
  createdAt: string;
}
