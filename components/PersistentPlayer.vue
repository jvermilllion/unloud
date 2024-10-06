<template>
  <div v-if="currentTrack" class="fixed bottom-0 left-0 right-0 bg-paper-light dark:bg-paper-dark p-4 shadow-lg">
    <div class="flex items-center justify-between max-w-4xl mx-auto">
      <div class="flex items-center">
        <img :src="currentTrack.album?.cover_url || '/default-album-cover.png'" alt="Album cover" class="w-12 h-12 mr-4">
        <div>
          <p class="font-semibold">{{ currentTrack.title }}</p>
          <p class="text-sm text-gray-600">{{ currentTrack.artist?.name }}</p>
        </div>
      </div>
      <div class="flex items-center">
        <button @click="togglePlay" class="mr-4">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="w-48">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Track } from '~/types/supabase'

const supabase = useSupabaseClient()
const currentTrack = ref<Track | null>(null)
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)

const playTrack = (track: Track) => {
  currentTrack.value = track
  if (audio.value) {
    audio.value.src = track.audio_url
    audio.value.play()
    isPlaying.value = true
  }
}

const togglePlay = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const seek = () => {
  if (audio.value) {
    audio.value.currentTime = currentTime.value
  }
}

onMounted(() => {
  audio.value = new Audio()
  audio.value.addEventListener('timeupdate', () => {
    currentTime.value = audio.value?.currentTime || 0
  })
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value?.duration || 0
  })
  audio.value.addEventListener('ended', () => {
    isPlaying.value = false
  })

  window.addEventListener('play-track', ((event: CustomEvent) => {
    playTrack(event.detail)
  }) as EventListener)
})

watch(currentTrack, async (newTrack) => {
  if (newTrack) {
    // Increment play count
    await supabase
      .from('tracks')
      .update({ play_count: newTrack.play_count + 1 })
      .eq('id', newTrack.id)
  }
})
</script>