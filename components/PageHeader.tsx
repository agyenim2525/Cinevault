import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  onLogout?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, onLogout }) => {
  return (
    <header className="px-4 py-4 flex items-center justify-between sticky top-0 bg-slate-100/80 dark:bg-[#1F222A]/80 backdrop-blur-md z-40">
      <button onClick={onBack} className="p-2 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800">
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>
      <div className="w-10">
        {onLogout && (
          <button onClick={onLogout} className="p-2 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800">
            <LogoutIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
