<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6">Welcome to AudioStream</h1>
    <SearchBar @search-results="handleSearchResults" />
    <div v-if="searchResults.length > 0">
      <h2 class="text-2xl font-semibold mb-4">Search Results</h2>
      <div v-for="track in searchResults" :key="track.id" class="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 class="text-xl font-semibold">{{ track.title }}</h3>
        <p>Artist: {{ track.artists.name }}</p>
        <p>Album: {{ track.albums.title }}</p>
        <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" />
      </div>
    </div>
    <div v-else>
      <div v-if="loading">Loading tracks...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else>
        <h2 class="text-2xl font-semibold mb-4">Recent Tracks</h2>
        <div v-for="track in tracks" :key="track.id" class="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 class="text-xl font-semibold">{{ track.title }}</h3>
          <p>Artist: {{ track.artist?.name || 'Unknown' }}</p>
          <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" />
        </div>
      </div>
    </div>
    <PlaylistManager class="mt-8" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import AudioPlayer from '~/components/AudioPlayer.vue'
import SearchBar from '~/components/SearchBar.vue'
import PlaylistManager from '~/components/PlaylistManager.vue'
import type { Track } from '~/types/supabase'

const supabase = useSupabaseClient()
const tracks = ref<Track[]>([])
const searchResults = ref<Track[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('tracks')
      .select(`
        *,
        artist:artists(name)
      `)
      .limit(5)

    if (fetchError) throw fetchError

    tracks.value = data
  } catch (e) {
    console.error('Error fetching tracks:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handleSearchResults = (results: Track[]) => {
  searchResults.value = results
}
</script>