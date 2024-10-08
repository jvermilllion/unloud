<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p class="text-gray-600 dark:text-gray-300">Loading playlist...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <p class="text-red-500">{{ error }}</p>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{{ playlist.name }}</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-4">{{ playlist.description }}</p>
      <div class="mb-4">
        <button @click="playAll" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">
          Play All
        </button>
        <button @click="shufflePlay" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Shuffle Play
        </button>
      </div>
      <ul>
        <li v-for="(track, index) in playlist.tracks" :key="track.id" class="mb-2 p-2 bg-white dark:bg-gray-800 rounded shadow">
          <div class="flex items-center justify-between">
            <div>
              <span class="font-semibold text-gray-800 dark:text-white">{{ track.title }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-300"> - {{ track.artist }}</span>
            </div>
            <div>
              <button @click="playTrack(track)" class="text-blue-500 hover:text-blue-600 mr-2">Play</button>
              <button @click="removeTrack(track.id)" class="text-red-500 hover:text-red-600">Remove</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlaylistStore } from '~/stores/playlist'
import { useAudioStore } from '~/stores/audio'

const route = useRoute()
const playlistStore = usePlaylistStore()
const audioStore = useAudioStore()

const playlist = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const playlistId = route.params.id
  try {
    playlist.value = await playlistStore.fetchPlaylist(playlistId)
  } catch (err) {
    error.value = 'Failed to load playlist'
    console.error(err)
  } finally {
    loading.value = false
  }
})

const playAll = () => {
  audioStore.setPlaylist(playlist.value.tracks)
  audioStore.playTrack(playlist.value.tracks[0])
}

const shufflePlay = () => {
  const shuffledTracks = [...playlist.value.tracks].sort(() => Math.random() - 0.5)
  audioStore.setPlaylist(shuffledTracks)
  audioStore.playTrack(shuffledTracks[0])
}

const playTrack = (track) => {
  audioStore.setPlaylist(playlist.value.tracks)
  audioStore.playTrack(track)
}

const removeTrack = async (trackId) => {
  try {
    await playlistStore.removeTrackFromPlaylist(playlist.value.id, trackId)
    playlist.value.tracks = playlist.value.tracks.filter(t => t.id !== trackId)
  } catch (err) {
    console.error('Failed to remove track:', err)
  }
}
</script>