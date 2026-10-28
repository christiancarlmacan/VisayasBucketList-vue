import { defineStore } from 'pinia';
import api from '@/services/api';
import { useDestinationStore } from './destination';

const LOCAL_BUCKET_KEY = 'vbl_local_bucketlist';
const LOCAL_FAV_KEY = 'vbl_local_favorites';

const loadLocalBucket = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_BUCKET_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalBucket = (items) => {
  localStorage.setItem(LOCAL_BUCKET_KEY, JSON.stringify(items));
};

const loadLocalFavs = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveLocalFavs = (favs) => {
  localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(favs));
};

const computeStats = (items) => {
  const total = items.length;
  const visitedCount = items.filter((i) => i.status === 'VISITED').length;
  const wantToVisitCount = total - visitedCount;
  const completionPercentage = total > 0 ? Math.round((visitedCount / total) * 100) : 0;
  return { total, visitedCount, wantToVisitCount, completionPercentage };
};

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
        const allLocal = loadLocalBucket();
        this.items = status ? allLocal.filter((i) => i.status === status) : allLocal;
        this.stats = computeStats(allLocal);
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
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          const destStore = useDestinationStore();
          if (destStore.destinations.length === 0) {
            await destStore.fetchDestinations();
          }
          const dest =
            destStore.destinations.find((d) => d.id === destinationId) ||
            destStore.currentDestination;
          const allLocal = loadLocalBucket();
          if (!allLocal.some((i) => i.destination_id === destinationId)) {
            const newItem = {
              id: `bl-${Date.now()}`,
              destination_id: destinationId,
              status,
              created_at: new Date().toISOString(),
              destination: dest,
            };
            allLocal.unshift(newItem);
            saveLocalBucket(allLocal);
          }
          await this.fetchBucketList();
          return allLocal[0];
        }
        throw err;
      }
    },

    async updateStatus(idOrDestinationId, status) {
      try {
        const response = await api.put(`/bucketlist/${idOrDestinationId}`, { status });
        await this.fetchBucketList();
        return response.data.item;
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          const allLocal = loadLocalBucket();
          const idx = allLocal.findIndex(
            (i) => i.id === idOrDestinationId || i.destination_id === idOrDestinationId
          );
          if (idx !== -1) {
            allLocal[idx].status = status;
            saveLocalBucket(allLocal);
          }
          await this.fetchBucketList();
          return allLocal[idx];
        }
        throw err;
      }
    },

    async removeFromBucketList(idOrDestinationId) {
      try {
        await api.delete(`/bucketlist/${idOrDestinationId}`);
        await this.fetchBucketList();
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          const allLocal = loadLocalBucket().filter(
            (i) => i.id !== idOrDestinationId && i.destination_id !== idOrDestinationId
          );
          saveLocalBucket(allLocal);
          await this.fetchBucketList();
          return;
        }
        throw err;
      }
    },

    async fetchFavorites() {
      this.favoritesLoading = true;
      try {
        const response = await api.get('/favorites');
        this.favorites = response.data.favorites;
      } catch (err) {
        this.favorites = loadLocalFavs();
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
          await api.post('/favorites', { destinationId });
          await this.fetchFavorites();
        }
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          let allFavs = loadLocalFavs();
          if (isFav) {
            allFavs = allFavs.filter((f) => f.destination_id !== destinationId);
          } else {
            const destStore = useDestinationStore();
            const dest =
              destStore.destinations.find((d) => d.id === destinationId) ||
              destStore.currentDestination;
            allFavs.unshift({
              id: `fav-${Date.now()}`,
              destination_id: destinationId,
              created_at: new Date().toISOString(),
              destination: dest,
            });
          }
          saveLocalFavs(allFavs);
          this.favorites = allFavs;
          return;
        }
        throw err;
      }
    },
  },
});
