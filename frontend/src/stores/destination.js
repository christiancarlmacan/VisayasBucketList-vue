import { defineStore } from 'pinia';
import api from '@/services/api';

const FALLBACK_CATEGORIES = [
  { id: 'cat-beach', name: 'Beach', description: 'Pristine white sand beaches and tropical shorelines' },
  { id: 'cat-mountain', name: 'Mountain', description: 'Scenic peaks, trekking routes, and hill summits' },
  { id: 'cat-waterfall', name: 'Waterfall', description: 'Crystal-clear cascades and canyon adventures' },
  { id: 'cat-nature', name: 'Nature', description: 'Eco-parks, rivers, caves, and scenic reserves' },
  { id: 'cat-adventure', name: 'Adventure', description: 'Thrilling water activities, diving, and ziplines' },
  { id: 'cat-historical', name: 'Historical', description: 'Colonial landmarks, monuments, and century-old sites' },
  { id: 'cat-cultural', name: 'Cultural', description: 'Heritage structures, museums, and local traditions' },
  { id: 'cat-island', name: 'Island', description: 'Island-hopping spots and secluded islets' },
];

const FALLBACK_DESTINATIONS = [
  {
    id: 'dest-kawasan-falls',
    name: 'Kawasan Falls',
    slug: 'kawasan-falls',
    description:
      'A world-renowned multi-tiered waterfall famous for its turquoise blue natural pools and thrilling canyoneering excursions in Badian.',
    province: 'Cebu',
    region: 'Central Visayas',
    location: 'Badian, Cebu',
    latitude: 9.8042,
    longitude: 123.3746,
    estimated_budget: 2500,
    recommended_days: 1,
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-waterfall',
    category: { id: 'cat-waterfall', name: 'Waterfall' },
    average_rating: 4.9,
    reviews_count: 18,
    saves_count: 42,
    favorites_count: 35,
    reviews: [],
  },
  {
    id: 'dest-chocolate-hills',
    name: 'Chocolate Hills',
    slug: 'chocolate-hills',
    description:
      'Over 1,200 conical geological formations that turn cocoa-brown in the dry season, creating a breathtaking surreal landscape.',
    province: 'Bohol',
    region: 'Central Visayas',
    location: 'Carmen, Bohol',
    latitude: 9.9192,
    longitude: 124.1672,
    estimated_budget: 1500,
    recommended_days: 1,
    image_url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-nature',
    category: { id: 'cat-nature', name: 'Nature' },
    average_rating: 4.8,
    reviews_count: 24,
    saves_count: 58,
    favorites_count: 49,
    reviews: [],
  },
  {
    id: 'dest-white-beach-boracay',
    name: 'White Beach Boracay',
    slug: 'white-beach-boracay',
    description:
      'A 4-kilometer stretch of world-famous powdery white sand with vibrant sunset bars, water sports, and crystal blue ocean.',
    province: 'Aklan',
    region: 'Western Visayas',
    location: 'Boracay Island, Malay, Aklan',
    latitude: 11.9674,
    longitude: 121.9248,
    estimated_budget: 8000,
    recommended_days: 3,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-beach',
    category: { id: 'cat-beach', name: 'Beach' },
    average_rating: 4.9,
    reviews_count: 31,
    saves_count: 74,
    favorites_count: 66,
    reviews: [],
  },
  {
    id: 'dest-kalanggaman-island',
    name: 'Kalanggaman Island',
    slug: 'kalanggaman-island',
    description:
      'A pristine paradise sandbar island surrounded by turquoise waters, ideal for beach camping, swimming, and stargazing.',
    province: 'Leyte',
    region: 'Eastern Visayas',
    location: 'Palompon, Leyte',
    latitude: 11.1166,
    longitude: 124.2505,
    estimated_budget: 3000,
    recommended_days: 2,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-island',
    category: { id: 'cat-island', name: 'Island' },
    average_rating: 4.9,
    reviews_count: 15,
    saves_count: 39,
    favorites_count: 31,
    reviews: [],
  },
  {
    id: 'dest-cambugahay-falls',
    name: 'Cambugahay Falls',
    slug: 'cambugahay-falls',
    description:
      'A serene three-tiered waterfall in mystical Siquijor famous for rope swings and peaceful freshwater lagoons.',
    province: 'Siquijor',
    region: 'Central Visayas',
    location: 'Lazi, Siquijor',
    latitude: 9.1415,
    longitude: 123.6267,
    estimated_budget: 1200,
    recommended_days: 1,
    image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-waterfall',
    category: { id: 'cat-waterfall', name: 'Waterfall' },
    average_rating: 4.7,
    reviews_count: 12,
    saves_count: 29,
    favorites_count: 23,
    reviews: [],
  },
  {
    id: 'dest-osmena-peak',
    name: 'Osmeña Peak',
    slug: 'osmena-peak',
    description:
      'The highest point in Cebu Island offering dramatic jagged green hill clusters resembling jagged mini-chocolate hills and cool mountain breeze.',
    province: 'Cebu',
    region: 'Central Visayas',
    location: 'Dalaguete, Cebu',
    latitude: 9.8188,
    longitude: 123.4475,
    estimated_budget: 1800,
    recommended_days: 1,
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-mountain',
    category: { id: 'cat-mountain', name: 'Mountain' },
    average_rating: 4.8,
    reviews_count: 19,
    saves_count: 36,
    favorites_count: 28,
    reviews: [],
  },
  {
    id: 'dest-islas-de-gigantes',
    name: 'Islas de Gigantes',
    slug: 'islas-de-gigantes',
    description:
      'An island chain known for rugged rock cliffs, hidden lagoons, secluded beaches, and the freshest, most affordable scallops in the Philippines.',
    province: 'Iloilo',
    region: 'Western Visayas',
    location: 'Carles, Iloilo',
    latitude: 11.5973,
    longitude: 123.3429,
    estimated_budget: 4500,
    recommended_days: 2,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-island',
    category: { id: 'cat-island', name: 'Island' },
    average_rating: 4.8,
    reviews_count: 14,
    saves_count: 33,
    favorites_count: 27,
    reviews: [],
  },
  {
    id: 'dest-bantayan-island',
    name: 'Bantayan Island',
    slug: 'bantayan-island',
    description:
      'A laid-back tropical getaway at the northern tip of Cebu with quiet powdery beaches, fresh seafood, and bike-friendly fishing villages.',
    province: 'Cebu',
    region: 'Central Visayas',
    location: 'Santa Fe, Bantayan, Cebu',
    latitude: 11.1685,
    longitude: 123.7744,
    estimated_budget: 4000,
    recommended_days: 3,
    image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-beach',
    category: { id: 'cat-beach', name: 'Beach' },
    average_rating: 4.9,
    reviews_count: 21,
    saves_count: 47,
    favorites_count: 41,
    reviews: [],
  },
];

const normalizeDestination = (dest) => {
  if (!dest) return dest;
  const matchedFallback = FALLBACK_DESTINATIONS.find(
    (f) =>
      f.slug === dest.slug ||
      f.name.toLowerCase() === dest.name?.toLowerCase()
  );

  const img = dest.image_url ? dest.image_url.trim() : '';
  const isLocalOrMissing =
    !img ||
    img.startsWith('/images') ||
    img.startsWith('images/') ||
    img.startsWith('./') ||
    img.includes('localhost') ||
    img.includes('127.0.0.1');

  if (isLocalOrMissing) {
    return {
      ...dest,
      image_url:
        matchedFallback?.image_url ||
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    };
  }

  return dest;
};

export const useDestinationStore = defineStore('destination', {
  state: () => ({
    destinations: [],
    currentDestination: null,
    categories: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    },
    filters: {
      search: '',
      region: '',
      province: '',
      category: '',
      page: 1,
    },
    loading: false,
    detailsLoading: false,
    error: null,
  }),

  actions: {
    applyFallbackDestinations(queryParams = {}) {
      let filtered = [...FALLBACK_DESTINATIONS];

      if (queryParams.search) {
        const q = queryParams.search.toLowerCase();
        filtered = filtered.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.province.toLowerCase().includes(q) ||
            d.region.toLowerCase().includes(q) ||
            d.location.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q)
        );
      }

      if (queryParams.region) {
        filtered = filtered.filter(
          (d) => d.region.toLowerCase() === queryParams.region.toLowerCase()
        );
      }

      if (queryParams.province) {
        filtered = filtered.filter(
          (d) => d.province.toLowerCase() === queryParams.province.toLowerCase()
        );
      }

      if (queryParams.category) {
        filtered = filtered.filter(
          (d) =>
            d.category?.name.toLowerCase() === queryParams.category.toLowerCase() ||
            d.category_id === queryParams.category
        );
      }

      const limit = Number(queryParams.limit) || 12;
      const page = Number(queryParams.page) || 1;
      const start = (page - 1) * limit;

      this.destinations = filtered.slice(start, start + limit);
      this.pagination = {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
      };
    },

    async fetchDestinations(customParams = {}) {
      this.loading = true;
      this.error = null;
      const queryParams = {
        ...this.filters,
        ...customParams,
      };

      // Remove empty strings
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '' || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      try {
        const response = await api.get('/destinations', { params: queryParams });
        const list = (response.data?.destinations || []).map(normalizeDestination);
        if (list.length > 0) {
          this.destinations = list;
          this.pagination = response.data.pagination;
        } else {
          this.applyFallbackDestinations(queryParams);
        }
      } catch (err) {
        // Fallback so destinations and their images always display even if backend API is offline
        this.applyFallbackDestinations(queryParams);
      } finally {
        this.loading = false;
      }
    },

    async fetchDestinationDetails(idOrSlug) {
      this.detailsLoading = true;
      this.error = null;
      try {
        const response = await api.get(`/destinations/${idOrSlug}`);
        this.currentDestination = normalizeDestination(response.data.destination);
        return this.currentDestination;
      } catch (err) {
        const fallback = FALLBACK_DESTINATIONS.find(
          (d) => d.slug === idOrSlug || d.id === idOrSlug
        );
        if (fallback) {
          this.currentDestination = fallback;
          return fallback;
        }
        this.error = err.message;
        throw err;
      } finally {
        this.detailsLoading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories');
        const cats = response.data?.categories || [];
        this.categories = cats.length > 0 ? cats : FALLBACK_CATEGORIES;
        return this.categories;
      } catch (err) {
        this.categories = FALLBACK_CATEGORIES;
        return this.categories;
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
      this.filters.page = 1; // reset page on filter change
    },

    resetFilters() {
      this.filters = {
        search: '',
        region: '',
        province: '',
        category: '',
        page: 1,
      };
      this.fetchDestinations();
    },
  },
});
