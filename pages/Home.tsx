import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Calendar, Flame, Trophy, ArrowRightLeft } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import RecipeCard from '@/components/RecipeCard';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const navigate = useNavigate();
  const { todayRecommendations, categoryRecipes, loadTodayRecommendations, loadCategoryRecipes } = useRecipeStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadTodayRecommendations();
    loadCategoryRecipes('all');
  }, [loadTodayRecommendations, loadCategoryRecipes]);

  const handleSearch = (keyword: string) => {
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadCategoryRecipes(category);
  };

  const features = [
    { icon: Sparkles, label: '智能配菜', path: '/smart-match', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' },
    { icon: Calendar, label: '周菜单', path: '/weekly-plan', color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300' },
    { icon: Flame, label: '营养分析', path: '/nutrition', color: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' },
    { icon: Trophy, label: '成就', path: '/achievements', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300' },
    { icon: ArrowRightLeft, label: '菜谱对比', path: '/compare', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300' },
  ];

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-6">
      {/* 顶部标题 + 搜索栏 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-bold text-white">家常菜谱</h1>
          </div>
          <ThemeToggle />
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="px-4 space-y-6 mt-4">
        {/* 功能入口 */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.path}
                onClick={() => navigate(feature.path)}
                className="shrink-0 flex flex-col items-center gap-1.5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-amber-700 dark:text-stone-300">{feature.label}</span>
              </button>
            );
          })}
        </div>

        {/* 分类导航 */}
        <CategoryNav selected={selectedCategory} onChange={handleCategoryChange} />

        {/* 今日推荐 */}
        <section>
          <h2 className="text-lg font-bold text-amber-900 dark:text-stone-100 mb-3">今日推荐</h2>
          <div className="grid grid-cols-2 gap-3">
            {todayRecommendations.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* 精选家常菜 */}
        <section>
          <h2 className="text-lg font-bold text-amber-900 dark:text-stone-100 mb-3">
            {selectedCategory === 'all' ? '精选家常菜' : selectedCategory}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categoryRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {categoryRecipes.length === 0 && (
            <p className="text-center text-amber-400 dark:text-stone-500 text-sm py-8">该分类暂无菜谱</p>
          )}
        </section>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
