<template>
  <component :is="currentLayout">
    <router-view />
  </component>
  <ToastContainer />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const currentLayout = computed(() => {
  return route.meta.layout === 'admin' ? AdminLayout : DefaultLayout;
});

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchMe();
  }
});
</script>
