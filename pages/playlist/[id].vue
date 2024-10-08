<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p class="text-gray-600 dark:text-gray-300">Loading playlist...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <p class="text-red-500">{{ error }}</p>
    </div>
    <div v-else>
      <!-- Existing content -->
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

// ... rest of the existing code
</script>