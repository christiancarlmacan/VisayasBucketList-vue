<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <span class="text-2xl group-hover:scale-110 transition-transform">🌴</span>
          <span class="font-black text-xl tracking-tight bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Visayas<span class="text-amber-500 font-extrabold">BucketList</span>
          </span>
        </RouterLink>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1 lg:space-x-2">
          <RouterLink
            to="/explore"
            class="px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors"
            :class="$route.path === '/explore' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            Explore
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/bucket-list"
              class="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1.5"
              :class="$route.path === '/bucket-list' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              <span>Bucket List</span>
              <span
                v-if="bucketListStore.items.length > 0"
                class="px-1.5 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-full"
              >
                {{ bucketListStore.items.length }}
              </span>
            </RouterLink>

            <RouterLink
              to="/visited"
              class="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors"
              :class="$route.path === '/visited' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              Visited 🎉
            </RouterLink>

            <RouterLink
              to="/favorites"
              class="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors"
              :class="$route.path === '/favorites' ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
            >
              Favorites
            </RouterLink>

            <RouterLink
              to="/achievements"
              class="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1"
              :class="$route.path === '/achievements' ? 'text-amber-800 bg-amber-50' : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/50'"
            >
              <span>🏆</span>
              <span>Badges</span>
            </RouterLink>
          </template>
        </nav>

        <!-- Auth & Admin Controls (Desktop) -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center gap-3 pl-3 border-l border-slate-200">
              <!-- Admin Switcher Link -->
              <RouterLink
                v-if="authStore.isAdmin"
                to="/admin"
                class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-xs"
              >
                <span>⚡</span>
                <span>Admin Panel</span>
              </RouterLink>

              <RouterLink
                to="/profile"
                class="text-right hover:opacity-80 transition-opacity"
              >
                <p class="text-xs font-bold text-slate-800 leading-none">
                  {{ authStore.user?.name }}
                </p>
                <span
                  v-if="authStore.isAdmin"
                  class="text-[9px] font-extrabold text-teal-700 uppercase tracking-widest"
                >
                  Admin
                </span>
                <span v-else class="text-[10px] text-slate-400">My Profile</span>
              </RouterLink>

              <button
                @click="handleLogout"
                class="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
            >
              Sign In
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-teal-600/20 active:scale-95"
            >
              Get Started
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-100 space-y-2">
        <RouterLink
          to="/explore"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Explore Destinations
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/bucket-list"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            My Bucket List ({{ bucketListStore.items.length }})
          </RouterLink>
          <RouterLink
            to="/visited"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Visited Spots 🎉
          </RouterLink>
          <RouterLink
            to="/favorites"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            My Favorites
          </RouterLink>
          <RouterLink
            to="/achievements"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            Travel Achievements 🏆
          </RouterLink>
          <RouterLink
            to="/profile"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            My Profile
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-sm font-black text-amber-600 bg-amber-50/60"
          >
            ⚡ Admin Control Panel
          </RouterLink>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
            <span class="text-xs font-bold text-slate-700">{{ authStore.user?.name }}</span>
            <button
              @click="handleLogout"
              class="text-xs font-bold text-rose-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-2 pt-2">
            <RouterLink
              to="/login"
              @click="mobileMenuOpen = false"
              class="w-full text-center py-2 text-sm font-semibold border border-slate-200 rounded-xl"
            >
              Sign In
            </RouterLink>
            <RouterLink
              to="/register"
              @click="mobileMenuOpen = false"
              class="w-full text-center py-2 text-sm font-bold bg-teal-600 text-white rounded-xl shadow-sm"
            >
              Register
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBucketListStore } from '@/stores/bucketList';

const router = useRouter();
const authStore = useAuthStore();
const bucketListStore = useBucketListStore();

const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  mobileMenuOpen.value = false;
  router.push('/login');
};
</script>
