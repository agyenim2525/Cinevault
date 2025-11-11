import React from 'react';
import { ContentItem } from '../types';

interface WatchHistoryCardProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
}

export const WatchHistoryCard: React.FC<WatchHistoryCardProps> = ({ item, onClick }) => {
  return (
    <div 
        className="flex-shrink-0 w-64 group cursor-pointer"
        onClick={() => onClick(item)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105">
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
           <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">{item.genres.join(', ')}</p>
      </div>
    </div>
  );
};
