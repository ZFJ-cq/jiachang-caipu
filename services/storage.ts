import { Recipe, Ingredient, ShoppingItem, WeekMeal, CookRecord, Achievement, FavoriteGroup } from '@/types/recipe';

const STORAGE_KEYS = {
  FAVORITES: 'recipe_favorites',
  CUSTOM_RECIPES: 'custom_recipes',
  SEARCH_HISTORY: 'search_history',
  SHOPPING_LIST: 'shopping_list',
  BROWSE_HISTORY: 'browse_history',
  RATINGS: 'recipe_ratings',
  WEEKLY_PLAN: 'weekly_plan',
  COOK_RECORDS: 'cook_records',
  ACHIEVEMENTS: 'achievements',
  FAVORITE_GROUPS: 'favorite_groups',
  THEME: 'app_theme',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// 收藏相关
export function getFavorites(): Recipe[] {
  return getFromStorage<Recipe[]>(STORAGE_KEYS.FAVORITES, []);
}

export function addFavorite(recipe: Recipe): void {
  const favorites = getFavorites();
  if (!favorites.some((f) => f.id === recipe.id)) {
    favorites.push({ ...recipe, isFavorite: true });
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}

// 自定义菜谱相关
export function getCustomRecipes(): Recipe[] {
  return getFromStorage<Recipe[]>(STORAGE_KEYS.CUSTOM_RECIPES, []);
}

export function addCustomRecipe(recipe: Recipe): void {
  const recipes = getCustomRecipes();
  recipes.push(recipe);
  saveToStorage(STORAGE_KEYS.CUSTOM_RECIPES, recipes);
}

export function updateCustomRecipe(id: string, updated: Partial<Recipe>): void {
  const recipes = getCustomRecipes().map((r) =>
    r.id === id ? { ...r, ...updated, updatedAt: new Date().toISOString() } : r
  );
  saveToStorage(STORAGE_KEYS.CUSTOM_RECIPES, recipes);
}

export function deleteCustomRecipe(id: string): void {
  const recipes = getCustomRecipes().filter((r) => r.id !== id);
  saveToStorage(STORAGE_KEYS.CUSTOM_RECIPES, recipes);
}

// 搜索历史相关
export function getSearchHistory(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
}

export function addSearchHistory(keyword: string): void {
  const history = getSearchHistory().filter((h) => h !== keyword);
  history.unshift(keyword);
  saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, history.slice(0, 20));
}

export function clearSearchHistory(): void {
  saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
}

// 购物清单相关
export function getShoppingList(): ShoppingItem[] {
  return getFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_LIST, []);
}

export function addShoppingItem(item: ShoppingItem): void {
  const list = getShoppingList();
  if (!list.some((i) => i.name === item.name && i.fromRecipe === item.fromRecipe)) {
    list.push(item);
    saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list);
  }
}

export function removeShoppingItem(id: string): void {
  const list = getShoppingList().filter((i) => i.id !== id);
  saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list);
}

export function toggleShoppingItem(id: string): void {
  const list = getShoppingList().map((i) =>
    i.id === id ? { ...i, checked: !i.checked } : i
  );
  saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list);
}

export function clearCheckedItems(): void {
  const list = getShoppingList().filter((i) => !i.checked);
  saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list);
}

export function addIngredientsToList(ingredients: Ingredient[], recipeName: string): void {
  const list = getShoppingList();
  const existingNames = new Set(list.map((i) => i.name));
  for (const ing of ingredients) {
    if (!existingNames.has(ing.name)) {
      const category = guessIngredientCategory(ing.name);
      list.push({
        id: `${recipeName}-${ing.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: ing.name,
        amount: ing.amount,
        category,
        checked: false,
        fromRecipe: recipeName,
      });
      existingNames.add(ing.name);
    }
  }
  saveToStorage(STORAGE_KEYS.SHOPPING_LIST, list);
}

function guessIngredientCategory(name: string): ShoppingItem['category'] {
  const vegetables = ['白菜', '萝卜', '土豆', '番茄', '西红柿', '黄瓜', '茄子', '青椒', '辣椒', '豆角', '菠菜', '生菜', '芹菜', '韭菜', '洋葱', '蒜', '姜', '葱', '香菜', '冬瓜', '南瓜', '丝瓜', '苦瓜', '莲藕', '木耳', '蘑菇', '香菇', '金针菇', '豆腐', '豆芽', '西兰花', '菜花', '莴笋', '竹笋', '芦笋', '茭白', '空心菜', '油麦菜', '小白菜', '娃娃菜', '包菜', '圆白菜', '胡萝卜', '白萝卜', '青萝卜', '山药', '芋头', '红薯', '紫薯', '玉米', '毛豆', '豌豆', '蚕豆', '扁豆', '四季豆', '豇豆', '蒜薹', '蒜苗', '韭黄', '韭花'];
  const meats = ['猪肉', '牛肉', '羊肉', '鸡肉', '鸭肉', '排骨', '五花肉', '里脊', '肥牛', '鸡胸', '鸡腿', '鸡翅', '鸭腿', '鸭翅', '猪肝', '牛腩', '牛排', '肉末', '肉馅', '肉丝', '肉片', '腊肠', '火腿', '培根', '培根'];
  const seafoods = ['鱼', '虾', '蟹', '贝', '鱿鱼', '章鱼', '海参', '鲍鱼', '扇贝', '蛤蜊', '牡蛎', '生蚝', '带鱼', '鲈鱼', '鲫鱼', '草鱼', '鲤鱼', '三文鱼', '鳕鱼', '黄花鱼', '龙虾', '基围虾', '明虾', '皮皮虾', '花甲', '蛏子', '海蜇', '墨鱼'];
  const seasonings = ['盐', '糖', '酱油', '醋', '料酒', '蚝油', '生抽', '老抽', '豆瓣酱', '甜面酱', '番茄酱', '辣椒酱', '花椒', '八角', '桂皮', '香叶', '孜然', '胡椒粉', '五香粉', '淀粉', '面粉', '食用油', '花生油', '菜籽油', '香油', '芝麻油', '鸡精', '味精', '鲍鱼汁', '蒸鱼豉油', '味极鲜', '陈醋', '米醋', '白醋', '冰糖', '蜂蜜', '芝麻', '花生', '枸杞', '红枣', '干辣椒'];

  if (vegetables.some((v) => name.includes(v))) return 'vegetable';
  if (meats.some((m) => name.includes(m))) return 'meat';
  if (seafoods.some((s) => name.includes(s))) return 'seafood';
  if (seasonings.some((s) => name.includes(s))) return 'seasoning';
  return 'other';
}

// 浏览历史相关
export function getBrowseHistory(): Recipe[] {
  return getFromStorage<Recipe[]>(STORAGE_KEYS.BROWSE_HISTORY, []);
}

export function addBrowseHistory(recipe: Recipe): void {
  const history = getBrowseHistory().filter((r) => r.id !== recipe.id);
  history.unshift(recipe);
  saveToStorage(STORAGE_KEYS.BROWSE_HISTORY, history.slice(0, 50));
}

export function clearBrowseHistory(): void {
  saveToStorage(STORAGE_KEYS.BROWSE_HISTORY, []);
}

// 评分相关
export function getRecipeRating(id: string): number {
  const ratings = getFromStorage<Record<string, number>>(STORAGE_KEYS.RATINGS, {});
  return ratings[id] || 0;
}

export function setRecipeRating(id: string, rating: number): void {
  const ratings = getFromStorage<Record<string, number>>(STORAGE_KEYS.RATINGS, {});
  ratings[id] = rating;
  saveToStorage(STORAGE_KEYS.RATINGS, ratings);
}

// 周菜单规划相关
export function getWeeklyPlan(): WeekMeal[] {
  return getFromStorage<WeekMeal[]>(STORAGE_KEYS.WEEKLY_PLAN, []);
}

export function setWeeklyPlan(plan: WeekMeal[]): void {
  saveToStorage(STORAGE_KEYS.WEEKLY_PLAN, plan);
}

export function addMealToPlan(day: number, meal: string, recipeId: string, recipeName: string): void {
  const plan = getWeeklyPlan().filter((m) => !(m.day === day && m.meal === meal));
  plan.push({ day, meal: meal as WeekMeal['meal'], recipeId, recipeName });
  saveToStorage(STORAGE_KEYS.WEEKLY_PLAN, plan);
}

export function removeMealFromPlan(day: number, meal: string): void {
  const plan = getWeeklyPlan().filter((m) => !(m.day === day && m.meal === meal));
  saveToStorage(STORAGE_KEYS.WEEKLY_PLAN, plan);
}

export function clearWeeklyPlan(): void {
  saveToStorage(STORAGE_KEYS.WEEKLY_PLAN, []);
}

// 烹饪记录相关
export function getCookRecords(): CookRecord[] {
  return getFromStorage<CookRecord[]>(STORAGE_KEYS.COOK_RECORDS, []);
}

export function addCookRecord(record: CookRecord): void {
  const records = getCookRecords();
  records.push(record);
  saveToStorage(STORAGE_KEYS.COOK_RECORDS, records);
}

export function getTodayCookRecords(): CookRecord[] {
  const today = new Date().toISOString().split('T')[0];
  return getCookRecords().filter((r) => r.cookedAt.startsWith(today));
}

export function getWeekCookRecords(): CookRecord[] {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getCookRecords().filter((r) => new Date(r.cookedAt) >= weekAgo);
}

// 成就相关
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_cook', name: '初次烹饪', description: '完成第一道菜', icon: 'ChefHat', progress: 0, target: 1 },
  { id: 'novice', name: '厨艺新手', description: '完成5道菜', icon: 'Utensils', progress: 0, target: 5 },
  { id: 'expert', name: '厨艺达人', description: '完成20道菜', icon: 'Flame', progress: 0, target: 20 },
  { id: 'master', name: '大厨', description: '完成50道菜', icon: 'Crown', progress: 0, target: 50 },
  { id: 'collector', name: '收藏家', description: '收藏10道菜谱', icon: 'Heart', progress: 0, target: 10 },
  { id: 'explorer', name: '探索者', description: '浏览30道不同菜谱', icon: 'Compass', progress: 0, target: 30 },
  { id: 'allround', name: '全能选手', description: '完成5个不同分类的菜', icon: 'Sparkles', progress: 0, target: 5 },
  { id: 'early_bird', name: '早起鸟', description: '在早餐分类完成3道菜', icon: 'Sunrise', progress: 0, target: 3 },
  { id: 'dessert_chef', name: '甜品师', description: '在甜品分类完成3道菜', icon: 'Cake', progress: 0, target: 3 },
  { id: 'soup_master', name: '汤达人', description: '在汤分类完成5道菜', icon: 'Soup', progress: 0, target: 5 },
];

export function getAchievements(): Achievement[] {
  const saved = getFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
  if (saved.length === 0) {
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);
    return DEFAULT_ACHIEVEMENTS;
  }
  // Merge with defaults to ensure new achievements are added
  const merged = DEFAULT_ACHIEVEMENTS.map((def) => {
    const existing = saved.find((s) => s.id === def.id);
    return existing || def;
  });
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, merged);
  return merged;
}

export function checkAndUnlockAchievements(): Achievement[] {
  const achievements = getAchievements();
  const cookRecords = getCookRecords();
  const favorites = getFavorites();
  const browseHistory = getBrowseHistory();
  const newlyUnlocked: Achievement[] = [];

  const totalCooked = cookRecords.length;
  const totalFavorites = favorites.length;
  const totalBrowsed = browseHistory.length;

  // Get unique categories from cooked recipes
  const allRecipes = getHowToCookRecipesForAchievements();
  const cookedCategories = new Set<string>();
  const breakfastCount = { value: 0 };
  const dessertCount = { value: 0 };
  const soupCount = { value: 0 };

  for (const record of cookRecords) {
    const recipe = allRecipes.find((r) => r.id === record.recipeId);
    if (recipe) {
      cookedCategories.add(recipe.category);
      if (recipe.category === 'breakfast') breakfastCount.value++;
      if (recipe.category === 'dessert') dessertCount.value++;
      if (recipe.category === 'soup') soupCount.value++;
    }
  }

  const progressMap: Record<string, number> = {
    first_cook: Math.min(totalCooked, 1),
    novice: Math.min(totalCooked, 5),
    expert: Math.min(totalCooked, 20),
    master: Math.min(totalCooked, 50),
    collector: Math.min(totalFavorites, 10),
    explorer: Math.min(totalBrowsed, 30),
    allround: Math.min(cookedCategories.size, 5),
    early_bird: Math.min(breakfastCount.value, 3),
    dessert_chef: Math.min(dessertCount.value, 3),
    soup_master: Math.min(soupCount.value, 5),
  };

  for (const achievement of achievements) {
    const prevProgress = achievement.progress;
    const newProgress = progressMap[achievement.id] ?? achievement.progress;
    achievement.progress = newProgress;

    if (!achievement.unlockedAt && newProgress >= achievement.target) {
      achievement.unlockedAt = new Date().toISOString();
      if (prevProgress < achievement.target) {
        newlyUnlocked.push(achievement);
      }
    }
  }

  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  return newlyUnlocked;
}

function getHowToCookRecipesForAchievements(): Recipe[] {
  try {
    const data = localStorage.getItem('howtocook_recipes_cache');
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return getFavorites().concat(getCustomRecipes());
}

// 收藏夹分组相关
export function getFavoriteGroups(): FavoriteGroup[] {
  return getFromStorage<FavoriteGroup[]>(STORAGE_KEYS.FAVORITE_GROUPS, []);
}

export function addFavoriteGroup(name: string): void {
  const groups = getFavoriteGroups();
  groups.push({
    id: `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    recipeIds: [],
    createdAt: new Date().toISOString(),
  });
  saveToStorage(STORAGE_KEYS.FAVORITE_GROUPS, groups);
}

export function deleteFavoriteGroup(id: string): void {
  const groups = getFavoriteGroups().filter((g) => g.id !== id);
  saveToStorage(STORAGE_KEYS.FAVORITE_GROUPS, groups);
}

export function addRecipeToGroup(groupId: string, recipeId: string): void {
  const groups = getFavoriteGroups().map((g) => {
    if (g.id === groupId && !g.recipeIds.includes(recipeId)) {
      return { ...g, recipeIds: [...g.recipeIds, recipeId] };
    }
    return g;
  });
  saveToStorage(STORAGE_KEYS.FAVORITE_GROUPS, groups);
}

export function removeRecipeFromGroup(groupId: string, recipeId: string): void {
  const groups = getFavoriteGroups().map((g) => {
    if (g.id === groupId) {
      return { ...g, recipeIds: g.recipeIds.filter((id) => id !== recipeId) };
    }
    return g;
  });
  saveToStorage(STORAGE_KEYS.FAVORITE_GROUPS, groups);
}

// 主题相关
export function getTheme(): 'light' | 'dark' | 'system' {
  return getFromStorage<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME, 'system');
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  saveToStorage(STORAGE_KEYS.THEME, theme);
}
