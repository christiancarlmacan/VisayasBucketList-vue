<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <span class="text-3xl">🎒</span>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          Create Your Travel Account
        </h2>
        <p class="text-xs text-slate-500">
          Join thousands of travelers exploring the Philippine Visayas region.
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2"
      >
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Full Name
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Juan Dela Cruz"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="juan@example.com"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Password (min. 6 characters)
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
        >
          <span v-if="authStore.loading">Creating account...</span>
          <span v-else>Register Account →</span>
        </button>
      </form>

      <!-- Footer Links -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?
        <RouterLink to="/login" class="font-bold text-teal-600 hover:underline">
          Sign In
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToastStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
});

const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  try {
    const user = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    toast.success(`Welcome to VisayasBucketList, ${user.name}! 🌴`);
    router.push('/bucket-list');
  } catch (err) {
    errorMessage.value = err.message || 'Registration failed. Please try again.';
  }
};
</script>
