import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ArrowRightLeft } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import type { Recipe } from '@/types/recipe';
import BottomNav from '@/components/BottomNav';

export default function Compare() {
  const navigate = useNavigate();
  const { getAllRecipes } = useRecipeStore();
  const [recipeA, setRecipeA] = useState<Recipe | null>(null);
  const [recipeB, setRecipeB] = useState<Recipe | null>(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showPickerA, setShowPickerA] = useState(false);
  const [showPickerB, setShowPickerB] = useState(false);

  const allRecipes = getAllRecipes();

  const filteredA = useMemo(
    () => (searchA ? allRecipes.filter((r) => r.name.includes(searchA)) : allRecipes),
    [allRecipes, searchA]
  );
  const filteredB = useMemo(
    () => (searchB ? allRecipes.filter((r) => r.name.includes(searchB)) : allRecipes),
    [allRecipes, searchB]
  );

  const parseCalories = (cal: string) => {
    if (!cal) return 0;
    const m = cal.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const parseDuration = (dur: string) => {
    if (!dur) return 0;
    const m = dur.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const compareItems = [
    {
      label: '食材',
      render: (r: Recipe) => r.ingredients.map((i) => i.name).join('、'),
      compare: (a: Recipe, b: Recipe) => {
        const aNames = new Set(a.ingredients.map((i) => i.name));
        const bNames = new Set(b.ingredients.map((i) => i.name));
        const common = [...aNames].filter((n) => bNames.has(n));
        return common;
      },
    },
    { label: '步骤数', render: (r: Recipe) => `${r.steps.length} 步`, numeric: (r: Recipe) => r.steps.length },
    { label: '时长', render: (r: Recipe) => r.duration, numeric: (r: Recipe) => parseDuration(r.duration) },
    { label: '难度', render: (r: Recipe) => r.difficulty },
    { label: '热量', render: (r: Recipe) => r.calories || '未知', numeric: (r: Recipe) => parseCalories(r.calories) },
  ];

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">菜谱对比</h1>
        </div>
        <p className="text-orange-100 text-sm">选择两道菜谱进行对比</p>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* 选择器 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 菜谱A */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700">
            <button
              onClick={() => setShowPickerA(true)}
              className="w-full text-left"
            >
              {recipeA ? (
                <div>
                  <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-orange-500 dark:text-orange-300">{recipeA.name[0]}</span>
                  </div>
                  <p className="text-sm font-bold text-amber-900 dark:text-stone-100 truncate">{recipeA.name}</p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ArrowRightLeft className="w-8 h-8 text-amber-300 dark:text-stone-600 mx-auto mb-2" />
                  <p className="text-sm text-amber-400 dark:text-stone-500">选择菜谱A</p>
                </div>
              )}
            </button>
          </div>

          {/* 菜谱B */}
          <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700">
            <button
              onClick={() => setShowPickerB(true)}
              className="w-full text-left"
            >
              {recipeB ? (
                <div>
                  <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center mb-2">
                    <span className="text-3xl font-bold text-orange-500 dark:text-orange-300">{recipeB.name[0]}</span>
                  </div>
                  <p className="text-sm font-bold text-amber-900 dark:text-stone-100 truncate">{recipeB.name}</p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ArrowRightLeft className="w-8 h-8 text-amber-300 dark:text-stone-600 mx-auto mb-2" />
                  <p className="text-sm text-amber-400 dark:text-stone-500">选择菜谱B</p>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 对比结果 */}
        {recipeA && recipeB && (
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-amber-100 dark:border-stone-700 overflow-hidden">
            {compareItems.map((item, idx) => {
              const valA = item.render(recipeA);
              const valB = item.render(recipeB);
              const numA = item.numeric?.(recipeA);
              const numB = item.numeric?.(recipeB);
              const highlightA = numA !== undefined && numB !== undefined && numA > numB;
              const highlightB = numA !== undefined && numB !== undefined && numB > numA;

              return (
                <div key={idx} className={`flex ${idx > 0 ? 'border-t border-amber-100 dark:border-stone-700' : ''}`}>
                  <div className={`flex-1 p-3 text-sm ${highlightA ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 font-medium' : 'text-amber-900 dark:text-stone-200'}`}>
                    {valA}
                  </div>
                  <div className="w-16 flex items-center justify-center text-xs text-amber-500 dark:text-stone-400 border-x border-amber-100 dark:border-stone-700 shrink-0">
                    {item.label}
                  </div>
                  <div className={`flex-1 p-3 text-sm text-right ${highlightB ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 font-medium' : 'text-amber-900 dark:text-stone-200'}`}>
                    {valB}
                  </div>
                </div>
              );
            })}

            {/* 共同食材 */}
            {(() => {
              const aNames = new Set(recipeA.ingredients.map((i) => i.name));
              const bNames = new Set(recipeB.ingredients.map((i) => i.name));
              const common = [...aNames].filter((n) => bNames.has(n));
              if (common.length > 0) {
                return (
                  <div className="border-t border-amber-100 dark:border-stone-700 p-3">
                    <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mb-1">共同食材 ({common.length}种)</p>
                    <div className="flex flex-wrap gap-1">
                      {common.map((name) => (
                        <span key={name} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 rounded text-xs">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>

      {/* 选择弹窗A */}
      {showPickerA && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowPickerA(false)}>
          <div className="bg-white dark:bg-stone-800 rounded-t-2xl w-full max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 pt-4 pb-2 border-b border-amber-100 dark:border-stone-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-amber-900 dark:text-stone-100">选择菜谱A</h3>
                <button onClick={() => setShowPickerA(false)}><X className="w-5 h-5 text-amber-400 dark:text-stone-400" /></button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder="搜索菜谱..."
                  className="w-full pl-9 pr-4 py-2.5 bg-amber-50 dark:bg-stone-700 rounded-lg text-sm text-amber-900 dark:text-stone-100 placeholder-amber-400 dark:placeholder-stone-400 outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {filteredA.slice(0, 30).map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => { setRecipeA(recipe); setShowPickerA(false); setSearchA(''); }}
                  className="w-full flex items-center gap-3 py-3 border-b border-amber-50 dark:border-stone-700 text-left hover:bg-amber-50 dark:hover:bg-stone-700 px-2 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-500 dark:text-orange-300">{recipe.name[0]}</span>
                  </div>
                  <span className="text-sm text-amber-900 dark:text-stone-100">{recipe.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 选择弹窗B */}
      {showPickerB && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowPickerB(false)}>
          <div className="bg-white dark:bg-stone-800 rounded-t-2xl w-full max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 pt-4 pb-2 border-b border-amber-100 dark:border-stone-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-amber-900 dark:text-stone-100">选择菜谱B</h3>
                <button onClick={() => setShowPickerB(false)}><X className="w-5 h-5 text-amber-400 dark:text-stone-400" /></button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="搜索菜谱..."
                  className="w-full pl-9 pr-4 py-2.5 bg-amber-50 dark:bg-stone-700 rounded-lg text-sm text-amber-900 dark:text-stone-100 placeholder-amber-400 dark:placeholder-stone-400 outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {filteredB.slice(0, 30).map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => { setRecipeB(recipe); setShowPickerB(false); setSearchB(''); }}
                  className="w-full flex items-center gap-3 py-3 border-b border-amber-50 dark:border-stone-700 text-left hover:bg-amber-50 dark:hover:bg-stone-700 px-2 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-500 dark:text-orange-300">{recipe.name[0]}</span>
                  </div>
                  <span className="text-sm text-amber-900 dark:text-stone-100">{recipe.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
