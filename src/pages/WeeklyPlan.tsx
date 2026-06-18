import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Shuffle, Trash2, X, Check, GripVertical } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import * as storage from '@/services/storage';
import type { WeekMeal, Recipe } from '@/types/recipe';
import BottomNav from '@/components/BottomNav';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const MEALS: { key: WeekMeal['meal']; label: string }[] = [
  { key: 'breakfast', label: '早餐' },
  { key: 'lunch', label: '午餐' },
  { key: 'dinner', label: '晚餐' },
];

export default function WeeklyPlan() {
  const navigate = useNavigate();
  const { getAllRecipes } = useRecipeStore();
  const [plan, setPlan] = useState<WeekMeal[]>([]);
  const [showPicker, setShowPicker] = useState<{ day: number; meal: WeekMeal['meal'] } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [dragItem, setDragItem] = useState<{ day: number; meal: WeekMeal['meal'] } | null>(null);

  const allRecipes = getAllRecipes();

  useEffect(() => {
    setPlan(storage.getWeeklyPlan());
  }, []);

  const savePlan = useCallback((newPlan: WeekMeal[]) => {
    setPlan(newPlan);
    storage.setWeeklyPlan(newPlan);
  }, []);

  const getMeal = (day: number, meal: WeekMeal['meal']) => {
    return plan.find((m) => m.day === day && m.meal === meal);
  };

  const addMeal = (day: number, meal: WeekMeal['meal'], recipe: Recipe) => {
    const newPlan = plan.filter((m) => !(m.day === day && m.meal === meal));
    newPlan.push({ day, meal, recipeId: recipe.id, recipeName: recipe.name });
    savePlan(newPlan);
    setShowPicker(null);
    setSearchText('');
  };

  const removeMeal = (day: number, meal: WeekMeal['meal']) => {
    savePlan(plan.filter((m) => !(m.day === day && m.meal === meal)));
  };

  const randomFill = () => {
    const newPlan: WeekMeal[] = [];
    for (let day = 0; day < 7; day++) {
      for (const meal of MEALS) {
        const recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
        newPlan.push({ day, meal: meal.key, recipeId: recipe.id, recipeName: recipe.name });
      }
    }
    savePlan(newPlan);
  };

  const clearPlan = () => {
    savePlan([]);
  };

  const handleDragStart = (day: number, meal: WeekMeal['meal']) => {
    setDragItem({ day, meal });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDay: number, targetMeal: WeekMeal['meal']) => {
    if (!dragItem) return;
    const sourceMeal = getMeal(dragItem.day, dragItem.meal);
    const targetMealData = getMeal(targetDay, targetMeal);

    const newPlan = plan.filter(
      (m) => !(m.day === dragItem.day && m.meal === dragItem.meal) && !(m.day === targetDay && m.meal === targetMeal)
    );

    if (sourceMeal) {
      newPlan.push({ day: targetDay, meal: targetMeal, recipeId: sourceMeal.recipeId, recipeName: sourceMeal.recipeName });
    }
    if (targetMealData) {
      newPlan.push({ day: dragItem.day, meal: dragItem.meal, recipeId: targetMealData.recipeId, recipeName: targetMealData.recipeName });
    }

    savePlan(newPlan);
    setDragItem(null);
  };

  // 统计
  const totalMeals = plan.length;
  const meatCount = plan.filter((m) => {
    const recipe = allRecipes.find((r) => r.id === m.recipeId);
    return recipe?.category === 'meat_dish';
  }).length;
  const vegCount = plan.filter((m) => {
    const recipe = allRecipes.find((r) => r.id === m.recipeId);
    return recipe?.category === 'vegetable_dish';
  }).length;

  const filteredRecipes = searchText
    ? allRecipes.filter((r) => r.name.includes(searchText))
    : allRecipes;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部导航 */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">周菜单规划</h1>
        </div>
        <p className="text-orange-100 text-sm">规划你的一周三餐</p>
      </div>

      {/* 统计栏 */}
      <div className="px-4 mt-4">
        <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700 flex items-center justify-around">
          <div className="text-center">
            <p className="text-lg font-bold text-orange-500">{totalMeals}</p>
            <p className="text-xs text-amber-600 dark:text-stone-400">总菜谱</p>
          </div>
          <div className="w-px h-8 bg-amber-100 dark:bg-stone-700" />
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{meatCount}</p>
            <p className="text-xs text-amber-600 dark:text-stone-400">荤菜</p>
          </div>
          <div className="w-px h-8 bg-amber-100 dark:bg-stone-700" />
          <div className="text-center">
            <p className="text-lg font-bold text-green-500">{vegCount}</p>
            <p className="text-xs text-amber-600 dark:text-stone-400">素菜</p>
          </div>
          <div className="w-px h-8 bg-amber-100 dark:bg-stone-700" />
          <div className="text-center">
            <p className="text-lg font-bold text-amber-500">{totalMeals - meatCount - vegCount}</p>
            <p className="text-xs text-amber-600 dark:text-stone-400">其他</p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="px-4 mt-3 flex gap-2">
        <button
          onClick={randomFill}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          随机填充
        </button>
        <button
          onClick={clearPlan}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-amber-200 dark:hover:bg-stone-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          清空菜单
        </button>
      </div>

      {/* 周菜单网格 */}
      <div className="px-4 mt-4 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* 表头 */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-amber-500 dark:text-stone-400 text-center py-1" />
            {DAYS.map((day) => (
              <div key={day} className="text-xs text-amber-700 dark:text-stone-300 text-center font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          {/* 每餐行 */}
          {MEALS.map(({ key, label }) => (
            <div key={key} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-xs text-amber-600 dark:text-stone-400 text-center flex items-center justify-center font-medium">
                {label}
              </div>
              {DAYS.map((_, dayIdx) => {
                const meal = getMeal(dayIdx, key);
                return (
                  <div
                    key={dayIdx}
                    draggable={!!meal}
                    onDragStart={() => handleDragStart(dayIdx, key)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(dayIdx, key)}
                    onClick={() => setShowPicker({ day: dayIdx, meal: key })}
                    className={`min-h-[60px] rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      meal
                        ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
                        : 'bg-white dark:bg-stone-800 border-amber-100 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-700'
                    } ${dragItem?.day === dayIdx && dragItem?.meal === key ? 'opacity-50' : ''}`}
                  >
                    {meal ? (
                      <div className="relative w-full px-1">
                        <GripVertical className="w-3 h-3 text-amber-300 dark:text-stone-500 absolute top-0 left-0" />
                        <p className="text-xs text-amber-900 dark:text-stone-200 truncate font-medium mt-1">{meal.recipeName}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMeal(dayIdx, key);
                          }}
                          className="absolute -top-1 -right-1"
                        >
                          <X className="w-3 h-3 text-amber-400 dark:text-stone-500 hover:text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <Plus className="w-4 h-4 text-amber-300 dark:text-stone-600" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 菜谱选择弹窗 */}
      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => { setShowPicker(null); setSearchText(''); }}>
          <div
            className="bg-white dark:bg-stone-800 rounded-t-2xl w-full max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-4 pb-2 border-b border-amber-100 dark:border-stone-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-amber-900 dark:text-stone-100">
                  选择菜谱 - {DAYS[showPicker.day]} {MEALS.find((m) => m.key === showPicker.meal)?.label}
                </h3>
                <button onClick={() => { setShowPicker(null); setSearchText(''); }}>
                  <X className="w-5 h-5 text-amber-400 dark:text-stone-400" />
                </button>
              </div>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索菜谱..."
                className="w-full px-4 py-2.5 bg-amber-50 dark:bg-stone-700 rounded-lg text-sm text-amber-900 dark:text-stone-100 placeholder-amber-400 dark:placeholder-stone-400 outline-none"
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => addMeal(showPicker.day, showPicker.meal, recipe)}
                  className="w-full flex items-center gap-3 py-3 border-b border-amber-50 dark:border-stone-700 text-left hover:bg-amber-50 dark:hover:bg-stone-700 rounded-lg px-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-900 dark:to-stone-700 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-orange-500 dark:text-orange-300">{recipe.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900 dark:text-stone-100 truncate">{recipe.name}</p>
                    <p className="text-xs text-amber-500 dark:text-stone-400">{recipe.difficulty} · {recipe.duration}</p>
                  </div>
                  {getMeal(showPicker.day, showPicker.meal)?.recipeId === recipe.id && (
                    <Check className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
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
