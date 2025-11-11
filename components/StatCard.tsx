import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  iconClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, iconClassName }) => {
  return (
    <div className={`relative p-6 rounded-xl overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none transition-transform transform hover:-translate-y-1`}>
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${color}`}></div>
      <div className="flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br ${color} ${iconClassName} shadow-lg`}>
            {icon}
        </div>
      </div>
    </div>
  );
};