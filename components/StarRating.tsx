import { useState } from 'react';
import { Star } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';

interface StarRatingProps {
  recipeId: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export default function StarRating({ recipeId, size = 'md' }: StarRatingProps) {
  const { getRating, setRating } = useRecipeStore();
  const currentRating = getRating(recipeId);
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || currentRating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(recipeId, star)}
          className="transition-transform active:scale-90"
        >
          <Star
            className={`${SIZE_MAP[size]} ${
              star <= displayRating
                ? 'fill-orange-400 text-orange-400'
                : 'text-amber-200'
            } transition-colors`}
          />
        </button>
      ))}
      {currentRating > 0 && (
        <span className="text-sm text-amber-500 ml-1">{currentRating}星</span>
      )}
    </div>
  );
}
