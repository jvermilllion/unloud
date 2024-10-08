export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Log the error
    console.error('Global error:', error)
    console.error('Error info:', info)

    // You can also send the error to an error tracking service here
  }

  // Handle Nuxt-specific errors
  nuxtApp.hook('vue:error', (error, instance, info) => {
    // Log the error
    console.error('Nuxt error:', error)
    console.error('Error info:', info)
  })
})