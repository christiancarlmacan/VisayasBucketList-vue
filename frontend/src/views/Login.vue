<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <span class="text-3xl">🌴</span>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          Welcome Back, Traveler!
        </h2>
        <p class="text-xs text-slate-500">
          Sign in to your VisayasBucketList account to track your travels.
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
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </label>
          </div>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <!-- Open Eye Icon (when password is visible) -->
              <svg
                v-if="showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <!-- Closed/Slashed Eye Icon (when password is hidden) -->
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
        >
          <span v-if="authStore.loading">Signing in...</span>
          <span v-else>Sign In to Account →</span>
        </button>
      </form>

      <!-- Footer Links -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have an account yet?
        <RouterLink to="/register" class="font-bold text-teal-600 hover:underline">
          Create one now
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToastStore();

const form = reactive({
  email: '',
  password: '',
});

const showPassword = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  try {
    const user = await authStore.login({
      email: form.email,
      password: form.password,
    });
    toast.success(`Welcome back, ${user.name}! 🌴`);
    const redirectPath = route.query.redirect || '/bucket-list';
    router.push(redirectPath);
  } catch (err) {
    errorMessage.value = err.message || 'Login failed. Please check credentials.';
  }
};
</script>
