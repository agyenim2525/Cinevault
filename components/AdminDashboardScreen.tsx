import React from 'react';
import { ContentItem } from '../types';
import { StatCard } from './StatCard';
import { FilmIcon } from './icons/FilmIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { StorageIcon } from './icons/StorageIcon';
import { StarIcon } from './icons/StarIcon';
import { GenreDoughnutChart } from './charts/GenreDoughnutChart';
import { UploadsBarChart } from './charts/UploadsBarChart';
import { RecentUploadsTable } from './RecentUploadsTable';

interface AdminDashboardScreenProps {
  contentItems: ContentItem[];
  onDeleteContent: (id: number) => void;
  onEditContent: (id: number) => void;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ contentItems, onDeleteContent, onEditContent }) => {
    
    const stats = React.useMemo(() => {
        const totalContent = contentItems.length;
        const totalDownloads = contentItems.reduce((acc, item) => acc + Math.floor(item.rating * 1000 + item.id), 0);
        const totalStorage = contentItems.reduce((acc, item) => {
            let itemSize = 0;
            if (item.type === 'movie' && item.fileSize) {
                const [size, unit] = item.fileSize.split(' ');
                itemSize = unit === 'MB' ? parseFloat(size) / 1024 : parseFloat(size);
            } else if (item.type === 'show') {
                item.seasons.forEach(s => {
                    s.episodes.forEach(ep => {
                        if (ep.fileSize) {
                            const [size, unit] = ep.fileSize.split(' ');
                            const sizeInGB = unit === 'MB' ? parseFloat(size) / 1024 : parseFloat(size);
                            if (!isNaN(sizeInGB)) itemSize += sizeInGB;
                        }
                    })
                })
            }
            return acc + (isNaN(itemSize) ? 0 : itemSize);
        }, 0);
        const averageRating = totalContent > 0 ? contentItems.reduce((acc, item) => acc + item.rating, 0) / totalContent : 0;

        return { totalContent, totalDownloads, totalStorage, averageRating };
    }, [contentItems]);


  return (
    <div className="space-y-8 pt-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={<FilmIcon className="h-6 w-6 text-white" />}
            title="Total Content"
            value={stats.totalContent.toString()}
            color="from-pink-500 to-orange-500"
        />
        <StatCard 
            icon={<DownloadIcon className="h-6 w-6 text-white" />}
            title="Total Downloads"
            value={stats.totalDownloads.toLocaleString()}
            color="from-green-400 to-emerald-600"
        />
        <StatCard 
            icon={<StorageIcon className="h-6 w-6 text-white" />}
            title="Storage Used"
            value={`${stats.totalStorage.toFixed(2)} GB`}
            color="from-purple-500 to-indigo-500"
        />
        <StatCard 
            icon={<StarIcon className="h-6 w-6 text-white" />}
            title="Average Rating"
            value={stats.averageRating.toFixed(2)}
            color="from-yellow-400 to-amber-600"
        />
      </div>

      {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Content by Genre</h3>
                <GenreDoughnutChart items={contentItems} />
            </div>
            <div className="lg:col-span-3 bg-slate-200 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Monthly Uploads</h3>
                <UploadsBarChart items={contentItems} />
            </div>
       </div>

        {/* Recent Uploads Table */}
        <div className="bg-slate-200 dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Uploads</h3>
            <RecentUploadsTable items={contentItems} onDeleteContent={onDeleteContent} onEditContent={onEditContent} />
        </div>
    </div>
  );
};

export default AdminDashboardScreen;
