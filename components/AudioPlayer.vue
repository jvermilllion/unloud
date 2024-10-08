<template>
  <div v-if="currentTrack" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
    <div class="container mx-auto px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <img :src="currentTrack.coverUrl" alt="Album cover" class="w-12 h-12 object-cover rounded">
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-white">{{ currentTrack.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ currentTrack.artist }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="togglePlay" class="text-gray-800 dark:text-white">
          <span v-if="isPlaying">⏸️</span>
          <span v-else>▶️</span>
        </button>
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" class="w-64">
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAudioStore } from '~/stores/audio'
import { Howl } from 'howler'

const audioStore = useAudioStore()
const currentTrack = computed(() => audioStore.currentTrack)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
let howl = null

watch(currentTrack, (newTrack) => {
  if (newTrack) {
    if (howl) {
      howl.unload()
    }
    howl = new Howl({
      src: [newTrack.url],
      html5: true,
      onplay: () => {
        isPlaying.value = true
        requestAnimationFrame(step)
      },
      onpause: () => {
        isPlaying.value = false
      },
      onend: () => {
        isPlaying.value = false
        currentTime.value = 0
      },
      onload: () => {
        duration.value = howl.duration()
      }
    })
    howl.play()
  }
}, { immediate: true })

const togglePlay = () => {
  if (howl) {
    if (isPlaying.value) {
      howl.pause()
    } else {
      howl.play()
    }
  }
}

const seek = () => {
  if (howl) {
    howl.seek(currentTime.value)
  }
}

const step = () => {
  if (howl) {
    currentTime.value = howl.seek()
    if (isPlaying.value) {
      requestAnimationFrame(step)
    }
  }
}
</script>