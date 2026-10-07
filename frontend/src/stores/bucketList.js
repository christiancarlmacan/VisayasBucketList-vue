import { defineStore } from 'pinia';
import api from '@/services/api';

export const useBucketListStore = defineStore('bucketList', {
  state: () => ({
    items: [],
    stats: {
      total: 0,
      visitedCount: 0,
      wantToVisitCount: 0,
      completionPercentage: 0,
    },
    favorites: [],
    loading: false,
    favoritesLoading: false,
    error: null,
  }),

  getters: {
    favoriteDestinationIds: (state) => state.favorites.map((f) => f.destination_id),
    bucketListDestinationIds: (state) => state.items.map((i) => i.destination_id),
    wantToVisitItems: (state) => state.items.filter((i) => i.status === 'WANT_TO_VISIT'),
    visitedItems: (state) => state.items.filter((i) => i.status === 'VISITED'),
  },

  actions: {
    async fetchBucketList(status = null) {
      this.loading = true;
      this.error = null;
      try {
        const params = status ? { status } : {};
        const response = await api.get('/bucketlist', { params });
        this.items = response.data.items;
        this.stats = response.data.stats;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async addToBucketList(destinationId, status = 'WANT_TO_VISIT') {
      try {
        const response = await api.post('/bucketlist', { destinationId, status });
        await this.fetchBucketList();
        return response.data.item;
      } catch (err) {
        throw err;
      }
    },

    async updateStatus(idOrDestinationId, status) {
      try {
        const response = await api.put(`/bucketlist/${idOrDestinationId}`, { status });
        await this.fetchBucketList();
        return response.data.item;
      } catch (err) {
        throw err;
      }
    },

    async removeFromBucketList(idOrDestinationId) {
      try {
        await api.delete(`/bucketlist/${idOrDestinationId}`);
        await this.fetchBucketList();
      } catch (err) {
        throw err;
      }
    },

    async fetchFavorites() {
      this.favoritesLoading = true;
      try {
        const response = await api.get('/favorites');
        this.favorites = response.data.favorites;
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        this.favoritesLoading = false;
      }
    },

    async toggleFavorite(destinationId) {
      const isFav = this.favoriteDestinationIds.includes(destinationId);
      try {
        if (isFav) {
          await api.delete(`/favorites/${destinationId}`);
          this.favorites = this.favorites.filter((f) => f.destination_id !== destinationId);
        } else {
          const response = await api.post('/favorites', { destinationId });
          await this.fetchFavorites();
        }
      } catch (err) {
        throw err;
      }
    },
  },
});
