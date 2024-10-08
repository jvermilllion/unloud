<template>
  <div class="relative">
    <input
      type="text"
      v-model="searchQuery"
      @input="search"
      placeholder="Search for tracks..."
      class="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
    />
    <ul v-if="searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
      <li v-for="result in searchResults" :key="result.id" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" @click="selectTrack(result)">
        {{ result.title }} - {{ result.artist }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlaylistStore } from '~/stores/playlist'

const playlistStore = usePlaylistStore()
const searchQuery = ref('')
const searchResults = ref([])

const search = async () => {
  if (searchQuery.value.length > 2) {
    searchResults.value = await playlistStore.searchTracks(searchQuery.value)
  } else {
    searchResults.value = []
  }
}

const selectTrack = (track) => {
  // Emit an event with the selected track
  emit('track-selected', track)
  searchQuery.value = ''
  searchResults.value = []
}
</script>