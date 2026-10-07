<template>
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
        <span>🏝️</span> Filters
      </h3>
      <button
        @click="resetFilters"
        class="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors"
      >
        Reset All
      </button>
    </div>

    <!-- Visayas Regions Filter -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        Region
      </label>
      <div class="space-y-1">
        <button
          v-for="r in regions"
          :key="r"
          @click="selectRegion(r)"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between"
          :class="
            selectedRegion === r
              ? 'bg-teal-50 text-teal-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          "
        >
          <span>{{ r || 'All Visayas' }}</span>
          <span v-if="selectedRegion === r" class="text-teal-600 text-xs">✓</span>
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        Category
      </label>
      <div class="space-y-1">
        <button
          @click="selectCategory('')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between"
          :class="
            !selectedCategory
              ? 'bg-teal-50 text-teal-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          "
        >
          <span>All Categories</span>
          <span v-if="!selectedCategory" class="text-teal-600 text-xs">✓</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.name)"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between"
          :class="
            selectedCategory === cat.name
              ? 'bg-teal-50 text-teal-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          "
        >
          <span>{{ cat.name }}</span>
          <span v-if="selectedCategory === cat.name" class="text-teal-600 text-xs">✓</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedRegion: {
    type: String,
    default: '',
  },
  selectedCategory: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:region', 'update:category', 'reset']);

const regions = ['', 'Central Visayas', 'Western Visayas', 'Eastern Visayas'];

const selectRegion = (reg) => {
  emit('update:region', reg);
};

const selectCategory = (cat) => {
  emit('update:category', cat);
};

const resetFilters = () => {
  emit('reset');
};
</script>
