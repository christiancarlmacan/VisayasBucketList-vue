<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">
          My Visayas Bucket List
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Keep track of your Philippine island travels and mark destinations as visited.
        </p>
      </div>

      <RouterLink
        to="/explore"
        class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all self-start sm:self-auto"
      >
        + Add More Places
      </RouterLink>
    </div>

    <!-- Progress Indicator Bar -->
    <ProgressBar
      :percentage="bucketListStore.stats.completionPercentage"
      :visited="bucketListStore.stats.visitedCount"
      :total="bucketListStore.stats.total"
    />

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-3">
      <button
        @click="activeTab = 'ALL'"
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all"
        :class="
          activeTab === 'ALL'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        "
      >
        All Saved ({{ bucketListStore.stats.total }})
      </button>

      <button
        @click="activeTab = 'WANT_TO_VISIT'"
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all"
        :class="
          activeTab === 'WANT_TO_VISIT'
            ? 'bg-amber-500 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        "
      >
        Want to Visit ({{ bucketListStore.stats.wantToVisitCount }})
      </button>

      <button
        @click="activeTab = 'VISITED'"
        class="px-4 py-2 text-xs font-bold rounded-xl transition-all"
        :class="
          activeTab === 'VISITED'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100'
        "
      >
        Visited ({{ bucketListStore.stats.visitedCount }})
      </button>
    </div>

    <!-- Items List -->
    <div v-if="filteredItems.length > 0" class="space-y-4">
      <BucketListCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-12"
    >
      <div class="text-4xl mb-3">🎒</div>
      <h3 class="text-base font-bold text-slate-800">
        {{ activeTab === 'VISITED' ? 'No visited places yet' : 'Your bucket list is empty' }}
      </h3>
      <p class="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
        Start exploring destinations in Cebu, Bohol, Boracay, and beyond to add them here!
      </p>
      <RouterLink
        to="/explore"
        class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl inline-block transition-all shadow-sm"
      >
        Browse Visayas Destinations
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBucketListStore } from '@/stores/bucketList';
import ProgressBar from '@/components/ProgressBar.vue';
import BucketListCard from '@/components/BucketListCard.vue';

const bucketListStore = useBucketListStore();
const activeTab = ref('ALL');

const filteredItems = computed(() => {
  if (activeTab.value === 'WANT_TO_VISIT') {
    return bucketListStore.wantToVisitItems;
  }
  if (activeTab.value === 'VISITED') {
    return bucketListStore.visitedItems;
  }
  return bucketListStore.items;
});

onMounted(async () => {
  await bucketListStore.fetchBucketList();
});
</script>
