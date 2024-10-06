<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <button @click="signInWithGoogle" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Sign in with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    console.error('Error signing in with Google:', error)
  }
}
</script>