<template>
  <div>
    <h3 class="text-xl font-semibold mb-4">Comments</h3>
    <CommentForm :trackId="trackId" :timestamp="currentTimestamp" @comment-added="fetchComments" />
    <div v-if="comments.length > 0">
      <div v-for="comment in comments" :key="comment.id" class="mb-4 p-4 bg-gray-100 rounded">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold">{{ comment.user?.display_name || 'Anonymous' }}</p>
            <p class="text-sm text-gray-600">{{ formatDate(comment.created_at) }}</p>
          </div>
          <p v-if="comment.timestamp" class="text-sm text-gray-600">
            {{ formatTimestamp(comment.timestamp) }}
          </p>
        </div>
        <p class="mt-2">{{ comment.content }}</p>
      </div>
    </div>
    <p v-else class="text-gray-600">No comments yet. Be the first to comment!</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useSupabaseClient } from '#imports';
import CommentForm from './CommentForm.vue';

const supabase = useSupabaseClient();

const props = defineProps({
  trackId: {
    type: String,
    required: true
  },
  currentTimestamp: {
    type: Number,
    default: null
  }
});

const comments = ref([]);

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:user_profiles(display_name)
    `)
    .eq('track_id', props.trackId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
  } else {
    comments.value = data;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const formatTimestamp = (timestamp) => {
  const minutes = Math.floor(timestamp / 60);
  const seconds = Math.floor(timestamp % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

onMounted(() => {
  fetchComments();
});

watch(() => props.trackId, () => {
  fetchComments();
});
</script>