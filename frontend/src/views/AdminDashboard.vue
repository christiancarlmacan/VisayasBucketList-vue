<template>
  <div class="space-y-8">
    <!-- Top Welcome -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Overview of platform activity, destinations, traveler reviews, and users.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
          to="/admin/destinations"
          class="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-teal-500/20"
        >
          + Add Destination
        </RouterLink>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
        <span class="text-2xl font-black text-white mt-1 block">
          {{ stats?.counts?.users || 0 }} 👥
        </span>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Destinations</span>
        <span class="text-2xl font-black text-white mt-1 block">
          {{ stats?.counts?.destinations || 0 }} 📍
        </span>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Traveler Reviews</span>
        <span class="text-2xl font-black text-white mt-1 block">
          {{ stats?.counts?.reviews || 0 }} ⭐
        </span>
      </div>

      <div class="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Bucket List Saves</span>
        <span class="text-2xl font-black text-white mt-1 block">
          {{ stats?.counts?.bucketLists || 0 }} 🔖
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="h-64 bg-slate-800/50 rounded-2xl animate-pulse"></div>

    <!-- Recent Lists Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Destinations -->
      <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-black text-white uppercase tracking-wider">
            Recent Destinations
          </h2>
          <RouterLink
            to="/admin/destinations"
            class="text-xs font-bold text-teal-400 hover:text-teal-300"
          >
            Manage All →
          </RouterLink>
        </div>

        <div class="divide-y divide-slate-700/50">
          <div
            v-for="d in stats?.recentDestinations"
            :key="d.id"
            class="py-3 flex items-center justify-between gap-4"
          >
            <div>
              <p class="text-xs font-bold text-slate-200">{{ d.name }}</p>
              <span class="text-[10px] text-slate-400">{{ d.location }} • {{ d.category?.name }}</span>
            </div>
            <RouterLink
              :to="`/destinations/${d.slug || d.id}`"
              target="_blank"
              class="text-[10px] font-bold text-slate-400 hover:text-white"
            >
              View ↗
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-black text-white uppercase tracking-wider">
            Latest Reviews
          </h2>
          <RouterLink
            to="/admin/reviews"
            class="text-xs font-bold text-teal-400 hover:text-teal-300"
          >
            Moderate All →
          </RouterLink>
        </div>

        <div class="divide-y divide-slate-700/50">
          <div
            v-for="r in stats?.recentReviews"
            :key="r.id"
            class="py-3 space-y-1"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-200">
                {{ r.user?.name }} on <span class="text-teal-400">{{ r.destination?.name }}</span>
              </span>
              <span class="text-xs font-black text-amber-400">★ {{ r.rating }}</span>
            </div>
            <p class="text-[11px] text-slate-400 truncate">
              "{{ r.comment }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useDestinationStore } from '@/stores/destination';
import { getLocalUsers } from '@/stores/auth';

const destinationStore = useDestinationStore();
const stats = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/admin/stats');
    stats.value = res.data;
  } catch (err) {
    await destinationStore.fetchDestinations({ limit: 50 });
    const users = getLocalUsers();
    stats.value = {
      counts: {
        users: users.length,
        destinations: destinationStore.destinations.length,
        reviews: 0,
        bucketLists: 0,
      },
      recentDestinations: destinationStore.destinations.slice(0, 5),
      recentReviews: [],
    };
  } finally {
    loading.value = false;
  }
});
</script>
