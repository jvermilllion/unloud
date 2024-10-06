<template>
  <div class="min-h-screen bg-paper-light dark:bg-paper-dark text-ink-light dark:text-ink-dark">
    <nav class="p-4 bg-gray-100 dark:bg-gray-800">
      <NuxtLink to="/" class="mr-4">Home</NuxtLink>
      <NuxtLink to="/upload" class="mr-4">Upload</NuxtLink>
      <NuxtLink to="/profile" class="mr-4">Profile</NuxtLink>
    </nav>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Any necessary imports or setup code
</script>