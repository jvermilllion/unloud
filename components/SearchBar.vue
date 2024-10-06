<template>
  <div class="mb-8">
    <input
      v-model="searchQuery"
      @input="search"
      type="text"
      placeholder="Search for tracks, albums, or artists"
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const searchQuery = ref('')
const emit = defineEmits(['search-results'])

const search = async () => {
  if (searchQuery.value.length < 2) {
    emit('search-results', [])
    return
  }

  const { data, error } = await supabase
    .from('tracks')
    .select(`
      id,
      title,
      audio_url,
      albums!inner(id, title, cover_url),
      artists!inner(id, name)
    `)
    .or(`title.ilike.%${searchQuery.value}%,albums.title.ilike.%${searchQuery.value}%,artists.name.ilike.%${searchQuery.value}%`)
    .limit(10)

  if (error) {
    console.error('Error searching:', error)
    return
  }

  emit('search-results', data)
}
</script>