<script setup>
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import { useStorageCheck } from '~/composables/useStorageCheck'

const supabase = useSupabaseClient()
const { isStorageAvailable, checkStorageAvailability } = useStorageCheck()

// ... existing code ...

const uploadTrack = async () => {
  if (!audioFile.value) return

  uploadStatus.value = 'Checking storage availability...'
  uploadError.value = ''

  const storageAvailable = await checkStorageAvailability()

  if (!storageAvailable) {
    uploadError.value = 'Storage limit reached. Unable to upload at this time.'
    return
  }

  uploadStatus.value = 'Uploading...'

  // ... rest of the upload logic ...
}
</script>