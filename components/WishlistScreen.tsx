import React from 'react';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ContentItem } from '../types';
import { PopularMovieCard } from '../App';

interface WishlistScreenProps {
    items: ContentItem[];
    wishlistIds: Set<number>;
    onContentSelect: (id: number) => void;
    onToggleWishlist: (id: number) => void;
}

const WishlistScreen: React.FC<WishlistScreenProps> = ({ items, wishlistIds, onContentSelect, onToggleWishlist }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center pt-16">
        <BookmarkIcon className="w-20 h-20 text-yellow-500/50 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your Wishlist is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
          Tap the bookmark icon on a movie or show to save it here for later.
        </p>
      </div>
    );
  }

  return (
     <div className="pt-4 space-y-2">
        {items.map(item => (
          <PopularMovieCard 
            key={item.id} 
            item={item} 
            onClick={() => onContentSelect(item.id)}
            isInWishlist={wishlistIds.has(item.id)}
            onToggleWishlist={(e) => {
                e.stopPropagation();
                onToggleWishlist(item.id);
            }}
          />
        ))}
      </div>
  )
};

export default WishlistScreen;
