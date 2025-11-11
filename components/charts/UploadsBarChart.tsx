import React, { useMemo } from 'react';
import { ContentItem } from '../../types';

interface UploadsBarChartProps {
  items: ContentItem[];
}

export const UploadsBarChart: React.FC<UploadsBarChartProps> = ({ items }) => {
  const monthlyData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const counts = Array(12).fill(0);
    
    items.forEach(item => {
        if (item.uploadDate) {
            const uploadDate = new Date(item.uploadDate);
            if (uploadDate.getFullYear() === currentYear) {
                const month = uploadDate.getMonth();
                counts[month]++;
            }
        }
    });

    return monthNames.map((name, index) => ({ name, value: counts[index] }));
  }, [items]);

  const maxValue = Math.max(...monthlyData.map(d => d.value), 1);

  return (
    <div className="w-full h-56 flex items-end justify-between gap-2 pt-4">
        {monthlyData.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full group">
                <div className="relative w-full h-full flex items-end">
                    <div
                        className="w-full bg-pink-600/50 group-hover:bg-pink-600 rounded-t-sm transition-all duration-500 ease-out"
                        style={{ height: `${(month.value / maxValue) * 100}%` }}
                        title={`${month.name}: ${month.value} uploads`}
                    ></div>
                </div>
                 <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{month.name}</span>
            </div>
        ))}
    </div>
  );
};
