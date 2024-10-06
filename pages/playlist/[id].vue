<template>
  <div v-if="playlist">
    <h1 class="text-3xl font-bold mb-6">{{ playlist.name }}</h1>
    
    <div v-if="tracks.length > 0">
      <div v-for="track in tracks" :key="track.id" class="mb-6 bg-white p-4 rounded shadow">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold">{{ track.title }}</h3>
          <div class="flex items-center space-x-2">
            <FavoriteButton :trackId="track.id" />
            <button @click="removeFromPlaylist(track.id)" class="text-red-600 hover:text-red-800">
              Remove
            </button>
          </div>
        </div>
        <p class="text-gray-600 mb-2">{{ track.artist.name }}</p>
        <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" />
      </div>
    </div>
    <p v-else class="text-gray-600">This playlist is empty. Add some tracks!</p>
  </div>
  <p v-else>Loading playlist...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSupabaseClient, useUser } from '#imports';
import AudioPlayer from '~/components/AudioPlayer.vue';
import FavoriteButton from '~/components/FavoriteButton.vue';

const supabase = useSupabaseClient();
const user = useUser();
const route = useRoute();

const playlist = ref(null);
const tracks = ref([]);

onMounted(async () => {
  await fetchPlaylist();
  await fetchTracks();
});

const fetchPlaylist = async () => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('id', route.params.id)
    .single();

  if (error) {
    console.error('Error fetching playlist:', error);
  } else {
    playlist.value = data;
  }
};

const fetchTracks = async () => {
  const { data, error } = await supabase
    .from('playlist_tracks')
    .select(`
      track_id,
      tracks (
        id,
        title,
        audio_url,
        artist:artists (id, name)
      )
    `)
    .eq('playlist_id', route.params.id);

  if (error) {
    console.error('Error fetching tracks:', error);
  } else {
    tracks.value = data.map(item => item.tracks);
  }
};

const removeFromPlaylist = async (trackId) => {
  const { error } = await supabase
    .from('playlist_tracks')
    .delete()
    .eq('playlist_id', route.params.id)
    .eq('track_id', trackId);

  if (error) {
    console.error('Error removing track from playlist:', error);
  } else {
    await fetchTracks();
  }
};
</script>