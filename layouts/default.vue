<template>
  <div class="min-h-screen bg-paper-light dark:bg-paper-dark text-ink-light dark:text-ink-dark">
    <header class="bg-paper-light dark:bg-paper-dark shadow-md">
      <nav class="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-action-light dark:text-action-dark mb-4 sm:mb-0">AudioStream</NuxtLink>
        <div class="flex flex-wrap justify-center sm:justify-end space-x-4">
          <NuxtLink to="/upload" class="hover:text-action-light dark:hover:text-action-dark transition-colors">Upload</NuxtLink>
          <NuxtLink to="/profile" class="hover:text-action-light dark:hover:text-action-dark transition-colors">Profile</NuxtLink>
          <button @click="toggleDarkMode" class="focus:outline-none">
            <span v-if="isDarkMode">🌞</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-paper-light dark:bg-paper-dark mt-auto py-4">
      <div class="container mx-auto px-4 text-center text-ink-light dark:text-ink-dark">
        &copy; {{ new Date().getFullYear() }} AudioStream. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '#imports'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

useHead({
  htmlAttrs: {
    class: isDarkMode.value ? 'dark' : ''
  }
})
</script>