import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('validate', {
    mounted(el, binding) {
      const validateInput = (event) => {
        const input = event.target;
        let sanitized = input.value;

        if (binding.value === 'alphanumeric') {
          sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
        } else if (binding.value === 'numeric') {
          sanitized = sanitized.replace(/[^0-9]/g, '');
        }

        if (input.value !== sanitized) {
          input.value = sanitized;
          input.dispatchEvent(new Event('input'));
        }
      };

      el.addEventListener('input', validateInput);
    },
    unmounted(el) {
      el.removeEventListener('input', el.__validateHandler);
    }
  });
});