<template>
  <div v-if="album">
    <h1 class="text-3xl font-bold mb-6">{{ album.title }}</h1>
    <p class="text-xl mb-4">{{ album.artist.name }}</p>
    <img :src="album.cover_url" :alt="album.title" class="w-64 h-64 object-cover mb-6">
    
    <h2 class="text-2xl font-semibold mb-4">Tracks</h2>
    <div v-for="track in tracks" :key="track.id" class="mb-6 bg-white p-4 rounded shadow">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold">{{ track.title }}</h3>
        <div class="flex items-center space-x-2">
          <FavoriteButton :trackId="track.id" />
          <AddToPlaylistButton :trackId="track.id" />
        </div>
      </div>
      <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" />
    </div>
  </div>
  <p v-else>Loading album...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSupabaseClient } from '#imports';
import FavoriteButton from '~/components/FavoriteButton.vue';
import AddToPlaylistButton from '~/components/AddToPlaylistButton.vue';

const supabase = useSupabaseClient();
const route = useRoute();
const album = ref(null);
const tracks = ref([]);

onMounted(async () => {
  const { data: albumData, error: albumError } = await supabase
    .from('albums')
    .select(`
      *,
      artist:artists(name)
    `)
    .eq('id', route.params.id)
    .single();

  if (albumError) {
    console.error('Error fetching album:', albumError);
  } else {
    album.value = albumData;
  }

  const { data: tracksData, error: tracksError } = await supabase
    .from('tracks')
    .select('*')
    .eq('album_id', route.params.id)
    .order('track_number', { ascending: true });

  if (tracksError) {
    console.error('Error fetching tracks:', tracksError);
  } else {
    tracks.value = tracksData;
  }
});
</script>