import { defineStore } from 'pinia';
import api from '@/services/api';

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
    async fetchDestinations(customParams = {}) {
      this.loading = true;
      this.error = null;
      try {
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

        const response = await api.get('/destinations', { params: queryParams });
        this.destinations = response.data.destinations;
        this.pagination = response.data.pagination;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchDestinationDetails(idOrSlug) {
      this.detailsLoading = true;
      this.error = null;
      try {
        const response = await api.get(`/destinations/${idOrSlug}`);
        this.currentDestination = response.data.destination;
        return this.currentDestination;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.detailsLoading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/categories');
        this.categories = response.data.categories;
        return this.categories;
      } catch (err) {
        console.error('Failed to load categories:', err);
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
