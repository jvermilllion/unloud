// https://nuxt.com/docs/api/configuration/nuxt-config
   export default defineNuxtConfig({
     modules: [
       '@nuxtjs/supabase',
       '@nuxtjs/tailwindcss',
       '@pinia/nuxt',
     ],
     supabase: {
       url: process.env.SUPABASE_URL,
       key: process.env.SUPABASE_KEY,
       redirectOptions: {
         login: '/login',
         callback: '/confirm',
         exclude: ['/', '/register'],
       },
     },
     // ... other configurations
   })