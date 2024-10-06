import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    // Log the error
    console.error('Vue Error:', error)
    console.error('Error Info:', info)

    // You can send the error to a logging service here

    // Show a user-friendly error message
    alert('An error occurred. Our team has been notified.')
  }

  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global Error:', error)
    // You can send the error to a logging service here
  }

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)
    // You can send the error to a logging service here
  })
})