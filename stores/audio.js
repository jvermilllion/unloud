import { defineStore } from 'pinia'

export const useAudioStore = defineStore('audio', {
  state: () => ({
    currentTrack: null,
  }),
  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track
    },
  },
})