<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Back Button -->
    <RouterLink
      to="/explore"
      class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
    >
      <span>←</span> Back to Destinations
    </RouterLink>

    <!-- Loading State -->
    <div v-if="destinationStore.detailsLoading" class="animate-pulse space-y-6">
      <div class="aspect-[21/9] bg-slate-200 rounded-3xl"></div>
      <div class="h-8 bg-slate-200 rounded w-1/3"></div>
      <div class="h-4 bg-slate-200 rounded w-2/3"></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="destinationStore.error"
      class="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl text-center"
    >
      <p class="font-bold">{{ destinationStore.error }}</p>
      <RouterLink to="/explore" class="mt-4 inline-block text-xs font-bold underline">
        Return to Explore
      </RouterLink>
    </div>

    <!-- Main Destination View -->
    <div v-else-if="destination" class="space-y-8">
      <!-- Hero Image Card -->
      <div class="relative aspect-[21/10] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
        <img
          :src="destination.image_url || fallbackImage"
          :alt="destination.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <!-- Floating Badges Top -->
        <div class="absolute top-4 left-4 flex gap-2">
          <span
            v-if="destination.category"
            class="px-3.5 py-1 bg-white/95 backdrop-blur-md text-teal-800 text-xs font-bold rounded-full shadow-sm"
          >
            {{ destination.category.name }}
          </span>
        </div>

        <div class="absolute top-4 right-4">
          <button
            @click="handleFavoriteToggle"
            class="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            title="Toggle Favorite"
          >
            <svg
              class="w-6 h-6"
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
        </div>

        <!-- Banner Info Bottom -->
        <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
          <div class="flex items-center gap-2 text-xs font-semibold text-teal-300">
            <span>📍 {{ destination.location }}</span>
            <span>•</span>
            <span>{{ destination.province }}, {{ destination.region }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {{ destination.name }}
          </h1>
        </div>
      </div>

      <!-- Action & Quick Highlights Bar -->
      <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <!-- Highlights -->
        <div class="grid grid-cols-3 gap-6 w-full sm:w-auto text-center sm:text-left">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Rating</span>
            <div class="flex items-center justify-center sm:justify-start gap-1 mt-1">
              <RatingStars :rating="destination.average_rating || 0" />
            </div>
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Est. Budget</span>
            <span class="text-sm font-black text-slate-800 mt-1 block">
              {{ destination.estimated_budget ? `₱${Number(destination.estimated_budget).toLocaleString()}` : 'Free' }}
            </span>
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Rec. Duration</span>
            <span class="text-sm font-black text-slate-800 mt-1 block">
              {{ destination.recommended_days ? `${destination.recommended_days} day(s)` : 'Half-day' }}
            </span>
          </div>
        </div>

        <!-- Bucket List Button Options -->
        <div class="w-full sm:w-auto flex items-center justify-end gap-3">
          <button
            v-if="!isInBucketList"
            @click="handleAddToBucketList"
            class="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>+</span> Add to My Bucket List
          </button>

          <div v-else class="flex items-center gap-2">
            <button
              @click="toggleVisited"
              class="px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
              :class="
                isVisited
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              "
            >
              <span>{{ isVisited ? 'Visited 🎉' : 'Want to Visit' }}</span>
              <span class="text-[10px] underline">(Switch)</span>
            </button>

            <button
              @click="handleRemoveFromBucketList"
              class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Remove from bucket list"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Overview & Description -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 class="text-xl font-black text-slate-900">About this Destination</h3>
            <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
              {{ destination.description }}
            </p>
          </div>

          <!-- Reviews Section -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 class="text-xl font-black text-slate-900">
                Traveler Reviews ({{ destination.reviews?.length || 0 }})
              </h3>
              <RatingStars :rating="destination.average_rating || 0" />
            </div>

            <!-- Review Submission Form -->
            <div class="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
              <template v-if="authStore.isAuthenticated">
                <h4 class="text-sm font-black text-slate-900">
                  {{ userReview ? 'Update Your Review' : 'Leave a Traveler Review' }}
                </h4>

                <!-- Star Rating Picker -->
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-500">Your Rating:</span>
                  <div class="flex items-center gap-1">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="reviewRating = star"
                      class="text-xl focus:outline-none transition-transform hover:scale-125"
                      :class="star <= reviewRating ? 'text-amber-400' : 'text-slate-300'"
                    >
                      ★
                    </button>
                  </div>
                  <span class="text-xs font-black text-slate-700 ml-1">
                    {{ reviewRating }} / 5
                  </span>
                </div>

                <!-- Comment Input -->
                <div class="space-y-1">
                  <textarea
                    v-model="reviewComment"
                    rows="3"
                    placeholder="Share tips, highlights, or memorable experiences from this place..."
                    class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                    maxlength="1000"
                  ></textarea>
                  <div class="flex justify-between text-[10px] text-slate-400">
                    <span>Minimum 3 characters</span>
                    <span>{{ reviewComment.length }} / 1000</span>
                  </div>
                </div>

                <!-- Submit / Cancel -->
                <div class="flex items-center gap-3 justify-end">
                  <button
                    v-if="userReview"
                    @click="handleDeleteReview(userReview.id)"
                    type="button"
                    class="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    Delete Review
                  </button>
                  <button
                    @click="handleSubmitReview"
                    :disabled="submittingReview || reviewComment.trim().length < 3"
                    class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm"
                  >
                    {{ submittingReview ? 'Saving...' : userReview ? 'Update Review' : 'Post Review' }}
                  </button>
                </div>
              </template>

              <!-- Not Authenticated Callout -->
              <div v-else class="text-center py-4 space-y-2">
                <p class="text-xs text-slate-600 font-medium">
                  Have you explored {{ destination.name }}? Sign in to share your experience and rating.
                </p>
                <RouterLink
                  :to="{ name: 'Login', query: { redirect: route.fullPath } }"
                  class="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Sign In to Review
                </RouterLink>
              </div>
            </div>

            <!-- Existing Reviews List -->
            <div v-if="destination.reviews && destination.reviews.length > 0" class="space-y-3">
              <ReviewCard
                v-for="rev in destination.reviews"
                :key="rev.id"
                :review="rev"
                :canDelete="canDeleteReview(rev)"
                :canEdit="rev.user_id === authStore.user?.id"
                @delete="handleDeleteReview"
                @edit="handleEditReviewClick"
              />
            </div>

            <div v-else class="text-center py-6 text-slate-400 text-xs">
              No traveler reviews yet for this destination. Be the first to review!
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Destination Details
            </h4>
            <ul class="space-y-3 text-xs">
              <li class="flex justify-between py-1 border-b border-slate-50">
                <span class="text-slate-500 font-medium">Province</span>
                <span class="font-bold text-slate-800">{{ destination.province }}</span>
              </li>
              <li class="flex justify-between py-1 border-b border-slate-50">
                <span class="text-slate-500 font-medium">Region</span>
                <span class="font-bold text-slate-800">{{ destination.region }}</span>
              </li>
              <li class="flex justify-between py-1 border-b border-slate-50">
                <span class="text-slate-500 font-medium">Category</span>
                <span class="font-bold text-teal-700">{{ destination.category?.name }}</span>
              </li>
              <li class="flex justify-between py-1 border-b border-slate-50">
                <span class="text-slate-500 font-medium">Bucket List Saves</span>
                <span class="font-bold text-slate-800">{{ destination.saves_count || 0 }}</span>
              </li>
              <li class="flex justify-between py-1">
                <span class="text-slate-500 font-medium">Favorites</span>
                <span class="font-bold text-slate-800">{{ destination.favorites_count || 0 }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDestinationStore } from '@/stores/destination';
import { useAuthStore } from '@/stores/auth';
import { useBucketListStore } from '@/stores/bucketList';
import { useToastStore } from '@/stores/toast';
import api from '@/services/api';
import RatingStars from '@/components/RatingStars.vue';
import ReviewCard from '@/components/ReviewCard.vue';

const route = useRoute();
const router = useRouter();
const destinationStore = useDestinationStore();
const authStore = useAuthStore();
const bucketListStore = useBucketListStore();
const toast = useToastStore();

const fallbackImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

const destination = computed(() => destinationStore.currentDestination);

// Review form state
const reviewRating = ref(5);
const reviewComment = ref('');
const submittingReview = ref(false);

const userReview = computed(() => {
  if (!destination.value?.reviews || !authStore.user) return null;
  return destination.value.reviews.find((r) => r.user_id === authStore.user.id);
});

const isFav = computed(() => {
  if (!destination.value) return false;
  return bucketListStore.favoriteDestinationIds.includes(destination.value.id);
});

const isInBucketList = computed(() => {
  if (!destination.value) return false;
  return bucketListStore.bucketListDestinationIds.includes(destination.value.id);
});

const isVisited = computed(() => {
  if (!destination.value) return false;
  const item = bucketListStore.items.find((i) => i.destination_id === destination.value.id);
  return item?.status === 'VISITED';
});

const canDeleteReview = (rev) => {
  if (!authStore.isAuthenticated) return false;
  return rev.user_id === authStore.user?.id || authStore.isAdmin;
};

onMounted(async () => {
  const idOrSlug = route.params.id;
  await destinationStore.fetchDestinationDetails(idOrSlug);
  if (authStore.isAuthenticated) {
    bucketListStore.fetchBucketList();
    bucketListStore.fetchFavorites();
  }
  syncUserReview();
});

const syncUserReview = () => {
  if (userReview.value) {
    reviewRating.value = userReview.value.rating;
    reviewComment.value = userReview.value.comment;
  }
};

const handleImageError = (e) => {
  e.target.src = fallbackImage;
};

const handleFavoriteToggle = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  try {
    await bucketListStore.toggleFavorite(destination.value.id);
    toast.success(isFav.value ? 'Added to favorites!' : 'Removed from favorites.');
  } catch (err) {
    toast.error(err.message);
  }
};

const handleAddToBucketList = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } });
    return;
  }
  try {
    await bucketListStore.addToBucketList(destination.value.id);
    toast.success(`"${destination.value.name}" added to your bucket list!`);
  } catch (err) {
    toast.error(err.message);
  }
};

const toggleVisited = async () => {
  try {
    const newStatus = isVisited.value ? 'WANT_TO_VISIT' : 'VISITED';
    await bucketListStore.updateStatus(destination.value.id, newStatus);
    toast.success(
      newStatus === 'VISITED'
        ? `Marked "${destination.value.name}" as Visited! 🎉`
        : `Marked "${destination.value.name}" as Want to Visit.`
    );
  } catch (err) {
    toast.error(err.message);
  }
};

const handleRemoveFromBucketList = async () => {
  if (confirm(`Remove "${destination.value.name}" from your bucket list?`)) {
    try {
      await bucketListStore.removeFromBucketList(destination.value.id);
      toast.info('Removed from bucket list.');
    } catch (err) {
      toast.error(err.message);
    }
  }
};

const handleSubmitReview = async () => {
  if (!authStore.isAuthenticated) return;
  submittingReview.value = true;
  try {
    await api.post(`/destinations/${destination.value.id}/reviews`, {
      rating: reviewRating.value,
      comment: reviewComment.value,
    });
    toast.success('Your review has been published!');
    await destinationStore.fetchDestinationDetails(route.params.id);
  } catch (err) {
    toast.error(err.message);
  } finally {
    submittingReview.value = false;
  }
};

const handleEditReviewClick = (rev) => {
  reviewRating.value = rev.rating;
  reviewComment.value = rev.comment;
  window.scrollTo({ top: 400, behavior: 'smooth' });
};

const handleDeleteReview = async (reviewId) => {
  if (confirm('Are you sure you want to delete this review?')) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review removed.');
      reviewComment.value = '';
      reviewRating.value = 5;
      await destinationStore.fetchDestinationDetails(route.params.id);
    } catch (err) {
      toast.error(err.message);
    }
  }
};
</script>
