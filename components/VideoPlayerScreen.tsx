
import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface VideoPlayerScreenProps {
  url: string;
  title: string;
  onBack: () => void;
}

const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({ url, title, onBack }) => {
  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between bg-black/50 z-10 absolute top-0 left-0 right-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold truncate px-4">{title}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>
      <main className="flex-grow flex items-center justify-center">
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full max-h-full max-w-full"
        >
          Your browser does not support the video tag.
        </video>
      </main>
    </div>
  );
};

export default VideoPlayerScreen;
