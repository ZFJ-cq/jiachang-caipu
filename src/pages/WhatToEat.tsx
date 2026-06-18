import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, RotateCcw } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import RecipeCard from '@/components/RecipeCard';
import BottomNav from '@/components/BottomNav';
import type { Recipe } from '@/types/recipe';

type FilterType = 'all' | 'meat_dish' | 'vegetable_dish' | 'aquatic';

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '不限' },
  { key: 'meat_dish', label: '荤菜' },
  { key: 'vegetable_dish', label: '素菜' },
  { key: 'aquatic', label: '水产' },
];

export default function WhatToEat() {
  const navigate = useNavigate();
  const { getAllRecipes } = useRecipeStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [rolling, setRolling] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number>(0);

  const getFilteredRecipes = useCallback(() => {
    const all = getAllRecipes();
    if (filter === 'all') return all;
    return all.filter((r) => r.category === filter);
  }, [getAllRecipes, filter]);

  const startRolling = useCallback(() => {
    const recipes = getFilteredRecipes();
    if (recipes.length === 0) return;

    setSelectedRecipe(null);
    setRolling(true);

    const totalDuration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // 减速效果：间隔从30ms逐渐增大到300ms
      const interval = 30 + progress * progress * 270;

      const randomIndex = Math.floor(Math.random() * recipes.length);
      setDisplayName(recipes[randomIndex].name);

      if (progress < 1) {
        timerRef.current = setTimeout(() => {
          animFrameRef.current = requestAnimationFrame(animate);
        }, interval);
      } else {
        // 最终选中
        const finalRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        setDisplayName(finalRecipe.name);
        setSelectedRecipe(finalRecipe);
        setRolling(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [getFilteredRecipes]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const recipes = getFilteredRecipes();

  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-8">
        <h1 className="text-2xl font-bold text-white text-center">今天吃什么？</h1>
        <p className="text-orange-100 text-sm text-center mt-1">让命运来决定今天的美食吧</p>
      </div>

      <div className="px-4 -mt-4">
        {/* 条件筛选 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
          <p className="text-sm font-medium text-amber-700 mb-3">选择偏好</p>
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setFilter(opt.key); setSelectedRecipe(null); setDisplayName(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === opt.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 老虎机滚动区域 */}
        <div className="mt-6 flex flex-col items-center">
          <div className="w-64 h-32 bg-white rounded-2xl border-2 border-orange-200 shadow-lg overflow-hidden flex items-center justify-center relative">
            {/* 上下渐变遮罩 */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent z-10" />

            {displayName ? (
              <span className={`text-3xl font-bold text-amber-900 ${rolling ? 'animate-pulse' : ''}`}>
                {displayName}
              </span>
            ) : (
              <span className="text-amber-300 text-lg">点击下方按钮开始</span>
            )}
          </div>

          {/* 操作按钮 */}
          <button
            onClick={startRolling}
            disabled={rolling || recipes.length === 0}
            className="mt-6 flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-2xl text-lg font-bold shadow-lg hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-5 h-5" />
            {rolling ? '抽取中...' : '换一换'}
          </button>

          {recipes.length === 0 && (
            <p className="text-amber-400 text-sm mt-3">该分类暂无菜谱</p>
          )}
        </div>

        {/* 抽中结果 */}
        {selectedRecipe && !rolling && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-amber-900">今天就吃这个！</h2>
              <button
                onClick={startRolling}
                className="flex items-center gap-1 text-sm text-orange-500 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                不满意，再抽一次
              </button>
            </div>
            <div className="max-w-xs mx-auto">
              <RecipeCard recipe={selectedRecipe} />
            </div>
            <button
              onClick={() => navigate(`/recipe/${selectedRecipe.id}`)}
              className="mt-4 w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              查看菜谱详情
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
