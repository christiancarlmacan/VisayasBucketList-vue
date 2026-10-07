import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
  }),
  actions: {
    showToast(message, type = 'success', duration = 3500) {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    success(message, duration) {
      this.showToast(message, 'success', duration);
    },
    error(message, duration) {
      this.showToast(message, 'error', duration);
    },
    info(message, duration) {
      this.showToast(message, 'info', duration);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
