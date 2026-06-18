import { CATEGORIES } from '@/types/recipe';

interface CategoryNavProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryNav({ selected, onChange }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
            selected === cat.key
              ? 'bg-orange-500 text-white'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
