<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Login</h1>
    <form @submit.prevent="handleLogin" class="max-w-md mx-auto">
      <div class="mb-4">
        <label for="email" class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
        <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" :class="{ 'border-red-500': errors.email }">
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Password</label>
        <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" :class="{ 'border-red-500': errors.password }">
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" :disabled="isSubmitting">
        {{ isSubmitting ? 'Logging in...' : 'Log In' }}
      </button>
    </form>
    <p v-if="loginError" class="mt-4 text-center text-red-500">{{ loginError }}</p>
    <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
      Don't have an account? <NuxtLink to="/register" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Register here</NuxtLink>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

const email = ref('')
const password = ref('')
const errors = reactive({})
const loginError = ref('')
const isSubmitting = ref(false)

const validateForm = () => {
  errors.email = email.value ? '' : 'Email is required'
  errors.password = password.value ? '' : 'Password is required'
  return Object.values(errors).every(val => val === '')
}

const handleLogin = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  loginError.value = ''

  try {
    await userStore.login(email.value, password.value)
    navigateTo('/')
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = 'Invalid email or password'
  } finally {
    isSubmitting.value = false
  }
}
</script>