import React from 'react';
import { ContentItem } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface DownloadHistoryTableProps {
  items: ContentItem[];
}

export const DownloadHistoryTable: React.FC<DownloadHistoryTableProps> = ({ items }) => {

  if (items.length === 0) {
      return <div className="text-center text-slate-500 dark:text-slate-400 py-10">You haven't downloaded any content yet.</div>;
  }

  return (
    <div className="overflow-x-auto max-h-96">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase bg-slate-200 dark:bg-slate-700/50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3 hidden sm:table-cell">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/30">
              <th scope="row" className="px-6 py-4 font-medium text-slate-800 dark:text-white whitespace-nowrap">
                {item.title}
              </th>
              <td className="px-6 py-4 hidden sm:table-cell text-slate-600 dark:text-slate-400 capitalize">{item.type}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <CheckIcon className="w-3 h-3"/>
                  Downloaded
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
