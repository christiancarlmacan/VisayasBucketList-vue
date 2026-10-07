<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">
          Visited Destinations 🎉
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Relive your travel memories across the Visayas and keep celebrating your journey!
        </p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/bucket-list"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          View Full Bucket List
        </RouterLink>
        <RouterLink
          to="/achievements"
          class="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-all"
        >
          Check Badges 🏆
        </RouterLink>
      </div>
    </div>

    <!-- Progress Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="space-y-1 text-center sm:text-left">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Visited Passport</span>
        <div class="text-3xl font-black text-slate-900">
          {{ visitedList.length }} <span class="text-base text-slate-400 font-normal">destinations conquered</span>
        </div>
      </div>

      <div class="w-full sm:w-1/2">
        <ProgressBar
          :total="bucketListStore.stats.total"
          :completed="visitedList.length"
          :percentage="bucketListStore.stats.completionPercentage"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="bucketListStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div v-for="n in 3" :key="n" class="h-80 bg-slate-200 rounded-3xl"></div>
    </div>

    <!-- Visited Cards Grid -->
    <div v-else-if="visitedList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BucketListCard
        v-for="item in visitedList"
        :key="item.id"
        :item="item"
        @update-status="handleStatusUpdate"
        @remove="handleRemoveItem"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4">
      <div class="text-5xl">🏝️</div>
      <h3 class="text-lg font-black text-slate-800">No visited destinations yet</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
        Mark destinations in your bucket list as "Visited" once you travel there to unlock special Visayas badges!
      </p>
      <RouterLink
        to="/explore"
        class="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
      >
        Discover Places Now
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useBucketListStore } from '@/stores/bucketList';
import { useToastStore } from '@/stores/toast';
import BucketListCard from '@/components/BucketListCard.vue';
import ProgressBar from '@/components/ProgressBar.vue';

const bucketListStore = useBucketListStore();
const toast = useToastStore();

const visitedList = computed(() => bucketListStore.visitedItems);

onMounted(() => {
  bucketListStore.fetchBucketList();
});

const handleStatusUpdate = async ({ id, status }) => {
  try {
    await bucketListStore.updateStatus(id, status);
    toast.success('Status updated successfully!');
  } catch (err) {
    toast.error(err.message);
  }
};

const handleRemoveItem = async (id) => {
  if (confirm('Remove this destination from your bucket list?')) {
    try {
      await bucketListStore.removeFromBucketList(id);
      toast.info('Item removed from list.');
    } catch (err) {
      toast.error(err.message);
    }
  }
};
</script>
