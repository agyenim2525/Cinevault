
export interface CastMember {
  name: string;
  imageUrl: string;
}

export interface Episode {
  id: string; // e.g., 's1e1'
  title: string;
  duration: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
}

export interface Season {
  id: number;
  seasonNumber: number;
  episodes: Episode[];
}

export interface Movie {
  id: number;
  type: 'movie'; // Discriminating property
  title: string;
  posterUrl: string;
  heroUrl: string;
  rating: number;
  ratings: { userId: string; rating: number }[];
  duration: string;
  genres: string[];
  description: string;
  cast: CastMember[];
  releaseYear?: number;
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  trailerUrl?: string;
  fileUrl?: string;
}

export interface TVShow {
  id: number;
  type: 'show'; // Discriminating property
  title: string;
  posterUrl: string;
  heroUrl: string;
  rating: number;
  ratings: { userId: string; rating: number }[];
  genres: string[];
  description: string;
  cast: CastMember[];
  releaseYear?: number;
  uploadDate?: string;
  trailerUrl?: string;
  seasons: Season[];
}

export type ContentItem = Movie | TVShow;

// FIX: Added explicit types for form data to help TypeScript discriminate between movie and show properties.
export interface MovieUploadData {
    type: 'movie';
    title: string;
    posterUrl: string;
    duration: string;
    genres: string[];
    description: string;
    releaseYear?: number;
    fileName?: string;
    fileSize?: string;
    trailerUrl?: string;
    fileUrl?: string;
}
export interface TVShowUploadData {
    type: 'show';
    title: string;
    posterUrl: string;
    genres: string[];
    description: string;
    releaseYear?: number;
    trailerUrl?: string;
    seasons: Season[];
}
export type ContentUploadData = MovieUploadData | TVShowUploadData;

export interface User {
  id: string; // Supabase Auth UUID
  email?: string;
  username: string; // From `profiles` table
  profileImageUrl?: string; // From `profiles` table
}

export interface UserProfileUpdateData {
    username: string;
    profileImageFile?: File | null;
    currentPassword?: string;
    newPassword?: string;
}
