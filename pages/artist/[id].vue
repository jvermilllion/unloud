<template>
  <div v-if="artist" class="space-y-8">
    <div class="flex items-center space-x-6">
      <img :src="artist.image_url" :alt="artist.name" class="w-32 h-32 object-cover rounded-full">
      <div>
        <h1 class="text-4xl font-bold text-ink-light dark:text-ink-dark">{{ artist.name }}</h1>
        <p class="text-xl opacity-75 text-ink-light dark:text-ink-dark">{{ artist.genre }}</p>
      </div>
    </div>

    <div v-if="albums.length > 0">
      <h2 class="text-2xl font-bold mb-4 text-ink-light dark:text-ink-dark">Albums</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="album in albums" :key="album.id" class="bg-paper-light dark:bg-paper-dark border border-ink-light dark:border-ink-dark p-4 rounded-lg shadow-md transition-colors duration-300">
          <img :src="album.cover_url" :alt="album.title" class="w-full h-48 object-cover mb-4 rounded">
          <h3 class="text-xl font-semibold mb-2 text-ink-light dark:text-ink-dark">{{ album.title }}</h3>
          <p class="opacity-75 mb-2 text-ink-light dark:text-ink-dark">{{ album.release_date }}</p>
          <button @click="toggleAlbumTracks(album.id)" class="text-action-light dark:text-action-dark hover:underline">
            {{ expandedAlbums.includes(album.id) ? 'Hide Tracks' : 'Show Tracks' }}
          </button>
          <div v-if="expandedAlbums.includes(album.id)" class="mt-4 space-y-2">
            <div v-for="track in album.tracks" :key="track.id" class="flex justify-between items-center">
              <span class="text-ink-light dark:text-ink-dark">{{ track.title }}</span>
              <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="relatedArtists.length > 0">
      <h2 class="text-2xl font-bold mb-4 text-ink-light dark:text-ink-dark">Related Artists</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ArtistCard v-for="relatedArtist in relatedArtists" :key="relatedArtist.id" :artist="relatedArtist" />
      </div>
    </div>
  </div>
  <p v-else class="text-ink-light dark:text-ink-dark">Loading artist information...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSupabaseClient } from '#imports';
import AudioPlayer from '~/components/AudioPlayer.vue';
import ArtistCard from '~/components/ArtistCard.vue';

const supabase = useSupabaseClient();
const route = useRoute();

const artist = ref(null);
const albums = ref([]);
const relatedArtists = ref([]);
const expandedAlbums = ref([]);

onMounted(async () => {
  await fetchArtistData();
  await fetchAlbums();
  await fetchRelatedArtists();
});

const fetchArtistData = async () => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', route.params.id)
    .single();

  if (error) {
    console.error('Error fetching artist data:', error);
  } else {
    artist.value = data;
  }
};

const fetchAlbums = async () => {
  const { data, error } = await supabase
    .from('albums')
    .select(`
      id,
      title,
      cover_url,
      release_date,
      tracks (
        id,
        title,
        audio_url
      )
    `)
    .eq('artist_id', route.params.id)
    .order('release_date', { ascending: false });

  if (error) {
    console.error('Error fetching albums:', error);
  } else {
    albums.value = data;
  }
};

const fetchRelatedArtists = async () => {
  if (!artist.value) return;

  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .neq('id', artist.value.id)
    .eq('genre', artist.value.genre)
    .limit(4);

  if (error) {
    console.error('Error fetching related artists:', error);
  } else {
    relatedArtists.value = data;
  }
};

const toggleAlbumTracks = (albumId) => {
  const index = expandedAlbums.value.indexOf(albumId);
  if (index === -1) {
    expandedAlbums.value.push(albumId);
  } else {
    expandedAlbums.value.splice(index, 1);
  }
};
</script>