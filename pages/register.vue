<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Register</h1>
    <form @submit.prevent="handleRegister" class="max-w-md mx-auto">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
        <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Password</label>
        <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
      </div>
      <div class="mb-6">
        <label for="confirmPassword" class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Confirm Password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600">
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Register
      </button>
    </form>
    <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
      Already have an account? <NuxtLink to="/login" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Login here</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    console.error('Passwords do not match')
    // Handle password mismatch (e.g., show error message to user)
    return
  }

  try {
    await userStore.register(email.value, password.value)
    navigateTo('/')
  } catch (error) {
    console.error('Registration failed:', error)
    // Handle registration error (e.g., show error message to user)
  }
}
</script>