import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

export function useStorageCheck() {
  const supabase = useSupabaseClient()
  const isStorageAvailable = ref(true)

  const checkStorageAvailability = async () => {
    const { data, error } = await supabase
      .rpc('get_size_of_tables')
    
    if (error) {
      console.error('Error checking database size:', error)
      return false
    }

    // Assuming you're on the free tier with 500MB limit
    const MAX_SIZE_BYTES = 500 * 1024 * 1024
    const currentSize = data[0].size

    isStorageAvailable.value = currentSize < MAX_SIZE_BYTES
    return isStorageAvailable.value
  }

  return {
    isStorageAvailable,
    checkStorageAvailability
  }
}