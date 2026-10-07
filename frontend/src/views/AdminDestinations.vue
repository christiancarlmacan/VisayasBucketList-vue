<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">
          Destinations Management
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Add, modify, and remove tourist spots across the Visayas.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-teal-500/20"
      >
        + Add New Destination
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="w-full sm:w-72">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by name, province, location..."
          class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <select
          v-model="selectedCategory"
          @change="handleSearch"
          class="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
            <tr>
              <th class="p-4">Destination</th>
              <th class="p-4">Category</th>
              <th class="p-4">Location</th>
              <th class="p-4">Region</th>
              <th class="p-4">Budget</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-slate-400">Loading destinations...</td>
            </tr>
            <tr v-else-if="destinations.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-400">No destinations found.</td>
            </tr>
            <tr
              v-for="d in destinations"
              :key="d.id"
              class="hover:bg-slate-750/30 transition-colors"
            >
              <td class="p-4 flex items-center gap-3">
                <img
                  :src="d.image_url || fallbackImg"
                  class="w-12 h-12 rounded-xl object-cover bg-slate-900"
                />
                <div>
                  <span class="font-bold text-white block">{{ d.name }}</span>
                  <span class="text-[10px] text-slate-400">⭐ {{ d.average_rating || 0 }} ({{ d.reviews_count || 0 }})</span>
                </div>
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full text-[10px] font-bold">
                  {{ d.category?.name }}
                </span>
              </td>
              <td class="p-4">{{ d.province }}</td>
              <td class="p-4">{{ d.region }}</td>
              <td class="p-4 font-bold text-white">
                {{ d.estimated_budget ? `₱${Number(d.estimated_budget).toLocaleString()}` : 'Free' }}
              </td>
              <td class="p-4 text-right space-x-2">
                <button
                  @click="openEditModal(d)"
                  class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-[11px] transition-all"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(d)"
                  class="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg font-bold text-[11px] transition-all"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Create / Edit) -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-lg font-black text-white">
            {{ isEditing ? 'Edit Destination' : 'Add New Destination' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveDestination" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Destination Name *</label>
            <input
              v-model="form.name"
              required
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Category *</label>
              <select
                v-model="form.category_id"
                required
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              >
                <option value="" disabled>Select Category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-300 mb-1">Region *</label>
              <select
                v-model="form.region"
                required
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              >
                <option value="Western Visayas">Western Visayas</option>
                <option value="Central Visayas">Central Visayas</option>
                <option value="Eastern Visayas">Eastern Visayas</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Province *</label>
              <input
                v-model="form.province"
                required
                placeholder="e.g. Cebu, Bohol, Leyte"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Specific Location *</label>
              <input
                v-model="form.location"
                required
                placeholder="e.g. Badian, Cebu"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">Estimated Budget (₱)</label>
              <input
                v-model.number="form.estimated_budget"
                type="number"
                min="0"
                placeholder="e.g. 2500"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">Recommended Days</label>
              <input
                v-model.number="form.recommended_days"
                type="number"
                min="1"
                placeholder="e.g. 1"
                class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">Image URL</label>
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://images.unsplash.com/..."
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-black shadow-md shadow-teal-500/20"
            >
              {{ saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Destination' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const fallbackImg =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80';

const destinations = ref([]);
const categories = ref([]);
const loading = ref(false);
const saving = ref(false);

const searchQuery = ref('');
const selectedCategory = ref('');

// Modal state
const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  name: '',
  category_id: '',
  region: 'Central Visayas',
  province: '',
  location: '',
  description: '',
  estimated_budget: null,
  recommended_days: 1,
  image_url: '',
});

const loadDestinations = async () => {
  loading.value = true;
  try {
    const params = { limit: 50 };
    if (searchQuery.value) params.search = searchQuery.value;
    if (selectedCategory.value) params.category = selectedCategory.value;

    const res = await api.get('/destinations', { params });
    destinations.value = res.data.destinations;
  } catch (err) {
    toast.error('Failed to load destinations.');
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const res = await api.get('/categories');
    categories.value = res.data.categories;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadDestinations();
  loadCategories();
});

const handleSearch = () => {
  loadDestinations();
};

const openCreateModal = () => {
  isEditing.value = false;
  editId.value = null;
  form.value = {
    name: '',
    category_id: categories.value[0]?.id || '',
    region: 'Central Visayas',
    province: '',
    location: '',
    description: '',
    estimated_budget: null,
    recommended_days: 1,
    image_url: '',
  };
  showModal.value = true;
};

const openEditModal = (d) => {
  isEditing.value = true;
  editId.value = d.id;
  form.value = {
    name: d.name,
    category_id: d.category_id || d.category?.id || '',
    region: d.region,
    province: d.province,
    location: d.location,
    description: d.description,
    estimated_budget: d.estimated_budget ? Number(d.estimated_budget) : null,
    recommended_days: d.recommended_days || 1,
    image_url: d.image_url || '',
  };
  showModal.value = true;
};

const saveDestination = async () => {
  saving.value = true;
  try {
    if (isEditing.value) {
      await api.put(`/destinations/${editId.value}`, form.value);
      toast.success('Destination updated successfully!');
    } else {
      await api.post('/destinations', form.value);
      toast.success('Destination created successfully!');
    }
    showModal.value = false;
    loadDestinations();
  } catch (err) {
    toast.error(err.message);
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (d) => {
  if (confirm(`Permanently delete "${d.name}"?`)) {
    try {
      await api.delete(`/destinations/${d.id}`);
      toast.success(`"${d.name}" deleted.`);
      loadDestinations();
    } catch (err) {
      toast.error(err.message);
    }
  }
};
</script>
