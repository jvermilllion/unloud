import { defineStore } from 'pinia'
import { useSupabaseClient } from '@nuxtjs/supabase'

export const usePlaylistStore = defineStore('playlist', {
  // ... existing code ...

  actions: {
    // ... existing actions ...

    async removeTrackFromPlaylist(playlistId, trackId) {
      const supabase = useSupabaseClient()
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .match({ playlist_id: playlistId, track_id: trackId })
      
      if (error) throw error

      // Update the local state
      const playlistIndex = this.playlists.findIndex(p => p.id === playlistId)
      if (playlistIndex !== -1) {
        this.playlists[playlistIndex].tracks = this.playlists[playlistIndex].tracks.filter(t => t.id !== trackId)
      }
    },

    async searchTracks(query) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('title')
        .limit(10)

      if (error) throw error
      return data
    }
  }
})