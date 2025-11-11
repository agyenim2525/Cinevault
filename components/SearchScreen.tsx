import React, { useState, useMemo } from 'react';
import { ContentItem } from '../types';
import { PopularMovieCard } from '../App'; 
import { SearchIcon } from './icons/SearchIcon';

interface SearchScreenProps {
  items: ContentItem[];
  onContentSelect: (id: number) => void;
  wishlistIds: Set<number>;
  onToggleWishlist: (id: number) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ items, onContentSelect, wishlistIds, onToggleWishlist }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return items;
    }
    return items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, items]);

  return (
    <div className="pt-4">
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for movies or shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-200 dark:bg-slate-800 border border-transparent focus:border-yellow-500 focus:ring-yellow-500 rounded-full text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
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
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-600 dark:text-slate-400">No content found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
