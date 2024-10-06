<template>
  <div class="flex justify-center space-x-2 mt-4">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="$emit('page-change', page)"
      :class="[
        'px-3 py-1 rounded',
        currentPage === page
          ? 'bg-action-light dark:bg-action-dark text-paper-light dark:text-paper-dark'
          : 'bg-paper-light dark:bg-paper-dark text-ink-light dark:text-ink-dark'
      ]"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()
</script>