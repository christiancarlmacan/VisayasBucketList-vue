<template>
  <div class="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-3 transition-all hover:border-slate-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Avatar / Initials -->
        <div class="w-9 h-9 rounded-full overflow-hidden bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs shadow-inner">
          <img
            v-if="review.user?.profile_image"
            :src="review.user.profile_image"
            :alt="review.user.name"
            class="w-full h-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>

        <div>
          <h4 class="text-xs font-black text-slate-900 leading-none">
            {{ review.user?.name || 'Traveler' }}
          </h4>
          <span class="text-[10px] text-slate-400">
            {{ formattedDate }}
          </span>
        </div>
      </div>

      <!-- Rating Stars & Actions -->
      <div class="flex items-center gap-3">
        <RatingStars :rating="review.rating" :showNumber="false" />

        <div v-if="canDelete || canEdit" class="flex items-center gap-1">
          <button
            v-if="canEdit"
            @click="$emit('edit', review)"
            class="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
            title="Edit review"
          >
            ✏️
          </button>
          <button
            v-if="canDelete"
            @click="$emit('delete', review.id)"
            class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Delete review"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
      {{ review.comment }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import RatingStars from '@/components/RatingStars.vue';

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
  canDelete: {
    type: Boolean,
    default: false,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['delete', 'edit']);

const initials = computed(() => {
  const name = props.review.user?.name || 'Traveler';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const formattedDate = computed(() => {
  if (!props.review.created_at) return '';
  const date = new Date(props.review.created_at);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});
</script>
