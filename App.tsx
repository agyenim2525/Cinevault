import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Movie, User, ContentItem, TVShow, Episode, ContentUploadData, UserProfileUpdateData } from './types';
import type { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';

import { supabase } from './lib/supabaseClient';

import BottomNavBar from './components/BottomNavigation';
import { StarIcon } from './components/icons/StarIcon';
import { ClockIcon } from './components/icons/ClockIcon';
import { PlayIcon } from './components/icons/PlayIcon';
import { BellIcon } from './components/icons/DashboardIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { DatabaseIcon } from './components/icons/DatabaseIcon';
import { CheckIcon } from './components/icons/CheckIcon';
import PageHeader from './components/PageHeader';
import SearchScreen from './components/SearchScreen';
import WishlistScreen from './components/WishlistScreen';
import UserDashboard from './components/UserDashboard';
import UploadForm from './components/UploadForm';
import { BookmarkIcon } from './components/icons/BookmarkIcon';
import AuthModal from './components/AuthModal';
import AdminLoginScreen from './components/AdminLoginScreen';
import AdminDashboardScreen from './components/AdminDashboardScreen';
import { LogoutIcon } from './components/icons/LogoutIcon';
import StarRating from './components/StarRating';
import VideoPlayerScreen from './components/VideoPlayerScreen';
import EpisodeItem from './components/EpisodeItem';
import { FilmIcon } from './components/icons/FilmIcon';
import { Logo } from './components/icons/Logo';

type Page = 'home' | 'details' | 'search' | 'wishlist' | 'profile' | 'upload' | 'admin-dashboard' | 'player';
type AuthState = 'unauthenticated' | 'user' | 'admin';

const HomeHeader: React.FC<{ theme: string; onToggleTheme: () => void; currentUser: User | null; role: AuthState; onLogout?: () => void; }> = ({ theme, onToggleTheme, currentUser, role, onLogout }) => (
  <header className="px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      {currentUser ? (
        <>
          <img src={currentUser.profileImageUrl || `https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&h=500&fit=crop`} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400" />
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back 👋</p>
            <p className="font-bold text-lg text-slate-900 dark:text-white">{currentUser.username}</p>
          </div>
        </>
      ) : (
        <Logo className="h-7 w-auto" />
      )}
    </div>
    <div className="flex items-center gap-4">
        <button onClick={onToggleTheme} className="text-slate-600 dark:text-slate-300">
            {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button className="relative text-slate-600 dark:text-slate-300">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></span>
        </button>
        {onLogout && (
          <button onClick={onLogout} className="p-2 rounded-full text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800">
            <LogoutIcon className="w-6 h-6" />
          </button>
        )}
    </div>
  </header>
);

const NowShowingCard: React.FC<{ item: ContentItem; onClick: () => void; isInWishlist: boolean; onToggleWishlist: (e: React.MouseEvent) => void; }> = ({ item, onClick, isInWishlist, onToggleWishlist }) => (
  <div className="flex-shrink-0 w-48 mr-4" onClick={onClick}>
    <div className="relative rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer">
      <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-black/60 rounded-full text-xs font-semibold text-white">
        {item.type === 'show' ? 'TV' : 'MOVIE'}
      </div>
      <button onClick={onToggleWishlist} className="absolute top-2 right-2 z-20 p-2 bg-black/50 rounded-full" aria-label="Toggle Wishlist">
          <BookmarkIcon className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
      </button>
      <img src={item.posterUrl} alt={item.title} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-3 text-white w-full">
        <h3 className="font-bold text-md truncate">{item.title}</h3>
        <div className="flex items-center flex-wrap text-xs mt-1 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <StarIcon className="w-3 h-3 text-yellow-400" />
            <span>{item.rating.toFixed(1)}/10</span>
          </div>
          {item.type === 'movie' && item.fileSize && (
            <div className="flex items-center gap-1">
              <DatabaseIcon className="w-3 h-3" />
              <span>{item.fileSize}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const PopularMovieCard: React.FC<{ item: ContentItem; onClick: () => void; isInWishlist: boolean; onToggleWishlist: (e: React.MouseEvent) => void; }> = ({ item, onClick, isInWishlist, onToggleWishlist }) => (
  <div className="flex items-start gap-4 p-2 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer relative" onClick={onClick}>
    <button onClick={onToggleWishlist} className="absolute top-3 right-3 z-20 p-2 bg-white/50 dark:bg-black/50 rounded-full" aria-label="Toggle Wishlist">
        <BookmarkIcon className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600 dark:text-slate-300'}`} />
    </button>
    <img src={item.posterUrl} alt={item.title} className="w-24 h-32 object-cover rounded-xl flex-shrink-0" />
    <div className="flex-grow pt-1">
      <h3 className="font-bold text-slate-900 dark:text-white pr-10">{item.title}</h3>
      <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-1 mt-1">
        <StarIcon className="w-3 h-3 text-yellow-400" />
        <span>{item.rating.toFixed(1)}/10 User Score</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {item.genres.slice(0, 2).map(genre => (
          <span key={genre} className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">{genre}</span>
        ))}
      </div>
       <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-3 mt-2">
        {item.type === 'movie' && (
            <>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
                {item.fileSize && (
                    <div className="flex items-center gap-1">
                        <DatabaseIcon className="w-3 h-3" />
                        <span>{item.fileSize}</span>
                    </div>
                )}
            </>
        )}
        {item.type === 'show' && (
             <div className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span>{item.seasons.length} Seasons</span>
            </div>
        )}
      </div>
    </div>
  </div>
);

const TrailerModal: React.FC<{ url: string; title: string; onClose: () => void }> = ({ url, title, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
      <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trailer-title"
      >
        <div 
          className="relative bg-black rounded-lg w-full max-w-4xl shadow-2xl animate-slide-up" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center">
             <h2 id="trailer-title" className="text-white text-lg font-bold">{title} - Trailer</h2>
             <button 
                onClick={onClose} 
                className="text-white/70 hover:text-white text-3xl transition-colors"
                aria-label="Close trailer"
              >
                &times;
              </button>
          </div>
          <video src={url} controls autoPlay className="w-full rounded-b-lg aspect-video bg-black">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
};

const MovieDetailsScreen: React.FC<{ 
    content: ContentItem; 
    onBack: () => void; 
    isInWishlist: boolean; 
    onToggleWishlist: () => void; 
    onContentDownloaded: (id: number) => void; 
    currentUser: User | null; 
    onRateContent: (contentId: number, rating: number) => void; 
    authState: AuthState; 
    onPlayContent: (url: string, title: string, contentId: number) => void;
    onRequestLogin: () => void;
}> = ({ content, onBack, isInWishlist, onToggleWishlist, onContentDownloaded, currentUser, onRateContent, authState, onPlayContent, onRequestLogin }) => {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');
  const [showTrailer, setShowTrailer] = useState(false);
  const [downloadProgressText, setDownloadProgressText] = useState('');
  const [activeSeason, setActiveSeason] = useState(1);

  const userRating = useMemo(() => {
    if (!currentUser) return 0;
    return content.ratings.find(r => r.userId === currentUser.id)?.rating || 0;
  }, [content.ratings, currentUser]);


  const handleDownload = async () => {
    if (content.type !== 'movie' || downloadState !== 'idle' || !content.fileUrl || !content.fileName) return;

    setDownloadState('downloading');
    setDownloadProgressText('(Starting...)');

    try {
        const response = await fetch(content.fileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("Could not get reader from response body");
        }

        const chunks: Uint8Array[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            chunks.push(value);
            loaded += value.length;

            if (totalSize > 0) {
                const percentage = Math.round((loaded / totalSize) * 100);
                setDownloadProgressText(`(${percentage}%)`);
            } else {
                 setDownloadProgressText(`(${(loaded / (1024 * 1024)).toFixed(1)} MB)`);
            }
        }

        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = content.fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setDownloadState('downloaded');
        setDownloadProgressText('');
        onContentDownloaded(content.id);

    } catch (error) {
        console.error('Download failed:', error);
        setDownloadState('idle');
        setDownloadProgressText('');
        alert('Download failed. Please try again.');
    }
  };
  
  const handleProtectedAction = (action: () => void) => {
      if (authState === 'unauthenticated') {
          onRequestLogin();
      } else {
          action();
      }
  };

  const selectedSeason = content.type === 'show' ? content.seasons.find(s => s.seasonNumber === activeSeason) : null;
  
  return (
    <>
      {showTrailer && content.trailerUrl && (
          <TrailerModal url={content.trailerUrl} title={content.title} onClose={() => setShowTrailer(false)} />
      )}
      <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] text-slate-800 dark:text-slate-200 flex flex-col">
        <div className="h-1/2 w-full relative">
          <img src={content.heroUrl} alt={content.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#1F222A] to-transparent"></div>
          <PageHeader title="" onBack={onBack} />
        </div>
        <div className="flex-grow p-6 -mt-16 relative z-10 flex flex-col overflow-y-auto custom-scrollbar">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center">{content.title}</h1>
          <div className="flex justify-center items-center gap-4 text-sm text-slate-600 dark:text-slate-400 my-2 flex-wrap">
            <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-400" /><span>{content.rating.toFixed(1)}/10 User Score</span></div>
            {content.type === 'movie' && (
                <>
                    <span>•</span>
                    <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /><span>{content.duration}</span></div>
                    {content.fileSize && (
                        <>
                            <span>•</span>
                            <div className="flex items-center gap-1"><DatabaseIcon className="w-4 h-4" /><span>{content.fileSize}</span></div>
                        </>
                    )}
                </>
            )}
            {content.type === 'show' && (
                <>
                    <span>•</span>
                    <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /><span>{content.seasons.length} Seasons</span></div>
                </>
            )}
          </div>
          <div className="flex justify-center gap-2 my-2">
            {content.genres.map(g => <span key={g} className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded-full">{g}</span>)}
          </div>
          
          <div className="flex flex-col items-center my-3 bg-slate-200 dark:bg-slate-800/50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {userRating > 0 ? `You rated this ${userRating}/10` : 'Rate this content'}
              </p>
              <StarRating 
                  value={userRating}
                  onRate={(newRating) => handleProtectedAction(() => onRateContent(content.id, newRating))}
              />
          </div>
          
          <div className="flex items-center justify-center gap-4 mx-auto my-4">
            <button 
              onClick={() => setShowTrailer(true)}
              disabled={!content.trailerUrl}
              className="flex items-center justify-center gap-2 w-32 py-3 bg-slate-200 dark:bg-slate-700 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayIcon className="w-5 h-5 text-yellow-500"/>
              Trailer
            </button>
             <button 
                onClick={() => handleProtectedAction(onToggleWishlist)}
                className="flex items-center justify-center gap-2 w-32 py-3 bg-slate-200 dark:bg-slate-700 rounded-full font-semibold"
              >
                <BookmarkIcon className={`w-5 h-5 transition-colors ${isInWishlist ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                Wishlist
              </button>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 my-4 text-justify line-clamp-3">{content.description}</p>
          
          <div className="flex items-center my-4">
            {content.cast.map(actor => (
              <div key={actor.name} className="flex items-center -mr-4">
                <img src={actor.imageUrl} alt={actor.name} className="w-12 h-12 rounded-full object-cover border-4 border-slate-100 dark:border-[#1F222A]" />
              </div>
            ))}
            <div className="flex-grow pl-8">
                <p className="font-semibold text-sm">Cast</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{content.cast.map(c => c.name).join(', ')}</p>
            </div>
          </div>
          
          <div className="flex-grow"></div> {/* Spacer to push content to bottom */}

          {content.type === 'show' && (
            <div className="mt-4">
                <div className="flex items-center border-b border-slate-300 dark:border-slate-700">
                    {content.seasons.map(season => (
                        <button key={season.id} onClick={() => setActiveSeason(season.seasonNumber)} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeSeason === season.seasonNumber ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-500 dark:text-slate-400'}`}>
                            Season {season.seasonNumber}
                        </button>
                    ))}
                </div>
                <div className="space-y-3 mt-4">
                    {selectedSeason?.episodes.map(episode => (
                        <EpisodeItem 
                            key={episode.id} 
                            episode={episode} 
                            onPlay={(url, title) => onPlayContent(url, title, content.id)} 
                            onEpisodeDownloaded={() => onContentDownloaded(content.id)}
                            authState={authState}
                            onRequestLogin={onRequestLogin}
                        />
                    ))}
                </div>
            </div>
          )}
          
          {content.type === 'movie' && (
            <>
              <div className="mt-auto pt-4">
                  <div className="p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="font-semibold text-slate-800 dark:text-white">Download Movie</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{content.fileName} ({content.fileSize})</p>
                          </div>
                           <button onClick={() => handleProtectedAction(handleDownload)} disabled={downloadState !== 'idle'} className={`w-36 py-2 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 ${
                              downloadState === 'downloaded' ? 'bg-green-600/20 text-green-400 cursor-default' :
                              downloadState === 'downloading' ? 'bg-yellow-600/20 text-yellow-400 cursor-wait' :
                              'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                          }`}>
                              {downloadState === 'idle' && <> <DownloadIcon className="w-4 h-4" /> Download </>}
                              {downloadState === 'downloading' && <> <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div> {downloadProgressText || '...'} </>}
                              {downloadState === 'downloaded' && <> <CheckIcon className="w-4 h-4" /> Done </>}
                          </button>
                      </div>
                  </div>
              </div>
              <button 
                  onClick={() => handleProtectedAction(() => content.fileUrl && onPlayContent(content.fileUrl, content.title, content.id))}
                  disabled={!content.fileUrl}
                  className={`mt-4 w-full py-4 font-bold rounded-full text-lg transition-colors flex items-center justify-center gap-2 bg-[#F5C518] text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                  <PlayIcon className="w-6 h-6"/> Watch Now
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('cineVaultTheme') as 'light' | 'dark') || 'dark');
  const [watchHistoryIds, setWatchHistoryIds] = useState<number[]>([]);
  const [downloadHistoryIds, setDownloadHistoryIds] = useState<number[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  
  const [page, setPage] = useState<Page>('home');
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [contentToEdit, setContentToEdit] = useState<ContentItem | null>(null);
  const [contentToPlay, setContentToPlay] = useState<{ url: string; title: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isShowingAdminLogin, setIsShowingAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authUser: SupabaseAuthUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, profile_image_url')
      .eq('id', authUser.id)
      .single();
    
    if (data) {
        setCurrentUser({
            id: authUser.id,
            email: authUser.email,
            username: data.username,
            profileImageUrl: data.profile_image_url,
        });
        setAuthState('user'); // Default to user, admin check can override
    } else {
        // Handle case where profile doesn't exist yet for a new user
        // You might want to create a profile here
        setCurrentUser({
            id: authUser.id,
            email: authUser.email,
            username: authUser.email?.split('@')[0] || 'New User',
        });
        setAuthState('user');
    }
  }, []);
  
  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user);
      } else {
          setIsLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setAuthState('unauthenticated');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const fetchContent = useCallback(async () => {
      const { data, error } = await supabase.from('content').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching content:', error);
      else setContentItems(data as ContentItem[]);
      setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Fetch user-specific data
  useEffect(() => {
    if (!currentUser) {
        setWishlistIds(new Set());
        setWatchHistoryIds([]);
        setDownloadHistoryIds([]);
        return;
    }

    const fetchUserData = async () => {
        const { data: wishlistData, error: wishlistError } = await supabase.from('wishlist').select('content_id').eq('user_id', currentUser.id);
        if (wishlistData) setWishlistIds(new Set(wishlistData.map(w => w.content_id)));
        
        const { data: watchData, error: watchError } = await supabase.from('watch_history').select('content_id').eq('user_id', currentUser.id).order('watched_at', { ascending: false });
        if (watchData) setWatchHistoryIds(watchData.map(w => w.content_id));

        const { data: downloadData, error: downloadError } = await supabase.from('download_history').select('content_id').eq('user_id', currentUser.id).order('downloaded_at', { ascending: false });
        if (downloadData) setDownloadHistoryIds(downloadData.map(d => d.content_id));
    };

    fetchUserData();
  }, [currentUser]);


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('cineVaultTheme', theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleToggleWishlist = async (contentId: number) => {
    if (!currentUser) return;
    const isWishlisted = wishlistIds.has(contentId);
    
    if (isWishlisted) {
        const { error } = await supabase.from('wishlist').delete().match({ user_id: currentUser.id, content_id: contentId });
        if (!error) setWishlistIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(contentId);
            return newSet;
        });
    } else {
        const { error } = await supabase.from('wishlist').insert({ user_id: currentUser.id, content_id: contentId });
        if (!error) setWishlistIds(prev => new Set(prev).add(contentId));
    }
  };
  
  const handleUserLogin = async (email: string, pass: string): Promise<boolean> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
          console.error("Login error:", error.message);
          return false;
      }
      setPage('home');
      setShowAuthModal(false);
      return true;
  };
  
  const handleAdminLogin = (user: string, pass: string): boolean => {
      const adminUser = process.env.ADMIN_USERNAME || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD || 'password';
      if(user === adminUser && pass === adminPass) {
          setCurrentUser({id: 'admin-id', username: 'Admin', email: 'admin@cinevault.app'});
          setAuthState('admin');
          setPage('admin-dashboard');
          setIsShowingAdminLogin(false);
          return true;
      }
      return false;
  };
  
  const handleUserSignup = async (username: string, email: string, pass: string): Promise<boolean> => {
      const { data, error } = await supabase.auth.signUp({ 
          email, 
          password: pass,
          options: {
              data: {
                  username: username,
              }
          }
      });
      if (error || !data.user) {
          console.error("Signup error:", error?.message);
          return false;
      }
       // Also create a profile entry
      const { error: profileError } = await supabase.from('profiles').insert({ id: data.user.id, username: username });
      if (profileError) {
          console.error("Profile creation error:", profileError.message);
          // You might want to handle this case, e.g., by deleting the auth user
          return false;
      }
      setPage('home');
      setShowAuthModal(false);
      return true;
  };
  
  const handleLogout = async () => {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setAuthState('unauthenticated');
      setPage('home');
  };

  const handleContentDownloaded = async (contentId: number) => {
    if (!currentUser) return;
    const { error } = await supabase.from('download_history').insert({ user_id: currentUser.id, content_id: contentId });
    if (!error) setDownloadHistoryIds(prev => [contentId, ...prev.filter(id => id !== contentId)]);
  };

  const handleAddToWatchHistory = async (contentId: number) => {
    if (!currentUser) return;
    const { error } = await supabase.from('watch_history').upsert({ user_id: currentUser.id, content_id: contentId, watched_at: new Date().toISOString() }, { onConflict: 'user_id,content_id'});
    if (!error) setWatchHistoryIds(prev => [contentId, ...prev.filter(id => id !== contentId)]);
  };

  const handlePlayContent = (url: string, title: string, contentId: number) => {
      if (!url) {
          alert("Video content not available.");
          return;
      }
      handleAddToWatchHistory(contentId);
      setContentToPlay({ url, title });
      setPage('player');
  };

  const handleUpdateUserProfile = async (data: UserProfileUpdateData): Promise<boolean> => {
    if (!currentUser) return false;

    // Update password
    if (data.newPassword) {
        const { error } = await supabase.auth.updateUser({ password: data.newPassword });
        if (error) {
            alert("Failed to update password: " + error.message);
            return false;
        }
    }
    
    let profileImageUrl = currentUser.profileImageUrl;
    // Upload new profile image to storage
    if (data.profileImageFile) {
        const file = data.profileImageFile;
        const filePath = `${currentUser.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        if (uploadError) {
            console.error("Image upload error:", uploadError);
            alert("Failed to upload new profile image.");
            return false;
        }
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        profileImageUrl = urlData.publicUrl;
    }
    
    // Update profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: data.username, profile_image_url: profileImageUrl })
        .eq('id', currentUser.id);

    if (profileError) {
        console.error("Profile update error:", profileError);
        alert("Failed to update profile.");
        return false;
    }

    // Refresh user state
    await fetchUserProfile(session!.user);
    return true;
  };

  const handleRateContent = async (contentId: number, newRating: number) => {
    if (!currentUser) return;
    const content = contentItems.find(c => c.id === contentId);
    if (!content) return;
    
    const existingRatingIndex = content.ratings.findIndex(r => r.userId === currentUser.id);
    let newRatings;

    if (existingRatingIndex > -1) {
        newRatings = [...content.ratings];
        newRatings[existingRatingIndex] = { userId: currentUser.id, rating: newRating };
    } else {
        newRatings = [...content.ratings, { userId: currentUser.id, rating: newRating }];
    }

    const totalRating = newRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / newRatings.length;
    
    const { error } = await supabase
        .from('content')
        .update({ ratings: newRatings, rating: averageRating })
        .eq('id', contentId);
        
    if (!error) fetchContent(); // Re-fetch to update UI
  };

  const selectedContent = useMemo(() => contentItems.find(m => m.id === selectedContentId) || null, [selectedContentId, contentItems]);
  const watchHistory = useMemo(() => watchHistoryIds.map(id => contentItems.find(m => m.id === id)).filter(Boolean) as ContentItem[], [watchHistoryIds, contentItems]);
  const downloadHistory = useMemo(() => downloadHistoryIds.map(id => contentItems.find(m => m.id === id)).filter(Boolean) as ContentItem[], [downloadHistoryIds, contentItems]);
  const wishlistedContent = useMemo(() => contentItems.filter(m => wishlistIds.has(m.id)), [wishlistIds, contentItems]);

  const handleSelectContent = (id: number) => {
    setSelectedContentId(id);
    setPage('details');
  };

  const handleGoHome = () => {
    setSelectedContentId(null);
    setContentToEdit(null);
    setPage(authState === 'admin' ? 'admin-dashboard' : 'home');
  };

  const handleViewChange = (view: Page) => {
    const isAdmin = authState === 'admin';
    const isUser = authState === 'user';
    if ((view === 'upload' || view === 'admin-dashboard') && !isAdmin) {
      setPage('home'); 
      return;
    }
    if ((view === 'profile' || view === 'wishlist') && !(isUser || isAdmin)) {
      setShowAuthModal(true);
      return;
    }
    setPage(view);
  };
  
  const handleSaveContent = async (contentData: ContentUploadData, existingId?: number) => {
    let contentToSave: Omit<ContentItem, 'id'> & { id?: number };

    if (contentData.type === 'movie') {
        contentToSave = {
            ...contentData,
            cast: [], heroUrl: contentData.posterUrl, uploadDate: new Date().toISOString(),
            rating: 0, ratings: [],
        };
    } else {
        contentToSave = {
            ...contentData,
            cast: [], heroUrl: contentData.posterUrl, uploadDate: new Date().toISOString(),
            rating: 0, ratings: [],
        };
    }

    if (existingId) {
        contentToSave.id = existingId;
    }

    const { error } = await supabase.from('content').upsert(contentToSave as any);

    if (error) {
        console.error("Save content error:", error);
        alert("Failed to save content.");
    } else {
        await fetchContent();
        setContentToEdit(null);
        setPage('admin-dashboard');
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (window.confirm(`Are you sure you want to permanently delete this item? This action cannot be undone.`)) {
      const { error } = await supabase.from('content').delete().eq('id', contentId);
      if (error) console.error('Delete error:', error);
      else await fetchContent();
    }
  };

  const handleStartEdit = (contentId: number) => {
    const content = contentItems.find(m => m.id === contentId);
    if (content) {
      setContentToEdit(content);
      setPage('upload');
    }
  };
  
  const handleProtectedWishlistToggle = (e: React.MouseEvent, contentId: number) => {
    e.stopPropagation();
    if (authState === 'unauthenticated') setShowAuthModal(true);
    else handleToggleWishlist(contentId);
  };
  
  if (isLoading) {
    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-[#1F222A]">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (isShowingAdminLogin) {
      return (
        <AdminLoginScreen 
            onAdminLogin={handleAdminLogin}
            onShowUserLogin={() => setIsShowingAdminLogin(false)}
        />
      )
  }

  const renderPage = () => {
    switch (page) {
      case 'player':
        return contentToPlay ? <VideoPlayerScreen
            url={contentToPlay.url}
            title={contentToPlay.title}
            onBack={() => { setContentToPlay(null); setPage('details'); }}
        /> : null;
      case 'details':
        return selectedContent ? <MovieDetailsScreen 
            content={selectedContent} 
            onBack={handleGoHome} 
            isInWishlist={wishlistIds.has(selectedContent.id)}
            onToggleWishlist={() => handleToggleWishlist(selectedContent.id)}
            onContentDownloaded={handleContentDownloaded}
            currentUser={currentUser}
            onRateContent={handleRateContent}
            authState={authState}
            onPlayContent={handlePlayContent}
            onRequestLogin={() => setShowAuthModal(true)}
            /> : null;
      case 'search':
        return (
            <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
              <PageHeader title="Search" onBack={handleGoHome} />
              <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4">
                <SearchScreen 
                  items={contentItems} 
                  onContentSelect={handleSelectContent}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={(id) => handleProtectedWishlistToggle({ stopPropagation: () => {} } as React.MouseEvent, id)}
                />
              </main>
              <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
            </div>
        );
      case 'wishlist':
        return (
           <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
              <PageHeader title="My Wishlist" onBack={handleGoHome} />
              <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4">
                <WishlistScreen 
                    items={wishlistedContent} 
                    onContentSelect={handleSelectContent}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={(id) => handleToggleWishlist(id)}
                />
              </main>
              <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
            </div>
        );
      case 'profile':
        return (
          <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
              <PageHeader title="Profile" onBack={handleGoHome} onLogout={handleLogout} />
              <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4">
                <UserDashboard 
                  contentItems={contentItems} 
                  watchHistory={watchHistory} 
                  downloadHistory={downloadHistory}
                  onContentClick={(item) => handleSelectContent(item.id)}
                  currentUser={currentUser}
                  wishlistIds={wishlistIds}
                  onToggleWishlist={handleToggleWishlist}
                  onUpdateProfile={handleUpdateUserProfile}
                />
              </main>
              <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
            </div>
        );
      case 'upload':
        return (
          <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
              <PageHeader title={contentToEdit ? "Edit Content" : "Upload Content"} onBack={handleGoHome} />
              <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4">
                <UploadForm onSave={handleSaveContent} contentToEdit={contentToEdit}/>
              </main>
              <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
            </div>
        );
      case 'admin-dashboard':
        return (
             <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
              <HomeHeader theme={theme} onToggleTheme={handleToggleTheme} currentUser={currentUser} role={authState} onLogout={handleLogout} />
              <main className="flex-1 overflow-y-auto custom-scrollbar pb-24 px-4">
                <AdminDashboardScreen 
                    contentItems={contentItems} 
                    onDeleteContent={handleDeleteContent}
                    onEditContent={handleStartEdit}
                />
              </main>
              <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
            </div>
        );
      case 'home':
      default:
        return (
          <div className="h-full w-full bg-slate-100 dark:bg-[#1F222A] flex flex-col">
            <HomeHeader theme={theme} onToggleTheme={handleToggleTheme} currentUser={currentUser} role={authState} onLogout={authState !== 'unauthenticated' ? handleLogout : undefined}/>
            <main className="flex-1 overflow-y-auto custom-scrollbar pb-24">
              {contentItems.length > 0 ? (
                <>
                  <section className="mb-6">
                    <div className="px-6 flex justify-between items-center mb-3">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Now Showing</h2>
                      <a href="#" className="text-sm text-yellow-500">See more</a>
                    </div>
                    <div className="flex overflow-x-auto pl-6 custom-scrollbar pb-4">
                      {contentItems.map(item => (
                        <NowShowingCard 
                            key={item.id} 
                            item={item} 
                            onClick={() => handleSelectContent(item.id)}
                            isInWishlist={wishlistIds.has(item.id)}
                            onToggleWishlist={(e) => handleProtectedWishlistToggle(e, item.id)}
                        />
                      ))}
                    </div>
                  </section>
                  <section>
                    <div className="px-6 flex justify-between items-center mb-3">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular</h2>
                      <a href="#" className="text-sm text-yellow-500">See more</a>
                    </div>
                    <div className="px-4 space-y-2">
                      {[...contentItems].sort((a,b) => b.rating - a.rating).map(item => (
                        <PopularMovieCard 
                            key={item.id} 
                            item={item} 
                            onClick={() => handleSelectContent(item.id)}
                            isInWishlist={wishlistIds.has(item.id)}
                            onToggleWishlist={(e) => handleProtectedWishlistToggle(e, item.id)}
                        />
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-8">
                  <FilmIcon className="w-24 h-24 text-slate-400 dark:text-slate-600 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Your CineVault is Empty</h2>
                  <p className="mt-2 max-w-sm">
                    {authState === 'admin' 
                      ? "Looks like you haven't uploaded any content yet. Go to the 'Upload' tab to add your first movie or TV show."
                      : "There is no content available at the moment. Please check back later."}
                  </p>
                </div>
              )}
            </main>
            <BottomNavBar activeView={page} onViewChange={handleViewChange} role={authState === 'admin' ? 'admin' : 'user'} />
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full">
      {renderPage()}
      {showAuthModal && (
        <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onUserLogin={handleUserLogin}
            onUserSignup={handleUserSignup}
            onShowAdminLogin={() => {
                setShowAuthModal(false);
                setIsShowingAdminLogin(true);
            }}
        />
      )}
    </div>
  );
}

export default App;
