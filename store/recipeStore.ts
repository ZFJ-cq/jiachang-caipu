import { create } from 'zustand';
import type { Recipe, SearchFilters, ShoppingItem, WeekMeal, CookRecord, Achievement, FavoriteGroup } from '@/types/recipe';
import { getHowToCookRecipes, searchHowToCookRecipes, getRandomRecipes, getHowToCookRecipeById } from '@/services/howtocook';
import { searchRecipesByKeyword } from '@/services/luckycola';
import * as storage from '@/services/storage';

const defaultFilters: SearchFilters = {
  keyword: '',
  category: '',
  difficulty: '',
  duration: '',
};

interface RecipeState {
  searchResults: Recipe[];
  isSearching: boolean;
  searchFilters: SearchFilters;
  searchHistory: string[];
  todayRecommendations: Recipe[];
  categoryRecipes: Recipe[];
  favorites: Recipe[];
  customRecipes: Recipe[];
  shoppingList: ShoppingItem[];
  browseHistory: Recipe[];
  ratings: Record<string, number>;

  searchRecipes: (keyword: string) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
  loadSearchHistory: () => void;
  addSearchHistory: (keyword: string) => void;
  clearSearchHistory: () => void;

  loadTodayRecommendations: () => void;
  loadCategoryRecipes: (category: string) => void;

  loadFavorites: () => void;
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: string) => boolean;

  loadCustomRecipes: () => void;
  addCustomRecipe: (recipe: Recipe) => void;
  updateCustomRecipe: (recipe: Recipe) => void;
  deleteCustomRecipe: (id: string) => void;

  getAllRecipes: () => Recipe[];
  getRecipeById: (id: string) => Recipe | undefined;

  loadShoppingList: () => void;
  addIngredientsToList: (ingredients: Recipe['ingredients'], recipeName: string) => void;
  removeShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearCheckedItems: () => void;

  loadBrowseHistory: () => void;
  addBrowseHistory: (recipe: Recipe) => void;
  clearBrowseHistory: () => void;

  getRating: (id: string) => number;
  setRating: (id: string, rating: number) => void;
  loadRatings: () => void;

  // 周菜单
  weeklyPlan: WeekMeal[];
  loadWeeklyPlan: () => void;
  addMealToPlan: (day: number, meal: string, recipeId: string, recipeName: string) => void;
  removeMealFromPlan: (day: number, meal: string) => void;
  clearWeeklyPlan: () => void;

  // 烹饪记录
  cookRecords: CookRecord[];
  todayCookRecords: CookRecord[];
  loadCookRecords: () => void;
  addCookRecord: (record: CookRecord) => void;

  // 成就
  achievements: Achievement[];
  loadAchievements: () => void;
  checkAchievements: () => Achievement[];

  // 收藏夹分组
  favoriteGroups: FavoriteGroup[];
  loadFavoriteGroups: () => void;
  addFavoriteGroup: (name: string) => void;
  deleteFavoriteGroup: (id: string) => void;
  addRecipeToGroup: (groupId: string, recipeId: string) => void;
  removeRecipeFromGroup: (groupId: string, recipeId: string) => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  searchResults: [],
  isSearching: false,
  searchFilters: { ...defaultFilters },
  searchHistory: [],
  todayRecommendations: [],
  categoryRecipes: [],
  favorites: [],
  customRecipes: [],
  shoppingList: [],
  browseHistory: [],
  ratings: {},

  searchRecipes: async (keyword: string) => {
    set({ isSearching: true });
    storage.addSearchHistory(keyword);

    const localResults = searchHowToCookRecipes(keyword);
    let apiResults: Recipe[] = [];
    try {
      apiResults = await searchRecipesByKeyword(keyword);
    } catch {
      // API失败时仅使用本地数据
    }

    const allResults = [...localResults, ...apiResults];
    const seen = new Set<string>();
    const uniqueResults = allResults.filter((r) => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    });

    set({
      searchResults: uniqueResults,
      isSearching: false,
      searchHistory: storage.getSearchHistory(),
    });
  },

  setSearchFilters: (filters) => {
    set((state) => ({ searchFilters: { ...state.searchFilters, ...filters } }));
  },

  resetSearchFilters: () => {
    set({ searchFilters: { ...defaultFilters } });
  },

  loadSearchHistory: () => {
    set({ searchHistory: storage.getSearchHistory() });
  },

  addSearchHistory: (keyword: string) => {
    storage.addSearchHistory(keyword);
    set({ searchHistory: storage.getSearchHistory() });
  },

  clearSearchHistory: () => {
    storage.clearSearchHistory();
    set({ searchHistory: [] });
  },

  loadTodayRecommendations: () => {
    const recommendations = getRandomRecipes(6);
    set({ todayRecommendations: recommendations });
  },

  loadCategoryRecipes: (category: string) => {
    const all = get().getAllRecipes();
    if (category === 'all') {
      set({ categoryRecipes: all });
    } else {
      set({ categoryRecipes: all.filter((r) => r.category === category || r.scene === category) });
    }
  },

  loadFavorites: () => {
    set({ favorites: storage.getFavorites() });
  },

  toggleFavorite: (recipe: Recipe) => {
    const current = get().favorites;
    const exists = current.some((f) => f.id === recipe.id);
    if (exists) {
      storage.removeFavorite(recipe.id);
    } else {
      storage.addFavorite(recipe);
    }
    set({ favorites: storage.getFavorites() });
  },

  isFavorite: (id: string) => {
    return get().favorites.some((f) => f.id === id);
  },

  loadCustomRecipes: () => {
    set({ customRecipes: storage.getCustomRecipes() });
  },

  addCustomRecipe: (recipe: Recipe) => {
    storage.addCustomRecipe(recipe);
    set({ customRecipes: storage.getCustomRecipes() });
  },

  updateCustomRecipe: (recipe: Recipe) => {
    storage.updateCustomRecipe(recipe.id, recipe);
    set({ customRecipes: storage.getCustomRecipes() });
  },

  deleteCustomRecipe: (id: string) => {
    storage.deleteCustomRecipe(id);
    storage.removeFavorite(id);
    set({
      customRecipes: storage.getCustomRecipes(),
      favorites: storage.getFavorites(),
    });
  },

  getAllRecipes: () => {
    return [...getHowToCookRecipes(), ...get().customRecipes];
  },

  getRecipeById: (id: string) => {
    const htcRecipe = getHowToCookRecipeById(id);
    if (htcRecipe) return htcRecipe;

    const favRecipe = get().favorites.find((r) => r.id === id);
    if (favRecipe) return favRecipe;

    return get().customRecipes.find((r) => r.id === id);
  },

  loadShoppingList: () => {
    set({ shoppingList: storage.getShoppingList() });
  },

  addIngredientsToList: (ingredients, recipeName) => {
    storage.addIngredientsToList(ingredients, recipeName);
    set({ shoppingList: storage.getShoppingList() });
  },

  removeShoppingItem: (id: string) => {
    storage.removeShoppingItem(id);
    set({ shoppingList: storage.getShoppingList() });
  },

  toggleShoppingItem: (id: string) => {
    storage.toggleShoppingItem(id);
    set({ shoppingList: storage.getShoppingList() });
  },

  clearCheckedItems: () => {
    storage.clearCheckedItems();
    set({ shoppingList: storage.getShoppingList() });
  },

  loadBrowseHistory: () => {
    set({ browseHistory: storage.getBrowseHistory() });
  },

  addBrowseHistory: (recipe: Recipe) => {
    storage.addBrowseHistory(recipe);
    set({ browseHistory: storage.getBrowseHistory() });
  },

  clearBrowseHistory: () => {
    storage.clearBrowseHistory();
    set({ browseHistory: [] });
  },

  getRating: (id: string) => {
    return get().ratings[id] || 0;
  },

  setRating: (id: string, rating: number) => {
    storage.setRecipeRating(id, rating);
    set({ ratings: { ...get().ratings, [id]: rating } });
  },

  loadRatings: () => {
    const ratingsStr = localStorage.getItem('recipe_ratings');
    const ratings = ratingsStr ? JSON.parse(ratingsStr) : {};
    set({ ratings });
  },

  // 周菜单
  weeklyPlan: [],
  loadWeeklyPlan: () => {
    set({ weeklyPlan: storage.getWeeklyPlan() });
  },
  addMealToPlan: (day: number, meal: string, recipeId: string, recipeName: string) => {
    storage.addMealToPlan(day, meal, recipeId, recipeName);
    set({ weeklyPlan: storage.getWeeklyPlan() });
  },
  removeMealFromPlan: (day: number, meal: string) => {
    storage.removeMealFromPlan(day, meal);
    set({ weeklyPlan: storage.getWeeklyPlan() });
  },
  clearWeeklyPlan: () => {
    storage.clearWeeklyPlan();
    set({ weeklyPlan: [] });
  },

  // 烹饪记录
  cookRecords: [],
  todayCookRecords: [],
  loadCookRecords: () => {
    set({
      cookRecords: storage.getCookRecords(),
      todayCookRecords: storage.getTodayCookRecords(),
    });
  },
  addCookRecord: (record: CookRecord) => {
    storage.addCookRecord(record);
    set({
      cookRecords: storage.getCookRecords(),
      todayCookRecords: storage.getTodayCookRecords(),
    });
  },

  // 成就
  achievements: [],
  loadAchievements: () => {
    set({ achievements: storage.getAchievements() });
  },
  checkAchievements: () => {
    const newlyUnlocked = storage.checkAndUnlockAchievements();
    set({ achievements: storage.getAchievements() });
    return newlyUnlocked;
  },

  // 收藏夹分组
  favoriteGroups: [],
  loadFavoriteGroups: () => {
    set({ favoriteGroups: storage.getFavoriteGroups() });
  },
  addFavoriteGroup: (name: string) => {
    storage.addFavoriteGroup(name);
    set({ favoriteGroups: storage.getFavoriteGroups() });
  },
  deleteFavoriteGroup: (id: string) => {
    storage.deleteFavoriteGroup(id);
    set({ favoriteGroups: storage.getFavoriteGroups() });
  },
  addRecipeToGroup: (groupId: string, recipeId: string) => {
    storage.addRecipeToGroup(groupId, recipeId);
    set({ favoriteGroups: storage.getFavoriteGroups() });
  },
  removeRecipeFromGroup: (groupId: string, recipeId: string) => {
    storage.removeRecipeFromGroup(groupId, recipeId);
    set({ favoriteGroups: storage.getFavoriteGroups() });
  },
}));
