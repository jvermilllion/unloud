<template>
  <form @submit.prevent="submitComment" class="mb-4">
    <textarea
      v-model="commentContent"
      placeholder="Add your comment..."
      class="w-full p-2 border rounded"
      rows="3"
      required
    ></textarea>
    <button
      type="submit"
      class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Add Comment
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabaseClient, useUser } from '#imports';

const supabase = useSupabaseClient();
const user = useUser();

const props = defineProps({
  trackId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['comment-added']);

const commentContent = ref('');

const submitComment = async () => {
  if (!user.value) {
    alert('Please log in to add a comment.');
    return;
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      track_id: props.trackId,
      user_id: user.value.id,
      content: commentContent.value,
      timestamp: props.timestamp
    });

  if (error) {
    console.error('Error adding comment:', error);
    alert('Failed to add comment. Please try again.');
  } else {
    commentContent.value = '';
    emit('comment-added');
  }
};
</script>