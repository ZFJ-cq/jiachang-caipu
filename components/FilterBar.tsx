import { DIFFICULTIES, DURATIONS, CATEGORIES } from '@/types/recipe';
import type { SearchFilters } from '@/types/recipe';

interface FilterBarProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const hasFilter = filters.category || filters.difficulty || filters.duration;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <select
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
        className="shrink-0 px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-sm text-amber-700 focus:outline-none focus:border-orange-400"
      >
        <option value="">全部菜系</option>
        {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
          <option key={c.key} value={c.key}>{c.label}</option>
        ))}
      </select>
      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ difficulty: e.target.value })}
        className="shrink-0 px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-sm text-amber-700 focus:outline-none focus:border-orange-400"
      >
        {DIFFICULTIES.map((d) => (
          <option key={d.key} value={d.key}>{d.label}</option>
        ))}
      </select>
      <select
        value={filters.duration}
        onChange={(e) => onChange({ duration: e.target.value })}
        className="shrink-0 px-3 py-1.5 bg-white rounded-xl border border-amber-200 text-sm text-amber-700 focus:outline-none focus:border-orange-400"
      >
        {DURATIONS.map((d) => (
          <option key={d.key} value={d.key}>{d.label}</option>
        ))}
      </select>
      {hasFilter && (
        <button
          onClick={onReset}
          className="shrink-0 px-3 py-1.5 text-sm text-orange-500 hover:text-orange-600"
        >
          重置
        </button>
      )}
    </div>
  );
}
