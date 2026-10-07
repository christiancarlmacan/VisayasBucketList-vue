<template>
  <div
    class="relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between"
    :class="
      achievement.isUnlocked
        ? 'bg-gradient-to-br from-white to-amber-50/40 border-amber-200 shadow-md shadow-amber-500/5'
        : 'bg-white border-slate-100 shadow-xs opacity-75'
    "
  >
    <div>
      <div class="flex items-start justify-between mb-4">
        <!-- Badge Icon Bubble -->
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform hover:scale-105"
          :class="
            achievement.isUnlocked
              ? 'bg-amber-400 text-amber-950 shadow-amber-400/30'
              : 'bg-slate-100 text-slate-400'
          "
        >
          <span>{{ badgeEmoji }}</span>
        </div>

        <!-- Status Tag -->
        <span
          v-if="achievement.isUnlocked"
          class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1"
        >
          <span>✓</span> Unlocked
        </span>
        <span
          v-else
          class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full"
        >
          Locked
        </span>
      </div>

      <!-- Badge Title & Description -->
      <h3 class="text-base font-black text-slate-900 mb-1">
        {{ achievement.name }}
      </h3>
      <p class="text-xs text-slate-500 leading-relaxed mb-4">
        {{ achievement.description }}
      </p>
    </div>

    <!-- Progress Tracker -->
    <div class="space-y-2 pt-2 border-t border-slate-100">
      <div class="flex justify-between items-center text-xs">
        <span class="font-bold text-slate-500">Progress</span>
        <span class="font-black" :class="achievement.isUnlocked ? 'text-emerald-700' : 'text-slate-700'">
          {{ achievement.current }} / {{ achievement.requirement }}
        </span>
      </div>

      <!-- Bar -->
      <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="achievement.isUnlocked ? 'bg-gradient-to-r from-amber-400 to-emerald-500' : 'bg-teal-600'"
          :style="{ width: `${achievement.progressPercent}%` }"
        ></div>
      </div>

      <div v-if="achievement.isUnlocked && achievement.earned_at" class="text-[10px] text-slate-400 text-right">
        Earned on {{ formattedEarnedDate }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  achievement: {
    type: Object,
    required: true,
  },
});

const badgeEmoji = computed(() => {
  const icon = props.achievement.icon || '';
  const name = props.achievement.name || '';
  if (icon === 'compass' || name.includes('Explorer')) return '🧭';
  if (icon === 'sun' || name.includes('Beach')) return '🏖️';
  if (icon === 'mountain' || name.includes('Peak')) return '⛰️';
  if (icon === 'award' || name.includes('Master')) return '🏆';
  return '🎖️';
});

const formattedEarnedDate = computed(() => {
  if (!props.achievement.earned_at) return '';
  return new Date(props.achievement.earned_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});
</script>
