<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Welcome to Audio Streaming App</h1>
    <div v-if="user">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

onMounted(async () => {
  if (user.value) {
    await playlistStore.fetchPlaylists()
  }
})
</script>