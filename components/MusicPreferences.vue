<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold mb-4">Your Music Preferences</h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="genre in genres"
        :key="genre"
        @click="toggleGenre(genre)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold',
          selectedGenres.includes(genre)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialGenres: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:genres']);

const genres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical',
  'Reggae', 'Folk', 'Metal', 'Blues', 'Latin', 'Indie', 'Alternative'
];

const selectedGenres = ref(props.initialGenres);

const toggleGenre = (genre) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index === -1) {
    selectedGenres.value.push(genre);
  } else {
    selectedGenres.value.splice(index, 1);
  }
};

watch(selectedGenres, (newGenres) => {
  emit('update:genres', newGenres);
}, { deep: true });
</script>