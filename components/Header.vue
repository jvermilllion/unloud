<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold text-gray-800 dark:text-white">Audio Streaming App</NuxtLink>
      <div class="flex items-center space-x-4">
        <NuxtLink v-if="!user" to="/login" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Login</NuxtLink>
        <NuxtLink v-if="!user" to="/register" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Register</NuxtLink>
        <button v-if="user" @click="logout" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Logout</button>
        <button @click="toggleColorMode" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <span v-if="colorMode.value === 'light'">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useColorMode } from '@vueuse/core'
import { useUserStore } from '~/stores/user'

const colorMode = useColorMode()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
}

const logout = async () => {
  await userStore.logout()
  navigateTo('/login')
}
</script>