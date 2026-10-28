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

      <!-- Divider -->
      <div class="relative flex items-center py-1">
        <div class="flex-grow border-t border-slate-200"></div>
        <span class="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Or sign up with
        </span>
        <div class="flex-grow border-t border-slate-200"></div>
      </div>

      <!-- Google Sign-Up Button -->
      <button
        type="button"
        @click="showGoogleModal = true"
        :disabled="authStore.loading"
        class="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
          />
        </svg>
        <span>Sign up with Google</span>
      </button>

      <!-- Footer Links -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?
        <RouterLink to="/login" class="font-bold text-teal-600 hover:underline">
          Sign In
        </RouterLink>
      </div>
    </div>

    <!-- Google OAuth Modal -->
    <div
      v-if="showGoogleModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      @click.self="showGoogleModal = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-2.5">
            <svg class="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <div>
              <h3 class="text-sm font-black text-slate-900">Sign up with Google</h3>
              <p class="text-[11px] text-slate-500">Continue to VisayasBucketList</p>
            </div>
          </div>
          <button
            @click="showGoogleModal = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleGoogleSignUp" class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Full Name
            </label>
            <input
              v-model="googleForm.name"
              type="text"
              required
              placeholder="Maria Clara"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Google Email
            </label>
            <input
              v-model="googleForm.email"
              type="email"
              required
              placeholder="mariaclara@gmail.com"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {{ authStore.loading ? 'Creating Account...' : 'Continue with Google' }}
          </button>
        </form>
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
const showGoogleModal = ref(false);
const googleForm = reactive({
  name: '',
  email: '',
});

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

const handleGoogleSignUp = async () => {
  errorMessage.value = '';
  try {
    const user = await authStore.googleLogin({
      email: googleForm.email,
      name: googleForm.name,
    });
    showGoogleModal.value = false;
    toast.success(`Welcome to VisayasBucketList, ${user.name}! 🌴`);
    router.push('/bucket-list');
  } catch (err) {
    showGoogleModal.value = false;
    errorMessage.value = err.message || 'Google sign-up failed.';
  }
};
</script>
