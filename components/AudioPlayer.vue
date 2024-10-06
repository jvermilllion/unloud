<template>
  <div>
    <div v-if="isWebAudioSupported" ref="waveformContainer" class="waveform-container"></div>
    <audio v-else controls :src="audioUrl">
      Your browser does not support the audio element.
    </audio>
    <div v-if="isWebAudioSupported" class="mt-4">
      <button @click="toggleCommentMode" class="bg-blue-500 text-white px-3 py-1 rounded">
        {{ commentMode ? 'Cancel' : 'Add Comment' }}
      </button>
    </div>
    <div v-if="commentMode" class="mt-2">
      <textarea v-model="newComment" placeholder="Enter your comment" class="w-full p-2 border rounded"></textarea>
      <button @click="addComment" class="mt-2 bg-green-500 text-white px-3 py-1 rounded">Submit Comment</button>
    </div>
    <div v-if="comments.length > 0" class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Comments</h3>
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="mb-2 p-2 bg-gray-100 rounded">
          <p>{{ comment.content }}</p>
          <small>{{ formatTimestamp(comment.timestamp) }}</small>
        </li>
      </ul>
    </div>
    <AudioAnalyzer :audioUrl="audioUrl" @enhanced="handleEnhancedAudio" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import { useSupabaseClient, useUser } from '#imports'
import AudioAnalyzer from '~/components/AudioAnalyzer.vue'

const props = defineProps({
  audioUrl: {
    type: String,
    required: true
  },
  trackId: {
    type: String,
    required: true
  }
})

const supabase = useSupabaseClient()
const user = useUser()

const isWebAudioSupported = ref(true)
const waveformContainer = ref(null)
const wavesurfer = ref(null)
const commentMode = ref(false)
const newComment = ref('')
const comments = ref([])

const toggleCommentMode = () => {
  commentMode.value = !commentMode.value
}

const addComment = async () => {
  if (!user.value) {
    alert('Please log in to add a comment.')
    return
  }

  const timestamp = wavesurfer.value.getCurrentTime()
  const { data, error } = await supabase
    .from('comments')
    .insert({
      track_id: props.trackId,
      user_id: user.value.id,
      content: newComment.value,
      timestamp: timestamp
    })

  if (error) {
    console.error('Error adding comment:', error)
    alert('Failed to add comment. Please try again.')
  } else {
    newComment.value = ''
    commentMode.value = false
    fetchComments()
  }
}

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('track_id', props.trackId)
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
  } else {
    comments.value = data
  }
}

const formatTimestamp = (timestamp) => {
  const minutes = Math.floor(timestamp / 60)
  const seconds = Math.floor(timestamp % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

onMounted(async () => {
  if (!window.AudioContext && !window.webkitAudioContext) {
    isWebAudioSupported.value = false
    return
  }

  wavesurfer.value = WaveSurfer.create({
    container: waveformContainer.value,
    waveColor: 'violet',
    progressColor: 'purple',
    cursorColor: 'navy',
    backend: 'WebAudio',
    height: 80,
    responsive: true,
  })

  wavesurfer.value.load(props.audioUrl)

  wavesurfer.value.on('ready', () => {
    fetchComments()
  })

  wavesurfer.value.on('seek', () => {
    if (commentMode.value) {
      addComment()
    }
  })
})

watch(() => props.audioUrl, (newUrl) => {
  if (wavesurfer.value) {
    wavesurfer.value.load(newUrl)
  }
})

const handleEnhancedAudio = (enhancedUrl) => {
  if (wavesurfer.value) {
    wavesurfer.value.load(enhancedUrl)
  }
}
</script>

<style scoped>
.waveform-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>