import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChefHat, Clock, Flame, ArrowLeft } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import BottomNav from '@/components/BottomNav';

export default function SmartMatch() {
  const navigate = useNavigate();
  const { getAllRecipes } = useRecipeStore();
  const [searchText, setSearchText] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<{ recipe: ReturnType<typeof getAllRecipes>[0]; matched: number; total: number }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const allRecipes = getAllRecipes();

  const allIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    allRecipes.forEach((r) => {
      r.ingredients.forEach((i) => ingredientSet.add(i.name));
    });
    return Array.from(ingredientSet).sort();
  }, [allRecipes]);

  const filteredIngredients = useMemo(() => {
    if (!searchText) return allIngredients.slice(0, 50);
    return allIngredients.filter((i) => i.includes(searchText));
  }, [allIngredients, searchText]);

  const addIngredient = (name: string) => {
    if (!selectedIngredients.includes(name)) {
      setSelectedIngredients((prev) => [...prev, name]);
    }
    setSearchText('');
  };

  const removeIngredient = (name: string) => {
    setSelectedIngredients((prev) => prev.filter((i) => i !== name));
  };

  const handleSearch = () => {
    if (selectedIngredients.length === 0) return;
    const matched = allRecipes
      .map((recipe) => {
        const recipeIngredientNames = recipe.ingredients.map((i) => i.name);
        const matchedCount = selectedIngredients.filter((si) =>
          recipeIngredientNames.some((ri) => ri.includes(si) || si.includes(ri))
        ).length;
        return { recipe, matched: matchedCount, total: recipe.ingredients.length };
      })
      .filter((r) => r.matched > 0)
      .sort((a, b) => b.matched - a.matched || a.total - b.total);
    setResults(matched);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">智能配菜</h1>
        </div>
        <p className="text-orange-100 text-sm">输入你有的食材，为你推荐最合适的菜谱</p>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* 已选食材 */}
        {selectedIngredients.length > 0 && (
          <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700">
            <p className="text-sm font-medium text-amber-700 dark:text-orange-300 mb-2">已选食材</p>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 rounded-full text-sm"
                >
                  {name}
                  <button onClick={() => removeIngredient(name)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 搜索食材 */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索食材..."
              className="w-full pl-9 pr-4 py-2.5 bg-amber-50 dark:bg-stone-700 rounded-lg text-sm text-amber-900 dark:text-stone-100 placeholder-amber-400 dark:placeholder-stone-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto">
            {filteredIngredients.map((name) => (
              <button
                key={name}
                onClick={() => addIngredient(name)}
                disabled={selectedIngredients.includes(name)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedIngredients.includes(name)
                    ? 'bg-orange-200 dark:bg-orange-800 text-orange-400 dark:text-orange-300 cursor-not-allowed'
                    : 'bg-amber-50 dark:bg-stone-700 text-amber-700 dark:text-stone-200 hover:bg-orange-100 dark:hover:bg-stone-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 推荐按钮 */}
        <button
          onClick={handleSearch}
          disabled={selectedIngredients.length === 0}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
            selectedIngredients.length > 0
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-amber-200 dark:bg-stone-700 text-amber-400 dark:text-stone-500 cursor-not-allowed'
          }`}
        >
          推荐菜谱 ({selectedIngredients.length}种食材)
        </button>

        {/* 匹配结果 */}
        {hasSearched && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-amber-900 dark:text-stone-100">
              匹配结果 ({results.length}道菜谱)
            </h2>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="w-12 h-12 text-amber-300 dark:text-stone-600 mx-auto mb-3" />
                <p className="text-amber-500 dark:text-stone-400 text-sm">没有找到匹配的菜谱，试试添加更多食材</p>
              </div>
            ) : (
              results.map(({ recipe, matched, total }) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-500 dark:text-orange-300">{recipe.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-amber-900 dark:text-stone-100 text-sm truncate">{recipe.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-amber-600 dark:text-stone-400">
                        <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 rounded-md">{recipe.difficulty}</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {recipe.duration}
                        </span>
                        {recipe.calories && (
                          <span className="flex items-center gap-0.5">
                            <Flame className="w-3 h-3" />
                            {recipe.calories}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-orange-500 dark:text-orange-400 mt-1 font-medium">
                        已匹配 {matched}/{total} 种食材
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
