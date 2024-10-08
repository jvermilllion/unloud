export default defineNuxtPlugin(async (nuxtApp) => {
     const user = useSupabaseUser()
     const userStore = useUserStore()

     if (user.value) {
       await userStore.fetchUser()
     }

     nuxtApp.$supabase.auth.onAuthStateChange(async (event, session) => {
       if (event === 'SIGNED_IN' && session) {
         await userStore.fetchUser()
       } else if (event === 'SIGNED_OUT') {
         userStore.clearUser()
       }
     })
   })