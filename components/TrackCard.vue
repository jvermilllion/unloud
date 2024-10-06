<template>
  <div class="bg-paper-light dark:bg-paper-dark border border-ink-light dark:border-ink-dark p-4 rounded-lg shadow-md transition-colors duration-300">
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="text-xl font-semibold text-ink-light dark:text-ink-dark">{{ track.title }}</h3>
        <p class="text-sm opacity-75 text-ink-light dark:text-ink-dark">{{ track.artist.name }}</p>
      </div>
      <div class="text-sm text-ink-light dark:text-ink-dark opacity-75 flex items-center">
        <span class="mr-1">{{ track.play_count }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <img v-if="track.album && track.album.cover_url" :src="track.album.cover_url" :alt="track.album.title" class="w-full h-48 object-cover mb-4 rounded">
    <AudioPlayer :audioUrl="track.audio_url" :trackId="track.id" @play="incrementPlayCount" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useSupabaseClient } from '#imports';
import AudioPlayer from '~/components/AudioPlayer.vue';

const props = defineProps({
  track: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['play-count-updated']);

const supabase = useSupabaseClient();

const incrementPlayCount = async () => {
  const { data, error } = await supabase
    .from('tracks')
    .update({ play_count: props.track.play_count + 1 })
    .eq('id', props.track.id)
    .select();

  if (error) {
    console.error('Error updating play count:', error);
  } else if (data) {
    emit('play-count-updated', data[0]);
  }
};
</script>