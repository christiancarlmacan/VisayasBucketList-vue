<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-4"
      >
        <div class="aspect-[16/10] bg-slate-200 rounded-xl"></div>
        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
        <div class="h-3 bg-slate-100 rounded w-full"></div>
        <div class="h-3 bg-slate-100 rounded w-4/5"></div>
        <div class="pt-4 border-t border-slate-100 flex justify-between">
          <div class="h-4 bg-slate-200 rounded w-16"></div>
          <div class="h-8 bg-slate-200 rounded-xl w-24"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!destinations || destinations.length === 0"
      class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-8"
    >
      <div class="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        🏝️
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-1">No destinations found</h3>
      <p class="text-sm text-slate-500 mb-6">
        We couldn't find any destinations matching your current filter criteria.
      </p>
      <button
        @click="$emit('reset')"
        class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all"
      >
        Reset Filters
      </button>
    </div>

    <!-- Grid List -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DestinationCard
        v-for="dest in destinations"
        :key="dest.id"
        :destination="dest"
      />
    </div>
  </div>
</template>

<script setup>
import DestinationCard from './DestinationCard.vue';

defineProps({
  destinations: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['reset']);
</script>
