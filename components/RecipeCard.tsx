import { useNavigate } from 'react-router-dom';
import { Clock, Flame, Heart } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useRecipeStore } from '@/store/recipeStore';

interface RecipeCardProps {
  recipe: Recipe;
  layout?: 'grid' | 'list';
}

export default function RecipeCard({ recipe, layout = 'grid' }: RecipeCardProps) {
  const navigate = useNavigate();
  const favorites = useRecipeStore((s) => s.favorites);
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);
  const isFav = favorites.some((f) => f.id === recipe.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  const coverSrc = recipe.coverImage || recipe.image;

  if (layout === 'list') {
    return (
      <div
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="flex gap-3 bg-white rounded-xl p-3 border border-amber-100 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center">
          {coverSrc ? (
            <img src={coverSrc} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-orange-500">{recipe.name[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-amber-900 text-base truncate">{recipe.name}</h3>
            <button onClick={handleFavorite} className="shrink-0 ml-2">
              <Heart className={`w-5 h-5 ${isFav ? 'fill-green-500 text-green-500' : 'text-amber-300'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-amber-600">
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md">{recipe.difficulty}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.duration}
            </span>
            {recipe.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {recipe.calories}
              </span>
            )}
          </div>
          <p className="text-xs text-amber-500 mt-1.5 truncate">
            {recipe.ingredients.slice(0, 3).map((i) => i.name).join('、')}
            {recipe.ingredients.length > 3 ? '...' : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-xl overflow-hidden border border-amber-100 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center relative">
        {coverSrc ? (
          <img src={coverSrc} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl font-bold text-orange-500">{recipe.name[0]}</span>
        )}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-green-500 text-green-500' : 'text-amber-400'}`} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-amber-900 text-sm truncate">{recipe.name}</h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-600">
          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-md">{recipe.difficulty}</span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {recipe.duration}
          </span>
        </div>
      </div>
    </div>
  );
}
