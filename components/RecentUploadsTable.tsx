
import React, { useMemo } from 'react';
import { ContentItem } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface RecentUploadsTableProps {
  items: ContentItem[];
  onDeleteContent: (id: number) => void;
  onEditContent: (id: number) => void;
}

export const RecentUploadsTable: React.FC<RecentUploadsTableProps> = ({ items, onDeleteContent, onEditContent }) => {
    
  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime())
      .slice(0, 5);
  }, [items]);

  const handleEditClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    onEditContent(id);
  };

  const handleDeleteClick = (e: React.MouseEvent, itemToDelete: ContentItem) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${itemToDelete.title}"? This action is temporary for this session.`)) {
      onDeleteContent(itemToDelete.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-800/50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3 hidden md:table-cell">
              Genre
            </th>
            <th scope="col" className="px-6 py-3 hidden sm:table-cell">
              Rating
            </th>
            <th scope="col" className="px-6 py-3 hidden lg:table-cell">
              Date Added
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {recentItems.map((item) => (
            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                {item.title}
              </th>
              <td className="px-6 py-4 hidden md:table-cell">{item.genres.join(', ')}</td>
              <td className="px-6 py-4 hidden sm:table-cell">{item.rating.toFixed(1)}</td>
              <td className="px-6 py-4 hidden lg:table-cell">
                {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end items-center gap-4">
                     <button type="button" onClick={(e) => handleEditClick(e, item.id)} className="font-medium text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        <EditIcon className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={(e) => handleDeleteClick(e, item)} className="font-medium text-pink-600 hover:text-pink-500 dark:text-pink-500 dark:hover:text-pink-400 transition-colors">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
