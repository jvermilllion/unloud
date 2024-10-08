<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Header />
    <NuxtPage />
    <AudioPlayer />
  </div>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()
</script>