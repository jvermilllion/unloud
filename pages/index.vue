<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Welcome to Audio Streaming App</h1>
    <div v-if="loading" class="text-center">
      <p class="text-gray-600 dark:text-gray-300">Loading playlists...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <p class="text-red-500">{{ error }}</p>
    </div>
    <div v-else-if="user">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Playlists</h2>
      <div v-if="playlists.length === 0" class="text-center">
        <p class="text-gray-600 dark:text-gray-300">You don't have any playlists yet. Create one to get started!</p>
        <button @click="createPlaylist" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create Playlist
        </button>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="playlist in playlists" :key="playlist.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{{ playlist.name }}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ playlist.tracks.length }} tracks</p>
          <NuxtLink :to="`/playlist/${playlist.id}`" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">View Playlist</NuxtLink>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Please log in to view your playlists and start streaming music.</p>
      <NuxtLink to="/login" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Log In</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
import { usePlaylistStore } from '~/stores/playlist'

const userStore = useUserStore()
const playlistStore = usePlaylistStore()

const user = computed(() => userStore.user)
const playlists = computed(() => playlistStore.playlists)
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  if (user.value) {
    loading.value = true
    try {
      await playlistStore.fetchPlaylists()
    } catch (err) {
      error.value = 'Failed to load playlists'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
})

const createPlaylist = async () => {
  try {
    await playlistStore.createPlaylist('New Playlist')
    // Optionally, navigate to the new playlist
  } catch (err) {
    console.error('Failed to create playlist:', err)
  }
}
</script>