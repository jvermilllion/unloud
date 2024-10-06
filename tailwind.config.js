/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#ffffff',
          dark: '#121212',
        },
        ink: {
          light: '#333333',
          dark: '#e0e0e0',
        },
        action: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
}