import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { UserIcon } from './icons/UserIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { UploadIcon } from './icons/UploadIcon';
import { BellIcon as DashboardIcon } from './icons/DashboardIcon';


type NavView = 'home' | 'search' | 'wishlist' | 'profile' | 'upload' | 'admin-dashboard';

interface BottomNavigationProps {
  role: 'user' | 'admin';
  activeView: string;
  onViewChange: (view: NavView) => void;
}

const userNavItems: { id: NavView; label: string; icon: React.FC<any> }[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'wishlist', label: 'Wishlist', icon: BookmarkIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

const adminNavItems: { id: NavView; label: string; icon: React.FC<any> }[] = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'upload', label: 'Upload', icon: UploadIcon },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ role, activeView, onViewChange }) => {
  const navItems = role === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/70 dark:bg-black/50 backdrop-blur-lg rounded-t-3xl z-50">
      <div className="h-full flex justify-around items-center pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (activeView === 'home' && item.id === 'admin-dashboard');
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-20 h-full text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-yellow-500' : 'text-slate-600 dark:text-slate-400 hover:text-yellow-500'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
    </nav>
  );
};

export default BottomNavigation;
