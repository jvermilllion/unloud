export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('sanitize', {
      mounted(el, binding) {
        const sanitizeInput = (event) => {
          const input = event.target;
          let sanitized = input.value.replace(/[<>&]/g, '');
          if (binding.value === 'alphanumeric') {
            sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
          }
          if (input.value !== sanitized) {
            input.value = sanitized;
            input.dispatchEvent(new Event('input'));
          }
        };
  
        el.addEventListener('input', sanitizeInput);
      },
      unmounted(el) {
        el.removeEventListener('input', el.__sanitizeHandler);
      }
    });
  });