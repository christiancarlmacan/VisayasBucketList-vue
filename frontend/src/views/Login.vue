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
            <button
              type="button"
              @click="openForgotModal"
              class="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
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

      <!-- Divider -->
      <div class="relative flex items-center py-1">
        <div class="flex-grow border-t border-slate-200"></div>
        <span class="flex-shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Or continue with
        </span>
        <div class="flex-grow border-t border-slate-200"></div>
      </div>

      <!-- Google OAuth Button -->
      <button
        type="button"
        @click="openGoogleModal('login')"
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
        <span>Continue with Google</span>
      </button>

      <!-- Footer Links -->
      <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Don't have an account yet?
        <RouterLink to="/register" class="font-bold text-teal-600 hover:underline">
          Create one now
        </RouterLink>
      </div>
    </div>

    <!-- Forgot Password / Recovery Modal -->
    <div
      v-if="showForgotModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      @click.self="closeForgotModal"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-2xl">🔐</span>
            <h3 class="text-xl font-black text-slate-900 mt-1">
              Account & Password Recovery
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              {{
                recoveryStep === 1
                  ? 'Verify your account email or recover via Google OAuth.'
                  : `Set a new password for ${recoveryForm.email}`
              }}
            </p>
          </div>
          <button
            @click="closeForgotModal"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          v-if="recoveryError"
          class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>{{ recoveryError }}</span>
        </div>

        <!-- Step 1: Verify Email or Google OAuth Recovery -->
        <div v-if="recoveryStep === 1" class="space-y-4">
          <form @submit.prevent="handleVerifyRecoveryEmail" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Registered Email Address
              </label>
              <input
                v-model="recoveryForm.email"
                type="email"
                required
                placeholder="traveler@visayasbucketlist.ph"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {{ authStore.loading ? 'Verifying Account...' : 'Verify Email to Reset Password →' }}
            </button>
          </form>

          <div class="relative flex items-center py-1">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Or recover using Google OAuth
            </span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            @click="openGoogleModal('recovery')"
            class="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2.5"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Verify & Recover with Google</span>
          </button>
        </div>

        <!-- Step 2: Set New Password -->
        <form v-else @submit.prevent="handleResetPasswordSubmit" class="space-y-4">
          <div class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <span>✅</span>
            <span>
              Identity verified{{ recoveryForm.viaGoogle ? ' via Google OAuth' : '' }}! Enter your new password below.
            </span>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              New Password (min. 6 chars)
            </label>
            <input
              v-model="recoveryForm.newPassword"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Confirm New Password
            </label>
            <input
              v-model="recoveryForm.confirmPassword"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div class="flex gap-2 pt-1">
            <button
              type="button"
              @click="recoveryStep = 1"
              class="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
            >
              {{ authStore.loading ? 'Updating Password...' : 'Save Password & Sign In →' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Google OAuth Account Chooser / Sign-In Modal -->
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
              <h3 class="text-sm font-black text-slate-900">Sign in with Google</h3>
              <p class="text-[11px] text-slate-500">
                {{
                  googleMode === 'recovery'
                    ? 'Verify your Google account to recover your password'
                    : 'Continue to VisayasBucketList'
                }}
              </p>
            </div>
          </div>
          <button
            @click="showGoogleModal = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <!-- Quick Demo Google Account Option -->
        <div class="space-y-2">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Select Account
          </p>
          <button
            type="button"
            @click="selectQuickGoogleAccount({ name: 'Juan Dela Cruz', email: 'traveler@visayasbucketlist.ph' })"
            class="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 transition-all flex items-center gap-3 text-left"
          >
            <div class="w-9 h-9 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
              JD
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-extrabold text-slate-800 truncate">Juan Dela Cruz</p>
              <p class="text-[11px] text-slate-500 truncate">traveler@visayasbucketlist.ph</p>
            </div>
            <span class="text-xs text-teal-600 font-bold">Select →</span>
          </button>
        </div>

        <div class="relative flex items-center py-0.5">
          <div class="flex-grow border-t border-slate-100"></div>
          <span class="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Or use another Google Account
          </span>
          <div class="flex-grow border-t border-slate-100"></div>
        </div>

        <form @submit.prevent="handleGoogleSubmit" class="space-y-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Google Email
            </label>
            <input
              v-model="googleForm.email"
              type="email"
              required
              placeholder="yourname@gmail.com"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <div v-if="googleMode !== 'recovery'">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Display Name
            </label>
            <input
              v-model="googleForm.name"
              type="text"
              placeholder="Your Name"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {{
              authStore.loading
                ? 'Authenticating with Google...'
                : googleMode === 'recovery'
                ? 'Verify Google Account & Reset Password'
                : 'Continue with Google Account'
            }}
          </button>
        </form>
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

const errorMessage = ref('');

// Forgot Password Modal State
const showForgotModal = ref(false);
const recoveryStep = ref(1);
const recoveryError = ref('');
const recoveryForm = reactive({
  email: '',
  resetToken: '',
  newPassword: '',
  confirmPassword: '',
  viaGoogle: false,
});

// Google OAuth Modal State
const showGoogleModal = ref(false);
const googleMode = ref('login'); // 'login' | 'recovery'
const googleForm = reactive({
  email: '',
  name: '',
});

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

const openForgotModal = () => {
  recoveryError.value = '';
  recoveryStep.value = 1;
  recoveryForm.email = form.email || '';
  recoveryForm.resetToken = '';
  recoveryForm.newPassword = '';
  recoveryForm.confirmPassword = '';
  recoveryForm.viaGoogle = false;
  showForgotModal.value = true;
};

const closeForgotModal = () => {
  showForgotModal.value = false;
};

const handleVerifyRecoveryEmail = async () => {
  recoveryError.value = '';
  try {
    const data = await authStore.requestPasswordReset(recoveryForm.email);
    recoveryForm.resetToken = data.resetToken;
    recoveryForm.viaGoogle = false;
    recoveryStep.value = 2;
  } catch (err) {
    recoveryError.value = err.message || 'Could not verify email address.';
  }
};

const handleResetPasswordSubmit = async () => {
  recoveryError.value = '';
  if (recoveryForm.newPassword !== recoveryForm.confirmPassword) {
    recoveryError.value = 'Passwords do not match.';
    return;
  }
  try {
    const user = await authStore.resetPassword({
      email: recoveryForm.email,
      resetToken: recoveryForm.resetToken,
      newPassword: recoveryForm.newPassword,
      viaGoogle: recoveryForm.viaGoogle,
    });
    showForgotModal.value = false;
    toast.success(`Password updated! Welcome back, ${user.name}! 🌴`);
    const redirectPath = route.query.redirect || '/bucket-list';
    router.push(redirectPath);
  } catch (err) {
    recoveryError.value = err.message || 'Failed to reset password.';
  }
};

const openGoogleModal = (mode = 'login') => {
  googleMode.value = mode;
  googleForm.email = mode === 'recovery' ? recoveryForm.email : form.email;
  googleForm.name = '';
  showGoogleModal.value = true;
};

const selectQuickGoogleAccount = async ({ email, name }) => {
  googleForm.email = email;
  googleForm.name = name;
  await handleGoogleSubmit();
};

const handleGoogleSubmit = async () => {
  errorMessage.value = '';
  recoveryError.value = '';

  if (googleMode.value === 'recovery') {
    recoveryForm.email = googleForm.email.trim();
    recoveryForm.viaGoogle = true;
    recoveryForm.resetToken = 'google-oauth-verified';
    showGoogleModal.value = false;
    showForgotModal.value = true;
    recoveryStep.value = 2;
    return;
  }

  try {
    const displayName =
      googleForm.name.trim() || googleForm.email.split('@')[0].replace(/[._]/g, ' ');
    const user = await authStore.googleLogin({
      email: googleForm.email,
      name: displayName,
    });
    showGoogleModal.value = false;
    toast.success(`Signed in with Google as ${user.name}! 🌴`);
    const redirectPath = route.query.redirect || '/bucket-list';
    router.push(redirectPath);
  } catch (err) {
    showGoogleModal.value = false;
    errorMessage.value = err.message || 'Google sign-in failed.';
  }
};
</script>
