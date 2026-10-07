<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">
          Explore Visayas Destinations
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Browse through breathtaking spots across Central, Western, and Eastern Visayas.
        </p>
      </div>

      <!-- Quick Search Bar -->
      <div class="w-full md:w-80">
        <SearchBar
          v-model="destinationStore.filters.search"
          @search="applySearch"
          placeholder="Search destination name, city..."
        />
      </div>
    </div>

    <!-- Layout: Filters on left, Destinations on right -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Sidebar Filters -->
      <div class="lg:col-span-1">
        <FilterPanel
          :categories="destinationStore.categories"
          :selectedRegion="destinationStore.filters.region"
          :selectedCategory="destinationStore.filters.category"
          @update:region="onRegionChange"
          @update:category="onCategoryChange"
          @reset="resetAllFilters"
        />
      </div>

      <!-- Main Destination Grid Area -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Results Summary & Active Filters -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white p-4 rounded-2xl border border-slate-100">
          <div>
            Showing
            <strong class="text-slate-800 font-bold">{{ destinationStore.destinations.length }}</strong>
            of
            <strong class="text-slate-800 font-bold">{{ destinationStore.pagination.total }}</strong>
            destinations
          </div>

          <!-- Active Filter Badges -->
          <div class="flex flex-wrap gap-2">
            <span
              v-if="destinationStore.filters.region"
              class="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg font-semibold flex items-center gap-1"
            >
              {{ destinationStore.filters.region }}
              <button @click="onRegionChange('')" class="hover:text-teal-900">×</button>
            </span>
            <span
              v-if="destinationStore.filters.category"
              class="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-semibold flex items-center gap-1"
            >
              {{ destinationStore.filters.category }}
              <button @click="onCategoryChange('')" class="hover:text-amber-900">×</button>
            </span>
            <span
              v-if="destinationStore.filters.search"
              class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
            >
              "{{ destinationStore.filters.search }}"
              <button @click="clearSearch" class="hover:text-slate-900">×</button>
            </span>
          </div>
        </div>

        <!-- Destination Cards Grid -->
        <DestinationGrid
          :destinations="destinationStore.destinations"
          :loading="destinationStore.loading"
          @reset="resetAllFilters"
        />

        <!-- Pagination Controls -->
        <div
          v-if="destinationStore.pagination.totalPages > 1"
          class="flex items-center justify-center gap-2 pt-6"
        >
          <button
            @click="changePage(destinationStore.pagination.page - 1)"
            :disabled="destinationStore.pagination.page <= 1"
            class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            Previous
          </button>

          <span class="text-xs font-bold text-slate-500 px-3">
            Page {{ destinationStore.pagination.page }} of {{ destinationStore.pagination.totalPages }}
          </span>

          <button
            @click="changePage(destinationStore.pagination.page + 1)"
            :disabled="destinationStore.pagination.page >= destinationStore.pagination.totalPages"
            class="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDestinationStore } from '@/stores/destination';
import { useBucketListStore } from '@/stores/bucketList';
import { useAuthStore } from '@/stores/auth';
import SearchBar from '@/components/SearchBar.vue';
import FilterPanel from '@/components/FilterPanel.vue';
import DestinationGrid from '@/components/DestinationGrid.vue';

const route = useRoute();
const router = useRouter();
const destinationStore = useDestinationStore();
const bucketListStore = useBucketListStore();
const authStore = useAuthStore();

onMounted(async () => {
  await destinationStore.fetchCategories();

  // Read query params from route if present
  if (route.query.search) destinationStore.filters.search = route.query.search;
  if (route.query.region) destinationStore.filters.region = route.query.region;
  if (route.query.category) destinationStore.filters.category = route.query.category;

  await destinationStore.fetchDestinations();

  if (authStore.isAuthenticated) {
    bucketListStore.fetchBucketList();
    bucketListStore.fetchFavorites();
  }
});

const applySearch = () => {
  destinationStore.filters.page = 1;
  syncQueryAndFetch();
};

const clearSearch = () => {
  destinationStore.filters.search = '';
  destinationStore.filters.page = 1;
  syncQueryAndFetch();
};

const onRegionChange = (reg) => {
  destinationStore.filters.region = reg;
  destinationStore.filters.page = 1;
  syncQueryAndFetch();
};

const onCategoryChange = (cat) => {
  destinationStore.filters.category = cat;
  destinationStore.filters.page = 1;
  syncQueryAndFetch();
};

const resetAllFilters = () => {
  destinationStore.resetFilters();
  router.push({ path: '/explore' });
};

const changePage = (newPage) => {
  destinationStore.filters.page = newPage;
  destinationStore.fetchDestinations();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const syncQueryAndFetch = () => {
  const query = {};
  if (destinationStore.filters.search) query.search = destinationStore.filters.search;
  if (destinationStore.filters.region) query.region = destinationStore.filters.region;
  if (destinationStore.filters.category) query.category = destinationStore.filters.category;

  router.push({ path: '/explore', query });
  destinationStore.fetchDestinations();
};
</script>
