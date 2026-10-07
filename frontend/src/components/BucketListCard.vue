<template>
  <div class="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <!-- Destination Info -->
    <div class="flex items-center gap-4 w-full sm:w-auto">
      <img
        :src="item.destination?.image_url || fallbackImage"
        :alt="item.destination?.name"
        class="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100"
        @error="handleImageError"
      />
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            class="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            :class="
              item.status === 'VISITED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            "
          >
            {{ item.status === 'VISITED' ? 'Visited 🎉' : 'Want to Visit' }}
          </span>
          <span
            v-if="item.destination?.category"
            class="text-[11px] text-slate-400 font-medium"
          >
            • {{ item.destination?.category?.name }}
          </span>
        </div>

        <RouterLink
          :to="`/destinations/${item.destination?.slug || item.destination?.id}`"
          class="font-extrabold text-slate-900 text-base sm:text-lg hover:text-teal-600 transition-colors"
        >
          {{ item.destination?.name }}
        </RouterLink>

        <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
          <span>📍</span>
          <span>{{ item.destination?.location }} ({{ item.destination?.province }})</span>
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
      <!-- Toggle Visited Status -->
      <button
        @click="toggleStatus"
        class="px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        :class="
          item.status === 'VISITED'
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            : 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm shadow-teal-500/20'
        "
      >
        <span v-if="item.status === 'VISITED'">Mark as Want to Visit</span>
        <span v-else>Mark as Visited ✓</span>
      </button>

      <!-- Delete Button -->
      <button
        @click="removeItem"
        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        title="Remove from bucket list"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { useBucketListStore } from '@/stores/bucketList';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const bucketListStore = useBucketListStore();

const fallbackImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};

const toggleStatus = async () => {
  const newStatus = props.item.status === 'VISITED' ? 'WANT_TO_VISIT' : 'VISITED';
  try {
    await bucketListStore.updateStatus(props.item.id, newStatus);
  } catch (err) {
    alert(err.message);
  }
};

const removeItem = async () => {
  if (confirm(`Remove "${props.item.destination?.name}" from your bucket list?`)) {
    try {
      await bucketListStore.removeFromBucketList(props.item.id);
    } catch (err) {
      alert(err.message);
    }
  }
};
</script>
