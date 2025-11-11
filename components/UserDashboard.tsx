
import React, { useMemo } from 'react';
import { ContentItem, User, UserProfileUpdateData } from '../types';
import { StatCard } from './StatCard';
import { DownloadIcon } from './icons/DownloadIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WatchHistoryCard } from './WatchHistoryCard';
import { DownloadHistoryTable } from './DownloadHistoryTable';
import { ProfileSettings } from './ProfileSettings';
import { HeartIcon } from './icons/HeartIcon';
import { PopularMovieCard } from '../App';


interface UserDashboardProps {
  contentItems: ContentItem[];
  watchHistory: ContentItem[];
  downloadHistory: ContentItem[];
  onContentClick: (item: ContentItem) => void;
  currentUser: User | null;
  wishlistIds: Set<number>;
  onToggleWishlist: (id: number) => void;
  onUpdateProfile: (data: UserProfileUpdateData) => Promise<boolean>;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ contentItems, watchHistory, downloadHistory, onContentClick, currentUser, wishlistIds, onToggleWishlist, onUpdateProfile }) => {

    const recommendations = useMemo(() => {
        if (watchHistory.length === 0) {
            return contentItems.slice(0, 5); // Show first 5 items if no history
        }
        const watchedGenres = watchHistory.reduce((acc, item) => {
            item.genres.forEach(genre => {
              acc[genre] = (acc[genre] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        const favoriteGenre = Object.keys(watchedGenres).sort((a,b) => watchedGenres[b] - watchedGenres[a])[0];
        
        const watchedIds = new Set(watchHistory.map(m => m.id));

        return contentItems
            .filter(m => !watchedIds.has(m.id))
            .filter(m => m.genres.includes(favoriteGenre))
            .slice(0, 5);
    }, [contentItems, watchHistory]);

  return (
    <div className="space-y-12 pt-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
            icon={<CheckIcon className="h-6 w-6 text-white" />}
            title="Content Watched"
            value={watchHistory.length.toString()}
            color="from-pink-500 to-orange-500"
        />
        <StatCard 
            icon={<DownloadIcon className="h-6 w-6 text-white" />}
            title="Content Downloaded"
            value={downloadHistory.length.toString()}
            color="from-green-400 to-emerald-600"
        />
        <StatCard 
            icon={<ClockIcon className="h-6 w-6 text-white" />}
            title="Time Watched"
            value={`${(watchHistory.length * 2.1).toFixed(1)} hrs`}
            color="from-purple-500 to-indigo-500"
        />
      </div>

       {/* Continue Watching */}
        {watchHistory.length > 0 && (
            <div>
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Continue Watching</h2>
                 <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 custom-scrollbar">
                    {watchHistory.map(item => (
                        <WatchHistoryCard key={item.id} item={item} onClick={onContentClick} />
                    ))}
                 </div>
            </div>
        )}

        {/* Recommended For You */}
        {recommendations.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <HeartIcon className="w-6 h-6 text-yellow-400" /> Recommended For You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     {recommendations.map((item) => (
                        <PopularMovieCard 
                            key={item.id} 
                            item={item} 
                            onClick={() => onContentClick(item)} 
                            isInWishlist={wishlistIds.has(item.id)}
                            onToggleWishlist={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(item.id);
                            }}
                        />
                    ))}
                </div>
            </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Download History */}
            <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Downloads</h3>
                <DownloadHistoryTable items={downloadHistory} />
            </div>

            {/* Profile Settings */}
            <div className="bg-slate-200 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Profile Settings</h3>
                <ProfileSettings user={currentUser} onSave={onUpdateProfile} />
            </div>
        </div>
    </div>
  );
};

export default UserDashboard;
