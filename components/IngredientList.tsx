import type { Ingredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-amber-100">
      <h3 className="font-bold text-amber-900 text-base mb-3">食材清单</h3>
      <div className="space-y-2">
        {ingredients.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1.5 border-b border-amber-50 last:border-0">
            <span className="text-amber-800 text-sm">{item.name}</span>
            <span className="text-amber-500 text-sm">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
