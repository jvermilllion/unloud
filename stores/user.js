import { defineStore } from 'pinia'
import { useSupabaseClient } from '@nuxtjs/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      this.user = data.user
    },
    async register(email, password) {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      this.user = data.user
    },
    async logout() {
      const supabase = useSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      this.user = null
    },
    async fetchUser() {
      const supabase = useSupabaseClient()
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },
  },
})