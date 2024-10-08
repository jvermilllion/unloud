export default defineNuxtConfig({
  strict: true
},
  modules: [
    '@nuxtjs/supabase',
    // other modules...
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      exclude: [],
    },
  },
  // other configurations...
})

