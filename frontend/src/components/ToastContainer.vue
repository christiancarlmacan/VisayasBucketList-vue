<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all text-xs font-bold"
        :class="getToastClasses(toast.type)"
      >
        <div class="flex items-center gap-3">
          <span class="text-base">{{ getToastIcon(toast.type) }}</span>
          <span class="leading-snug">{{ toast.message }}</span>
        </div>
        <button
          @click="toastStore.removeToast(toast.id)"
          class="ml-3 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast';

const toastStore = useToastStore();

const getToastClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10';
    case 'error':
      return 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/10';
    case 'info':
    default:
      return 'bg-teal-50/95 border-teal-200 text-teal-900 shadow-teal-500/10';
  }
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '⚠️';
    case 'info':
    default:
      return '🌴';
  }
};
</script>
