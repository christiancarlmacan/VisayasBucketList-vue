<template>
  <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <div>
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500">
          Bucket List Progress
        </h3>
        <p class="text-2xl font-black text-slate-900 mt-1">
          {{ percentage }}% <span class="text-sm font-medium text-slate-500">Explored</span>
        </p>
      </div>
      <div class="flex items-center space-x-4 text-right">
        <div>
          <span class="text-xl font-bold text-teal-600">{{ visited }}</span>
          <p class="text-xs text-slate-400 font-medium">Visited</p>
        </div>
        <div class="h-8 w-px bg-slate-200"></div>
        <div>
          <span class="text-xl font-bold text-slate-700">{{ total }}</span>
          <p class="text-xs text-slate-400 font-medium">Total Saved</p>
        </div>
      </div>
    </div>

    <!-- Progress Track -->
    <div class="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
      <div
        class="bg-gradient-to-r from-teal-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percentage: {
    type: Number,
    default: 0,
  },
  visited: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
});
</script>
