import { useEffect } from 'react';
import { Trash2, Clock } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import RecipeCard from '@/components/RecipeCard';
import BottomNav from '@/components/BottomNav';

export default function History() {
  const { browseHistory, loadBrowseHistory, clearBrowseHistory } = useRecipeStore();

  useEffect(() => {
    loadBrowseHistory();
  }, [loadBrowseHistory]);

  // 按日期分组
  const grouped = browseHistory.reduce<Record<string, typeof browseHistory>>((acc, recipe) => {
    const date = new Date(recipe.createdAt || recipe.updatedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(recipe);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-amber-100 px-4 pt-10 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-900">浏览历史</h1>
        {browseHistory.length > 0 && (
          <button
            onClick={clearBrowseHistory}
            className="flex items-center gap-1 text-sm text-red-500 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            清空历史
          </button>
        )}
      </div>

      {browseHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-full bg-amber-50 p-4">
            <Clock className="h-10 w-10 text-orange-400" />
          </div>
          <p className="text-sm text-amber-400">暂无浏览记录</p>
          <p className="text-xs text-amber-300 mt-1">浏览菜谱时会自动记录</p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-6">
          {Object.entries(grouped).map(([date, recipes]) => (
            <div key={date}>
              <h2 className="text-sm font-bold text-amber-500 mb-3">{date}</h2>
              <div className="grid grid-cols-2 gap-3">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
