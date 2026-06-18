import { useEffect } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import BottomNav from '@/components/BottomNav';
import type { ShoppingItem } from '@/types/recipe';

const CATEGORY_LABELS: Record<ShoppingItem['category'], string> = {
  vegetable: '蔬菜',
  meat: '肉类',
  seafood: '水产',
  seasoning: '调料',
  other: '其他',
};

const CATEGORY_ORDER: ShoppingItem['category'][] = ['vegetable', 'meat', 'seafood', 'seasoning', 'other'];

export default function ShoppingList() {
  const { shoppingList, loadShoppingList, toggleShoppingItem, removeShoppingItem, clearCheckedItems } = useRecipeStore();

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = shoppingList.filter((i) => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const checkedCount = shoppingList.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-amber-100 px-4 pt-10 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-900">购物清单</h1>
        {checkedCount > 0 && (
          <button
            onClick={clearCheckedItems}
            className="flex items-center gap-1 text-sm text-red-500 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            清空已购({checkedCount})
          </button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-full bg-amber-50 p-4">
            <ShoppingCart className="h-10 w-10 text-orange-400" />
          </div>
          <p className="text-sm text-amber-400">购物清单为空</p>
          <p className="text-xs text-amber-300 mt-1">在菜谱详情页添加食材到购物清单</p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat];
            if (!items) return null;
            return (
              <div key={cat} className="bg-white rounded-xl border border-amber-100 overflow-hidden">
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <span className="text-sm font-bold text-amber-700">
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="text-xs text-amber-400 ml-2">({items.length})</span>
                </div>
                <div className="divide-y divide-amber-50">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <button
                        onClick={() => toggleShoppingItem(item.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          item.checked
                            ? 'bg-green-500 border-green-500'
                            : 'border-amber-300'
                        }`}
                      >
                        {item.checked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${item.checked ? 'line-through text-amber-300' : 'text-amber-900'}`}>
                          {item.name}
                        </span>
                        <span className={`text-xs ml-2 ${item.checked ? 'line-through text-amber-200' : 'text-amber-500'}`}>
                          {item.amount}
                        </span>
                      </div>
                      <span className="text-xs text-amber-300 shrink-0">{item.fromRecipe}</span>
                      <button
                        onClick={() => removeShoppingItem(item.id)}
                        className="shrink-0 p-1 text-amber-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
