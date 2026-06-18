import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import RecipeCard from '@/components/RecipeCard';
import Empty from '@/components/Empty';

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const {
    searchResults,
    isSearching,
    searchFilters,
    searchRecipes,
    setSearchFilters,
    resetSearchFilters,
  } = useRecipeStore();

  useEffect(() => {
    if (keyword) {
      searchRecipes(keyword);
    }
  }, [keyword, searchRecipes]);

  const filteredResults = useMemo(() => {
    let results = searchResults;
    if (searchFilters.category) {
      results = results.filter((r) => r.category === searchFilters.category || r.scene === searchFilters.category);
    }
    if (searchFilters.difficulty) {
      results = results.filter((r) => r.difficulty === searchFilters.difficulty);
    }
    if (searchFilters.duration) {
      results = results.filter((r) => r.duration === searchFilters.duration);
    }
    return results;
  }, [searchResults, searchFilters]);

  const handleSearch = (kw: string) => {
    navigate(`/search?keyword=${encodeURIComponent(kw)}`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white border-b border-amber-100 px-4 pt-10 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="shrink-0">
            <ArrowLeft className="w-5 h-5 text-amber-700" />
          </button>
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} defaultValue={keyword} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* 筛选栏 */}
        <FilterBar filters={searchFilters} onChange={setSearchFilters} onReset={resetSearchFilters} />

        {/* 搜索结果 */}
        {isSearching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 bg-white rounded-xl p-3 border border-amber-100 animate-pulse">
                <div className="w-24 h-24 shrink-0 rounded-lg bg-amber-100" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-amber-100 rounded w-3/4" />
                  <div className="h-3 bg-amber-100 rounded w-1/2" />
                  <div className="h-3 bg-amber-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="space-y-3">
            {filteredResults.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} layout="list" />
            ))}
          </div>
        ) : (
          keyword && <Empty message={`未找到"${keyword}"相关菜谱`} />
        )}
      </div>
    </div>
  );
}
