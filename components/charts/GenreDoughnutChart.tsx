import React, { useMemo } from 'react';
import { ContentItem } from '../../types';

interface GenreDoughnutChartProps {
  items: ContentItem[];
}

const COLORS = ['#E5097F', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'];

export const GenreDoughnutChart: React.FC<GenreDoughnutChartProps> = ({ items }) => {
  const genreData = useMemo(() => {
    // FIX: Using a generic type argument on `reduce` correctly types the accumulator,
    // which resolves downstream type inference issues with the `.sort()` method.
    const genreCounts = items.reduce<Record<string, number>>((acc, item) => {
      if (item.genres) {
        item.genres.forEach(genre => {
            acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {});

    return Object.entries(genreCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value);
  }, [items]);

  if (genreData.length === 0) {
      return <div className="text-center text-slate-500 dark:text-slate-400 py-10">No content data to display.</div>;
  }

  const total = genreData.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="transform -rotate-90">
                {genreData.map((genre, index) => {
                const percentage = (genre.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulative;
                cumulative += percentage;

                return (
                    <circle
                    key={genre.name}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="transparent"
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    />
                );
                })}
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Items</span>
            </div>
        </div>
        <div className="w-full md:w-auto">
            <ul className="space-y-2 text-sm">
                {genreData.map((genre, index) => (
                <li key={genre.name} className="flex items-center">
                    <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-slate-700 dark:text-slate-300">{genre.name}</span>
                    <span className="ml-auto font-medium text-slate-900 dark:text-white">{genre.value}</span>
                </li>
                ))}
            </ul>
        </div>
    </div>
  );
};
