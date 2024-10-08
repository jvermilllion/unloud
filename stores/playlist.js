import { defineStore } from 'pinia'
import { useSupabaseClient } from '@nuxtjs/supabase'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: [],
  }),
  actions: {
    async fetchPlaylists() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
      if (error) throw error
      this.playlists = data
    },
    async fetchPlaylist(id) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks (
            position,
            tracks (*)
          )
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return {
        ...data,
        tracks: data.playlist_tracks
          .sort((a, b) => a.position - b.position)
          .map(pt => pt.tracks)
      }
    },
    async createPlaylist(name, description = '', isPublic = false) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('playlists')
        .insert({ name, description, is_public: isPublic })
        .select()
      if (error) throw error
      this.playlists.push(data[0])
    },
    async uploadTrack(playlistId, track) {
      const supabase = useSupabaseClient()
      
      // Upload audio file
      const fileName = `${Date.now()}_${track.file.name}`
      const { data: fileData, error: fileError } = await supabase.storage
        .from('audio')
        .upload(fileName, track.file)
      if (fileError) throw fileError

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName)

      // Add track to the database
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .insert({
          title: track.title,
          artist: track.artist,
          url: publicUrl,
        })
        .select()
      if (trackError) throw trackError

      // Add track to playlist
      const { data: playlistTrackData, error: playlistTrackError } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          track_id: trackData[0].id,
          position: track.position,
        })
      if (playlistTrackError) throw playlistTrackError

      return trackData[0]
    },
  },
})