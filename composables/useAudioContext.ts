import { ref } from 'vue'

export function useAudioContext() {
  const audioContext = ref<AudioContext | null>(null)

  const getAudioContext = (): AudioContext => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContext.value
  }

  const decodeAudioData = async (arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
    const context = getAudioContext()
    return await context.decodeAudioData(arrayBuffer)
  }

  const createBufferSource = (buffer: AudioBuffer): AudioBufferSourceNode => {
    const context = getAudioContext()
    const source = context.createBufferSource()
    source.buffer = buffer
    return source
  }

  return {
    getAudioContext,
    decodeAudioData,
    createBufferSource,
  }
}