<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div>
      <h1 class="text-3xl font-black text-slate-900 tracking-tight">
        My Favorite Destinations ❤️
      </h1>
      <p class="text-sm text-slate-500 mt-1">
        Destinations you loved and saved for quick access.
      </p>
    </div>

    <!-- Favorites List -->
    <div
      v-if="bucketListStore.favorites && bucketListStore.favorites.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <DestinationCard
        v-for="fav in bucketListStore.favorites"
        :key="fav.id"
        :destination="fav.destination"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-12"
    >
      <div class="text-4xl mb-3">💖</div>
      <h3 class="text-base font-bold text-slate-800">No favorite spots yet</h3>
      <p class="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
        Click the heart icon on any destination card to save your favorites here.
      </p>
      <RouterLink
        to="/explore"
        class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl inline-block transition-all shadow-sm"
      >
        Discover Places
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBucketListStore } from '@/stores/bucketList';
import DestinationCard from '@/components/DestinationCard.vue';

const bucketListStore = useBucketListStore();

onMounted(async () => {
  await bucketListStore.fetchFavorites();
  await bucketListStore.fetchBucketList();
});
</script>
