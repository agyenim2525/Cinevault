import React, { useState } from 'react';
import { Episode } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { CheckIcon } from './icons/CheckIcon';

type AuthState = 'unauthenticated' | 'user' | 'admin';

const EpisodeItem: React.FC<{ 
    episode: Episode, 
    onPlay: (url: string, title: string) => void, 
    onEpisodeDownloaded: (episodeId: string) => void,
    authState: AuthState,
    onRequestLogin: () => void,
}> = ({ episode, onPlay, onEpisodeDownloaded, authState, onRequestLogin }) => {
    const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');

    const handleDownloadClick = async () => {
        if (authState === 'unauthenticated') {
            onRequestLogin();
            return;
        }

        if (downloadState !== 'idle' || !episode.fileUrl || !episode.fileName) return;

        setDownloadState('downloading');

        try {
            const response = await fetch(episode.fileUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const chunks: Uint8Array[] = [];
            const reader = response.body?.getReader();
            if (!reader) throw new Error("Could not read response body");

            // eslint-disable-next-line no-constant-condition
            while(true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = episode.fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            setDownloadState('downloaded');
            onEpisodeDownloaded(episode.id);

        } catch (error) {
            console.error("Episode download failed:", error);
            setDownloadState('idle');
            alert("Download failed. Please try again.");
        }
    };

    const handlePlayClick = () => {
        if (authState === 'unauthenticated') {
            onRequestLogin();
            return;
        }
        if (episode.fileUrl) {
            onPlay(episode.fileUrl, episode.title);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
            <div>
                <p className="font-semibold text-slate-800 dark:text-white">{episode.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{episode.duration}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={handlePlayClick}
                    disabled={!episode.fileUrl}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-300 dark:bg-slate-700 rounded-full font-semibold text-sm hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PlayIcon className="w-4 h-4" />
                    <span>Play</span>
                </button>
                <button
                    onClick={handleDownloadClick}
                    disabled={downloadState !== 'idle' || !episode.fileUrl}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Download episode"
                >
                    {downloadState === 'idle' && <DownloadIcon className="w-5 h-5" />}
                    {downloadState === 'downloading' && <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>}
                    {downloadState === 'downloaded' && <CheckIcon className="w-5 h-5 text-green-500" />}
                </button>
            </div>
        </div>
    );
};

export default EpisodeItem;
