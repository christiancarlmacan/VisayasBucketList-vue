<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl space-y-3">
        <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-amber-300">
          Gamified Travel Passport
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight">
          Your Visayas Achievements
        </h1>
        <p class="text-teal-100 text-sm leading-relaxed">
          Track your journey across the Philippine archipelago. Unlock unique traveler badges as you explore tropical beaches, conquer mountain peaks, and complete your bucket list!
        </p>
      </div>

      <!-- Quick Stats Circle / Trophy on Desktop -->
      <div class="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-6 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div class="text-5xl">🏆</div>
        <div>
          <div class="text-3xl font-black text-amber-300">
            {{ stats.earnedCount }} / {{ stats.totalAchievements }}
          </div>
          <span class="text-xs font-bold text-teal-100">Badges Unlocked</span>
          <div class="text-[11px] text-teal-200 mt-0.5">
            {{ stats.completionRate }}% completed
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Metrics Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Destinations Visited</span>
        <span class="text-2xl font-black text-slate-900 mt-1 block">
          {{ stats.totalVisited || 0 }} 📍
        </span>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Beaches Explored</span>
        <span class="text-2xl font-black text-slate-900 mt-1 block">
          {{ stats.beachCount || 0 }} 🏖️
        </span>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Peaks Conquered</span>
        <span class="text-2xl font-black text-slate-900 mt-1 block">
          {{ stats.mountainCount || 0 }} ⛰️
        </span>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Bucket List Saved</span>
        <span class="text-2xl font-black text-slate-900 mt-1 block">
          {{ stats.totalBucketList || 0 }} 📋
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      <div v-for="n in 4" :key="n" class="h-64 bg-slate-200 rounded-3xl"></div>
    </div>

    <!-- Achievements Grid -->
    <div v-else-if="achievements.length > 0" class="space-y-6">
      <h2 class="text-xl font-black text-slate-900">All Travel Milestones</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AchievementCard
          v-for="ach in achievements"
          :key="ach.id"
          :achievement="ach"
        />
      </div>
    </div>

    <div v-else class="text-center py-16 bg-white rounded-3xl border border-slate-100">
      <p class="text-slate-400 text-sm">No achievements configured yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import AchievementCard from '@/components/AchievementCard.vue';

const achievements = ref([]);
const stats = ref({
  totalAchievements: 0,
  earnedCount: 0,
  completionRate: 0,
  totalVisited: 0,
  beachCount: 0,
  mountainCount: 0,
  totalBucketList: 0,
});
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get('/achievements/my');
    achievements.value = res.data.achievements || [];
    stats.value = res.data.stats || stats.value;
  } catch (err) {
    console.error('Failed to load achievements:', err);
  } finally {
    loading.value = false;
  }
});
</script>
