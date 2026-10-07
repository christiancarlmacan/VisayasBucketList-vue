<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
    <!-- Admin Topbar -->
    <header class="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <RouterLink to="/admin" class="flex items-center gap-2">
              <span class="text-2xl">🌴</span>
              <span class="font-black text-lg text-white tracking-tight">
                Visayas<span class="text-amber-400">Admin</span>
              </span>
            </RouterLink>
            <span class="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-full">
              Control Panel
            </span>
          </div>

          <!-- Nav Links (Desktop) -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              to="/admin"
              class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all"
              :class="$route.path === '/admin' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/admin/destinations"
              class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all"
              :class="$route.path.startsWith('/admin/destinations') ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              Destinations
            </RouterLink>
            <RouterLink
              to="/admin/categories"
              class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all"
              :class="$route.path.startsWith('/admin/categories') ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              Categories
            </RouterLink>
            <RouterLink
              to="/admin/reviews"
              class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all"
              :class="$route.path.startsWith('/admin/reviews') ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              Reviews
            </RouterLink>
            <RouterLink
              to="/admin/users"
              class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all"
              :class="$route.path.startsWith('/admin/users') ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              Users
            </RouterLink>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <RouterLink
              to="/"
              class="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              ← Live Site
            </RouterLink>
            <button
              @click="handleLogout"
              class="px-3 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Admin Footer -->
    <footer class="bg-slate-950 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
      VisayasBucketList Management Console &copy; 2026
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
