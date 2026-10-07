<template>
  <div class="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-teal-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
    <!-- Image & Top Badges -->
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        :src="destination.image_url || fallbackImage"
        :alt="destination.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        @error="handleImageError"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

      <!-- Category Badge -->
      <span
        v-if="destination.category"
        class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-teal-800 text-xs font-bold rounded-full shadow-sm"
      >
        {{ destination.category.name }}
      </span>

      <!-- Favorite Button -->
      <button
        @click.stop.prevent="handleFavoriteToggle"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white hover:scale-110 shadow-sm"
        :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
      >
        <svg
          class="w-5 h-5 transition-colors"
          :class="isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-rose-500'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <!-- Province & Region Pill -->
      <div class="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-medium">
        <svg class="w-3.5 h-3.5 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ destination.province }}, {{ destination.region }}</span>
      </div>
    </div>

    <!-- Details Section -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <RatingStars :rating="destination.average_rating || 0" />
          <span class="text-xs text-slate-400">
            ({{ destination.reviews_count || 0 }} reviews)
          </span>
        </div>

        <RouterLink :to="`/destinations/${destination.slug || destination.id}`">
          <h4 class="font-extrabold text-slate-800 text-lg hover:text-teal-600 transition-colors line-clamp-1">
            {{ destination.name }}
          </h4>
        </RouterLink>

        <p class="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
          {{ destination.description }}
        </p>
      </div>

      <!-- Action Footer -->
      <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span class="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Est. Budget</span>
          <span class="text-sm font-bold text-slate-800">
            {{ destination.estimated_budget ? `₱${Number(destination.estimated_budget).toLocaleString()}` : 'Free / Low' }}
          </span>
        </div>

        <button
          v-if="!isInBucketList"
          @click="handleBucketListAdd"
          class="px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-teal-500/20 active:scale-95 flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Bucket List</span>
        </button>

        <span
          v-else
          class="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-1"
        >
          <span>✓</span>
          <span>Saved</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBucketListStore } from '@/stores/bucketList';
import { useToastStore } from '@/stores/toast';
import RatingStars from './RatingStars.vue';

const props = defineProps({
  destination: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const authStore = useAuthStore();
const bucketListStore = useBucketListStore();
const toast = useToastStore();

const fallbackImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};

const isFav = computed(() => {
  return (
    props.destination.is_favorite ||
    bucketListStore.favoriteDestinationIds.includes(props.destination.id)
  );
});

const isInBucketList = computed(() => {
  return (
    props.destination.is_in_bucketlist ||
    bucketListStore.bucketListDestinationIds.includes(props.destination.id)
  );
});

const handleFavoriteToggle = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  try {
    await bucketListStore.toggleFavorite(props.destination.id);
    toast.success(isFav.value ? 'Removed from favorites.' : 'Saved to favorites! ❤️');
  } catch (err) {
    toast.error(err.message);
  }
};

const handleBucketListAdd = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  try {
    await bucketListStore.addToBucketList(props.destination.id);
    toast.success(`"${props.destination.name}" added to your bucket list!`);
  } catch (err) {
    toast.error(err.message);
  }
};
</script>
