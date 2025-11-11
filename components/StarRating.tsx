import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  count?: number;
  value: number; // The user's current rating for this movie (0 if not rated)
  onRate: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ count = 10, value, onRate, readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onRate(rating);
    }
  };

  const handleMouseOver = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      {stars.map((starValue) => (
        <span
          key={starValue}
          className={`cursor-pointer transition-colors ${readOnly ? 'cursor-default' : 'hover:text-yellow-300'}`}
          onClick={() => handleClick(starValue)}
          onMouseOver={() => handleMouseOver(starValue)}
        >
          <StarIcon 
            className={`w-6 h-6 ${(hoverValue || value) >= starValue ? 'text-yellow-400' : 'text-slate-500 dark:text-slate-600'}`}
          />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
