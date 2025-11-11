
import React, { useState, useRef, useEffect } from 'react';
// FIX: Use specific ContentUploadData type to resolve ambiguity with discriminated unions.
import type { ContentItem, Season, Episode, ContentUploadData } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { FilmIcon } from './icons/FilmIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

// FIX: Change prop type to use the more specific ContentUploadData.
interface UploadFormProps {
  onSave: (contentData: ContentUploadData, existingId?: number) => void;
  contentToEdit: ContentItem | null;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSave, contentToEdit }) => {
  const [contentType, setContentType] = useState<'movie' | 'show'>('movie');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [movieFile, setMovieFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [movieFileUrl, setMovieFileUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState('2h 0m');
  const [genres, setGenres] = useState('Action, Adventure');
  const [seasons, setSeasons] = useState<Season[]>([{ id: 1, seasonNumber: 1, episodes: [] }]);
  const [isUploading, setIsUploading] = useState(false);
  
  const posterInputRef = useRef<HTMLInputElement>(null);
  const movieFileInputRef = useRef<HTMLInputElement>(null);
  const trailerInputRef = useRef<HTMLInputElement>(null);
  const episodeFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (contentToEdit) {
        setContentType(contentToEdit.type);
        setTitle(contentToEdit.title);
        setDescription(contentToEdit.description);
        setPosterPreview(contentToEdit.posterUrl);
        setTrailerUrl(contentToEdit.trailerUrl || null);
        setGenres(contentToEdit.genres.join(', '));
        if (contentToEdit.type === 'movie') {
            setMovieFileUrl(contentToEdit.fileUrl || null);
            setDuration(contentToEdit.duration);
        } else {
            setSeasons(contentToEdit.seasons);
        }
        // Reset file inputs
        setPoster(null);
        setMovieFile(null);
        setTrailerFile(null);
    } else {
        // Reset form for new upload
        setContentType('movie');
        setTitle('');
        setDescription('');
        setPoster(null);
        setPosterPreview(null);
        setMovieFile(null);
        setMovieFileUrl(null);
        setTrailerFile(null);
        setTrailerUrl(null);
        setDuration('2h 0m');
        setGenres('Action, Adventure');
        setSeasons([{ id: Date.now(), seasonNumber: 1, episodes: [] }]);
    }
  }, [contentToEdit]);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPoster(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMovieFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMovieFile(file);
      if (movieFileUrl) URL.revokeObjectURL(movieFileUrl);
      setMovieFileUrl(URL.createObjectURL(file));
    }
  };
  
  const handleEpisodeFileChange = (e: React.ChangeEvent<HTMLInputElement>, seasonIndex: number, episodeIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
        setSeasons(prev => prev.map((season, sIdx) => {
            if (sIdx !== seasonIndex) return season;
            const oldUrl = season.episodes[episodeIndex].fileUrl;
            if (oldUrl && oldUrl.startsWith('blob:')) URL.revokeObjectURL(oldUrl);
            const newEpisodes = season.episodes.map((episode, eIdx) => {
                if (eIdx !== episodeIndex) return episode;
                return {
                    ...episode,
                    fileName: file.name,
                    fileSize: getFileSize(file.size),
                    fileUrl: URL.createObjectURL(file)
                };
            });
            return { ...season, episodes: newEpisodes };
        }));
    }
  };

  const handleTrailerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrailerFile(file);
      if (trailerUrl) URL.revokeObjectURL(trailerUrl);
      setTrailerUrl(URL.createObjectURL(file));
    }
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  const handleAddSeason = () => {
      const nextSeasonNumber = seasons.length > 0 ? Math.max(...seasons.map(s => s.seasonNumber)) + 1 : 1;
      setSeasons(prev => [...prev, {id: Date.now(), seasonNumber: nextSeasonNumber, episodes: []}]);
  };
  
  const handleRemoveSeason = (seasonId: number) => {
      setSeasons(prev => prev.filter(s => s.id !== seasonId));
  };
  
  const handleAddEpisode = (seasonIndex: number) => {
      const newEpisode: Episode = { id: `s${seasons[seasonIndex].seasonNumber}e${seasons[seasonIndex].episodes.length + 1}`, title: '', duration: '45m' };
      setSeasons(prev => prev.map((season, sIdx) => {
          if (sIdx !== seasonIndex) return season;
          return { ...season, episodes: [...season.episodes, newEpisode] };
      }));
  };

  const handleRemoveEpisode = (seasonIndex: number, episodeIndex: number) => {
       setSeasons(prev => prev.map((season, sIdx) => {
          if (sIdx !== seasonIndex) return season;
          const newEpisodes = season.episodes.filter((_, eIdx) => eIdx !== episodeIndex);
          return { ...season, episodes: newEpisodes };
       }));
  };

  const handleEpisodeChange = (seasonIndex: number, episodeIndex: number, field: 'title' | 'duration', value: string) => {
        setSeasons(prev => prev.map((season, sIdx) => {
            if (sIdx !== seasonIndex) return season;
            const newEpisodes = season.episodes.map((episode, eIdx) => {
                if (eIdx !== episodeIndex) return episode;
                return { ...episode, [field]: value };
            });
            return { ...season, episodes: newEpisodes };
        }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploading) return;

    if (!title || !description || !posterPreview) {
      alert('Please fill out title, description, and select a poster.');
      return;
    }

    // FIX: Use a correctly typed variable for the form data to avoid assignment errors.
    let contentData: ContentUploadData;

    if (contentType === 'movie') {
        if (!contentToEdit && !movieFile) {
            alert('Please select a movie file for the new upload.');
            return;
        }
        contentData = {
            type: 'movie',
            title, description, posterUrl: posterPreview, duration,
            genres: genres.split(',').map(g => g.trim()).filter(Boolean),
            fileName: movieFile ? movieFile.name : contentToEdit?.type === 'movie' ? contentToEdit.fileName : undefined,
            fileSize: movieFile ? getFileSize(movieFile.size) : contentToEdit?.type === 'movie' ? contentToEdit.fileSize : undefined,
            releaseYear: contentToEdit?.releaseYear || new Date().getFullYear(),
            trailerUrl: trailerUrl ?? undefined,
            fileUrl: movieFileUrl ?? undefined,
        };
    } else { // TV Show
        if (seasons.some(s => s.episodes.some(e => !e.fileName || !e.title))) {
            alert('Please ensure all episodes have a title and a file selected.');
            return;
        }
        contentData = {
            type: 'show',
            title, description, posterUrl: posterPreview,
            genres: genres.split(',').map(g => g.trim()).filter(Boolean),
            releaseYear: contentToEdit?.releaseYear || new Date().getFullYear(),
            trailerUrl: trailerUrl ?? undefined,
            seasons: seasons,
        };
    }

    setIsUploading(true);
    setTimeout(() => {
        onSave(contentData, contentToEdit?.id);
    }, 2000);
  };

  return (
    <div className="space-y-6 pt-4">
        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-300 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center bg-slate-300 dark:bg-slate-900/50 p-1 rounded-full mb-6">
                <button type="button" onClick={() => setContentType('movie')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${contentType === 'movie' ? 'bg-yellow-500 text-black' : 'text-slate-600 dark:text-slate-300'}`}>Movie</button>
                <button type="button" onClick={() => setContentType('show')} className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors ${contentType === 'show' ? 'bg-yellow-500 text-black' : 'text-slate-600 dark:text-slate-300'}`}>TV Show</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg h-full bg-slate-100 dark:bg-slate-800/50">
                {posterPreview ? <img src={posterPreview} alt="Poster preview" className="max-h-80 rounded-md object-contain" /> : <div className="text-center text-slate-500 dark:text-slate-400"><UploadIcon className="mx-auto h-12 w-12" /><p className="mt-2">Poster Preview</p></div>}
                <button type="button" onClick={() => posterInputRef.current?.click()} className="mt-4 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors text-sm">{posterPreview ? 'Change Poster' : 'Select Poster'}</button>
                <input type="file" ref={posterInputRef} onChange={handlePosterChange} accept="image/*" className="hidden" />
                {poster && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full px-2">{poster.name}</p>}
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Title</label>
                  <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Description</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white"></textarea>
                </div>
                {contentType === 'movie' && <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Duration</label>
                    <input type="text" id="duration" placeholder="e.g. 2h 15m" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" />
                </div>}
                <div>
                    <label htmlFor="genres" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Genres (comma-separated)</label>
                    <input type="text" id="genres" value={genres} onChange={e => setGenres(e.target.value)} className="mt-1 block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 text-slate-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                      <PlayIcon className="h-8 w-8 text-slate-500 dark:text-slate-400"/>
                      <button type="button" onClick={() => trailerInputRef.current?.click()} className="mt-2 px-3 py-1.5 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors text-xs">{trailerFile || trailerUrl ? 'Change Trailer' : 'Select Trailer'}</button>
                      <input type="file" ref={trailerInputRef} onChange={handleTrailerFileChange} accept="video/*" className="hidden" />
                      {trailerFile ? <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full px-1">{trailerFile.name}</p> : trailerUrl && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Current file retained</p>}
                  </div>
                  {contentType === 'movie' && <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                      <FilmIcon className="h-8 w-8 text-slate-500 dark:text-slate-400"/>
                      <button type="button" onClick={() => movieFileInputRef.current?.click()} className="mt-2 px-3 py-1.5 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors text-xs">{movieFile || movieFileUrl ? 'Change Movie File' : 'Select Movie File'}</button>
                      <input type="file" ref={movieFileInputRef} onChange={handleMovieFileChange} accept="video/*" className="hidden" />
                      {movieFile ? <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full px-1">{movieFile.name}</p> : movieFileUrl && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Current file retained</p>}
                  </div>}
                </div>
              </div>
            </div>

            {contentType === 'show' && (
                <div className="space-y-4 border-t border-slate-300 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Seasons & Episodes</h3>
                    {seasons.map((season, sIdx) => (
                        <div key={season.id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Season {season.seasonNumber}</h4>
                                <button type="button" onClick={() => handleRemoveSeason(season.id)} className="text-pink-500 hover:text-pink-400"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                            {season.episodes.map((episode, eIdx) => (
                                <div key={episode.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-200 dark:bg-slate-800/50 p-3 rounded">
                                    <input type="text" placeholder="Episode Title" value={episode.title} onChange={e => handleEpisodeChange(sIdx, eIdx, 'title', e.target.value)} className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded shadow-sm text-sm" />
                                    <input type="text" placeholder="Duration (e.g. 45m)" value={episode.duration} onChange={e => handleEpisodeChange(sIdx, eIdx, 'duration', e.target.value)} className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded shadow-sm text-sm" />
                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => episodeFileRefs.current[`${sIdx}-${eIdx}`]?.click()} className="flex-grow text-xs px-2 py-1.5 bg-slate-300 dark:bg-slate-700 rounded hover:bg-slate-400 dark:hover:bg-slate-600 truncate">{episode.fileName || 'Select File'}</button>
                                        {/* FIX: Ref callback should not return a value. Wrapped assignment in curly braces. */}
                                        <input type="file" ref={el => { episodeFileRefs.current[`${sIdx}-${eIdx}`] = el; }} onChange={e => handleEpisodeFileChange(e, sIdx, eIdx)} accept="video/*" className="hidden" />
                                        <button type="button" onClick={() => handleRemoveEpisode(sIdx, eIdx)} className="text-pink-500 hover:text-pink-400 p-1"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddEpisode(sIdx)} className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400 font-semibold"><PlusIcon className="w-4 h-4"/> Add Episode</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddSeason} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 font-semibold transition-colors"><PlusIcon className="w-5 h-5"/> Add Season</button>
                </div>
            )}


            <button type="submit" disabled={isUploading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-slate-900 disabled:bg-yellow-400/70 disabled:cursor-wait transition-all duration-300">
             {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>{contentToEdit ? 'Updating...' : 'Uploading...'}</span>
                </>
              ) : (
                 contentToEdit ? `Update ${contentType === 'movie' ? 'Movie' : 'Show'}` : `Upload ${contentType === 'movie' ? 'Movie' : 'Show'}`
              )}
            </button>
          </form>
        </div>
    </div>
  );
};

export default UploadForm;