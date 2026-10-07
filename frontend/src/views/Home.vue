<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white overflow-hidden py-20 lg:py-28">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
          <span>✨</span> The Ultimate Visayas Travel Companion
        </span>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
          Discover & Conquer Your
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-amber-300 to-amber-400">
            Visayas Bucket List
          </span>
        </h1>

        <p class="text-base sm:text-lg text-teal-100/80 max-w-2xl mx-auto leading-relaxed">
          From the crystal cascades of Kawasan to the powdery shores of Boracay and the sandbars of Kalanggaman, explore and track your travel journey across Central, Western, and Eastern Visayas.
        </p>

        <!-- Quick Search Bar -->
        <div class="max-w-2xl mx-auto pt-4">
          <form @submit.prevent="handleHeroSearch" class="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <input
              v-model="heroSearchQuery"
              type="text"
              placeholder="Search places like 'Cebu', 'Bohol', 'Boracay'..."
              class="flex-1 px-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm font-medium"
            />
            <button
              type="submit"
              class="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-teal-500/30 text-sm flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <span>→</span>
            </button>
          </form>
        </div>

        <!-- Quick Category Tags -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            v-for="cat in quickCategories"
            :key="cat"
            @click="navigateToCategory(cat)"
            class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 transition-all hover:scale-105"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <!-- 3 Regions Highlight -->
      <div>
        <div class="text-center max-w-xl mx-auto mb-10">
          <h2 class="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">
            Regional Diversity
          </h2>
          <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
            Explore the 3 Visayas Regions
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="reg in regionsInfo"
            :key="reg.name"
            @click="navigateToRegion(reg.name)"
            class="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-100 hover:border-teal-300 shadow-sm hover:shadow-lg transition-all"
          >
            <div class="text-3xl mb-3">{{ reg.icon }}</div>
            <h4 class="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              {{ reg.name }}
            </h4>
            <p class="text-xs text-teal-700 font-semibold mt-0.5">
              {{ reg.provinces }}
            </p>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">
              {{ reg.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- Featured Destinations Section -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">
              Top Picks
            </h2>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
              Popular Visayas Destinations
            </h3>
          </div>
          <RouterLink
            to="/explore"
            class="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>View all destinations</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </RouterLink>
        </div>

        <DestinationGrid
          :destinations="featuredDestinations"
          :loading="destinationStore.loading"
          @reset="destinationStore.fetchDestinations()"
        />
      </div>

      <!-- Bucket List Call To Action -->
      <div class="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div class="space-y-3 max-w-xl">
          <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
            Start Your Journey
          </span>
          <h3 class="text-2xl sm:text-3xl font-black">
            Ready to track your Visayas adventures?
          </h3>
          <p class="text-teal-100 text-sm leading-relaxed">
            Create an account to save destinations to your personal bucket list, mark spots as visited, and watch your completion progress grow!
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="px-6 py-3.5 bg-white text-teal-800 hover:bg-teal-50 font-extrabold text-sm rounded-xl text-center shadow-md transition-all"
          >
            Create Free Account
          </RouterLink>
          <RouterLink
            v-else
            to="/bucket-list"
            class="px-6 py-3.5 bg-white text-teal-800 hover:bg-teal-50 font-extrabold text-sm rounded-xl text-center shadow-md transition-all"
          >
            Go to My Bucket List →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDestinationStore } from '@/stores/destination';
import { useAuthStore } from '@/stores/auth';
import { useBucketListStore } from '@/stores/bucketList';
import DestinationGrid from '@/components/DestinationGrid.vue';

const router = useRouter();
const destinationStore = useDestinationStore();
const authStore = useAuthStore();
const bucketListStore = useBucketListStore();

const heroSearchQuery = ref('');

const quickCategories = ['Beach', 'Waterfall', 'Mountain', 'Island', 'Nature'];

const regionsInfo = [
  {
    name: 'Central Visayas',
    icon: '🌊',
    provinces: 'Cebu, Bohol, Siquijor, Negros Oriental',
    desc: 'Famous for whale sharks, majestic waterfalls, Chocolate Hills, and centuries-old Spanish churches.',
  },
  {
    name: 'Western Visayas',
    icon: '🏖️',
    provinces: 'Aklan, Iloilo, Guimaras, Capiz, Antique',
    desc: 'Home of the world-famous Boracay Island, Islas de Gigantes, sweet mangoes, and rich culinary heritage.',
  },
  {
    name: 'Eastern Visayas',
    icon: '🏝️',
    provinces: 'Leyte, Samar, Biliran, Southern Leyte',
    desc: 'Known for the dreamlike Kalanggaman sandbar, prehistoric cave formations, and iconic San Juanico Bridge.',
  },
];

const featuredDestinations = computed(() => {
  return destinationStore.destinations.slice(0, 6);
});

onMounted(async () => {
  await destinationStore.fetchDestinations({ limit: 6 });
  if (authStore.isAuthenticated) {
    bucketListStore.fetchBucketList();
    bucketListStore.fetchFavorites();
  }
});

const handleHeroSearch = () => {
  if (heroSearchQuery.value.trim()) {
    destinationStore.setFilter('search', heroSearchQuery.value.trim());
    router.push({ path: '/explore', query: { search: heroSearchQuery.value.trim() } });
  } else {
    router.push('/explore');
  }
};

const navigateToCategory = (cat) => {
  destinationStore.setFilter('category', cat);
  router.push({ path: '/explore', query: { category: cat } });
};

const navigateToRegion = (reg) => {
  destinationStore.setFilter('region', reg);
  router.push({ path: '/explore', query: { region: reg } });
};
</script>
