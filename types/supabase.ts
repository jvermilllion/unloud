import { Database } from '@supabase/supabase-js'

export interface Track {
  id: string
  title: string
  artist_id: string
  album_id: string
  audio_url: string
  play_count: number
  genre?: string
  created_at: string
  updated_at: string
}

export interface Artist {
  id: string
  name: string
  genre: string
  image_url: string
  popularity: number
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  title: string
  artist_id: string
  cover_url: string
  release_date: string
  created_at: string
  updated_at: string
}

export interface Playlist {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface PlaylistTrack {
  id: string
  playlist_id: string
  track_id: string
  added_at: string
  track_order: number
}

export interface Favorite {
  id: string
  user_id: string
  track_id: string
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  genres: string[]
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  track_id: string
  user_id: string
  content: string
  timestamp: number | null
  created_at: string
  updated_at: string
}

export interface ListeningHistory {
  id: string
  user_id: string
  track_id: string
  listened_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AudioAnalysis {
  id: string
  track_id: string
  bpm: number | null
  key: string | null
  energy: number | null
  created_at: string
  updated_at: string
}

export type Tables = {
  tracks: Track
  artists: Artist
  albums: Album
  playlists: Playlist
  playlist_tracks: PlaylistTrack
  favorites: Favorite
  user_preferences: UserPreferences
  comments: Comment
  listening_history: ListeningHistory
  user_profiles: UserProfile
  audio_analysis: AudioAnalysis
}

export type Database = {
  public: {
    Tables: Tables
  }
}