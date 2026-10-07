<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Profile Header Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <!-- Avatar -->
      <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-3xl font-black flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
        <img
          v-if="profile?.profile_image"
          :src="profile.profile_image"
          :alt="profile.name"
          class="w-full h-full object-cover rounded-3xl"
        />
        <span v-else>{{ initials }}</span>
      </div>

      <!-- Info & Edit form -->
      <div class="flex-grow space-y-3 text-center sm:text-left w-full">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {{ profile?.name }}
            </h1>
            <p class="text-xs text-slate-400 font-medium">
              {{ profile?.email }}
            </p>
          </div>

          <div class="flex items-center justify-center sm:justify-end gap-2">
            <span
              v-if="profile?.role === 'ADMIN'"
              class="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-black uppercase tracking-wider rounded-full"
            >
              System Admin
            </span>
            <span
              v-else
              class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full"
            >
              Visayas Explorer
            </span>
            <button
              @click="editing = !editing"
              class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              {{ editing ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div v-if="editing" class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mt-4">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Full Name</label>
            <input
              v-model="editName"
              type="text"
              class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">Avatar Image URL</label>
            <input
              v-model="editImage"
              type="url"
              placeholder="https://..."
              class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            />
          </div>
          <button
            @click="handleSaveProfile"
            :disabled="saving"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <!-- Member Since -->
        <p class="text-[11px] text-slate-400">
          Member since {{ formattedJoinDate }}
        </p>
      </div>
    </div>

    <!-- Travel Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <RouterLink
        to="/bucket-list"
        class="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-teal-200 transition-all block group"
      >
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Bucket List</span>
        <span class="text-2xl font-black text-slate-900 mt-1 block group-hover:text-teal-600 transition-colors">
          {{ profile?.stats?.totalBucketList || 0 }}
        </span>
      </RouterLink>

      <RouterLink
        to="/visited"
        class="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-200 transition-all block group"
      >
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Visited Spots</span>
        <span class="text-2xl font-black text-emerald-600 mt-1 block">
          {{ profile?.stats?.visitedCount || 0 }} 🎉
        </span>
      </RouterLink>

      <RouterLink
        to="/favorites"
        class="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-rose-200 transition-all block group"
      >
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Favorites</span>
        <span class="text-2xl font-black text-rose-500 mt-1 block">
          {{ profile?.stats?.favoritesCount || 0 }} ❤️
        </span>
      </RouterLink>

      <RouterLink
        to="/achievements"
        class="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-amber-200 transition-all block group"
      >
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Achievements</span>
        <span class="text-2xl font-black text-amber-500 mt-1 block">
          {{ profile?.stats?.achievementsCount || 0 }} 🏆
        </span>
      </RouterLink>
    </div>

    <!-- Quick Navigation Panels -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
      <h3 class="text-base font-black text-slate-900">Your Travel Dashboard</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RouterLink
          to="/explore"
          class="p-4 bg-slate-50 hover:bg-teal-50/60 rounded-2xl border border-slate-100 transition-all flex items-center gap-3"
        >
          <span class="text-2xl">🗺️</span>
          <div>
            <span class="text-xs font-black text-slate-800 block">Explore Destinations</span>
            <span class="text-[10px] text-slate-400">Discover new Visayas islands</span>
          </div>
        </RouterLink>

        <RouterLink
          to="/achievements"
          class="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-100 transition-all flex items-center gap-3"
        >
          <span class="text-2xl">🎖️</span>
          <div>
            <span class="text-xs font-black text-slate-800 block">Travel Achievements</span>
            <span class="text-[10px] text-slate-400">Track and unlock travel badges</span>
          </div>
        </RouterLink>

        <RouterLink
          v-if="profile?.role === 'ADMIN'"
          to="/admin"
          class="p-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl transition-all flex items-center gap-3"
        >
          <span class="text-2xl">⚡</span>
          <div>
            <span class="text-xs font-black text-amber-400 block">Admin Dashboard</span>
            <span class="text-[10px] text-slate-300">Manage spots, users, reviews</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const authStore = useAuthStore();
const toast = useToastStore();

const profile = ref(null);
const editing = ref(false);
const editName = ref('');
const editImage = ref('');
const saving = ref(false);

const initials = computed(() => {
  const name = profile.value?.name || authStore.user?.name || 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const formattedJoinDate = computed(() => {
  if (!profile.value?.created_at) return '';
  return new Date(profile.value.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

const loadProfile = async () => {
  try {
    const res = await api.get('/users/profile');
    profile.value = res.data.profile;
    editName.value = profile.value.name;
    editImage.value = profile.value.profile_image || '';
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
};

onMounted(loadProfile);

const handleSaveProfile = async () => {
  if (!editName.value || editName.value.trim().length < 2) {
    toast.error('Name must be at least 2 characters.');
    return;
  }
  saving.value = true;
  try {
    const res = await api.put('/users/profile', {
      name: editName.value,
      profile_image: editImage.value,
    });
    profile.value.name = res.data.user.name;
    profile.value.profile_image = res.data.user.profile_image;
    authStore.user = { ...authStore.user, name: res.data.user.name, profile_image: res.data.user.profile_image };
    localStorage.setItem('user', JSON.stringify(authStore.user));
    editing.value = false;
    toast.success('Profile updated successfully!');
  } catch (err) {
    toast.error(err.message);
  } finally {
    saving.value = false;
  }
};
</script>
