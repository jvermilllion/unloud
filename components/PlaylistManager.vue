<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Your Playlists</h2>
    <ul class="space-y-2">
      <li v-for="playlist in playlists" :key="playlist.id" class="flex justify-between items-center">
        <NuxtLink :to="`/playlist/${playlist.id}`" class="text-blue-600 hover:underline">
          {{ playlist.name }}
        </NuxtLink>
        <button @click="deletePlaylist(playlist.id)" class="text-red-600 hover:text-red-800">
          Delete
        </button>
      </li>
    </ul>
    <form @submit.prevent="createPlaylist" class="mt-4">
      <input v-model="newPlaylistName" type="text" placeholder="New playlist name" required
        class="border rounded px-2 py-1 mr-2">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Playlist
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useUser } from '#imports'
import type { Playlist } from '~/types/supabase'

const supabase = useSupabaseClient()
const user = useUser()

const playlists = ref<Playlist[]>([])
const newPlaylistName = ref('')

onMounted(() => {
  fetchPlaylists()
})

const fetchPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', user.value?.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching playlists:', error)
  } else {
    playlists.value = data
  }
}

const createPlaylist = async () => {
  const { data, error } = await supabase
    .from('playlists')
    .insert({
      user_id: user.value?.id,
      name: newPlaylistName.value
    })

  if (error) {
    console.error('Error creating playlist:', error)
  } else {
    newPlaylistName.value = ''
    fetchPlaylists()
  }
}

const deletePlaylist = async (playlistId: string) => {
  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', playlistId)
    .eq('user_id', user.value?.id)

  if (error) {
    console.error('Error deleting playlist:', error)
  } else {
    fetchPlaylists()
  }
}
</script>