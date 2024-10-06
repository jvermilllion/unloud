<template>
  <div class="bg-paper-light dark:bg-paper-dark text-ink-light dark:text-ink-dark p-4">
    <h1 class="text-3xl font-bold mb-6">Profile</h1>
    <div v-if="user">
      <form @submit.prevent="updateProfile" class="max-w-md mx-auto">
        <div class="mb-4">
          <label for="display_name" class="block mb-2">Display Name</label>
          <input v-model="profile.display_name" id="display_name" type="text" class="w-full p-2 border rounded">
        </div>
        <div class="mb-4">
          <label for="bio" class="block mb-2">Bio</label>
          <textarea v-model="profile.bio" id="bio" rows="3" class="w-full p-2 border rounded"></textarea>
        </div>
        <div class="mb-4">
          <label for="avatar_url" class="block mb-2">Avatar URL</label>
          <input v-model="profile.avatar_url" id="avatar_url" type="url" class="w-full p-2 border rounded">
        </div>
        <button type="submit" class="bg-action-light dark:bg-action-dark text-paper-light dark:text-paper-dark px-4 py-2 rounded hover:opacity-80">
          Update Profile
        </button>
      </form>
      <button @click="logout" class="bg-action-light dark:bg-action-dark text-paper-light dark:text-paper-dark px-4 py-2 rounded hover:opacity-80 mt-4">
        Logout
      </button>
    </div>
    <div v-else>
      <p>Please log in to view your profile.</p>
      <button @click="login" class="bg-action-light dark:bg-action-dark text-paper-light dark:text-paper-dark px-4 py-2 rounded hover:opacity-80 mt-4">
        Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const profile = ref({
  display_name: '',
  bio: '',
  avatar_url: ''
})

onMounted(async () => {
  if (user.value) {
    await fetchProfile()
  }
})

const fetchProfile = async () => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.value.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
  } else if (data) {
    profile.value = data
  }
}

const updateProfile = async () => {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: user.value.id,
      ...profile.value
    })

  if (error) {
    console.error('Error updating profile:', error)
  } else {
    alert('Profile updated successfully!')
  }
}

const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })

  if (error) {
    console.error('Error logging in:', error)
  }
}

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error logging out:', error)
  }
}
</script>