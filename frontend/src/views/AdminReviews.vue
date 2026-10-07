<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">
          Review Moderation
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Monitor, filter, and moderate traveler ratings and comments.
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
      <div class="w-full sm:w-80">
        <input
          v-model="searchQuery"
          @input="loadReviews"
          type="text"
          placeholder="Filter by comment, traveler, or destination..."
          class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>
      <span class="text-xs text-slate-400">
        Total Reviews: {{ total }}
      </span>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
            <tr>
              <th class="p-4">Destination</th>
              <th class="p-4">Traveler</th>
              <th class="p-4">Rating</th>
              <th class="p-4">Comment</th>
              <th class="p-4">Date</th>
              <th class="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-slate-400">Loading reviews...</td>
            </tr>
            <tr v-else-if="reviews.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-400">No traveler reviews found.</td>
            </tr>
            <tr
              v-for="r in reviews"
              :key="r.id"
              class="hover:bg-slate-750/30 transition-colors"
            >
              <td class="p-4 font-bold text-white whitespace-nowrap">
                {{ r.destination?.name || '—' }}
              </td>
              <td class="p-4 whitespace-nowrap">
                <span class="font-bold text-slate-200 block">{{ r.user?.name || 'Anonymous' }}</span>
                <span class="text-[10px] text-slate-400">{{ r.user?.email }}</span>
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-bold text-[11px]">
                  ★ {{ r.rating }}
                </span>
              </td>
              <td class="p-4 max-w-xs text-slate-300 leading-relaxed">
                {{ r.comment }}
              </td>
              <td class="p-4 text-slate-400 whitespace-nowrap text-[10px]">
                {{ new Date(r.created_at).toLocaleDateString() }}
              </td>
              <td class="p-4 text-right">
                <button
                  @click="handleDelete(r)"
                  class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg font-bold text-[11px] transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const reviews = ref([]);
const total = ref(0);
const loading = ref(false);
const searchQuery = ref('');

const loadReviews = async () => {
  loading.value = true;
  try {
    const params = { limit: 50 };
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await api.get('/reviews', { params });
    reviews.value = res.data.reviews;
    total.value = res.data.pagination?.total || reviews.value.length;
  } catch (err) {
    toast.error('Failed to load reviews.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadReviews);

const handleDelete = async (r) => {
  if (confirm(`Delete review from "${r.user?.name}"?`)) {
    try {
      await api.delete(`/reviews/${r.id}`);
      toast.success('Review removed successfully.');
      loadReviews();
    } catch (err) {
      toast.error(err.message);
    }
  }
};
</script>
