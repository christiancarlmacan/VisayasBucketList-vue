<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">
          Categories Management
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Organize Visayas travel experiences (Beach, Mountain, Waterfall, Cultural, etc.)
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-teal-500/20"
      >
        + Add New Category
      </button>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
            <tr>
              <th class="p-4">Category Name</th>
              <th class="p-4">Description</th>
              <th class="p-4">Spots Linked</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-if="loading">
              <td colspan="4" class="p-8 text-center text-slate-400">Loading categories...</td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">No categories found.</td>
            </tr>
            <tr
              v-for="cat in categories"
              :key="cat.id"
              class="hover:bg-slate-750/30 transition-colors"
            >
              <td class="p-4 font-black text-white">
                {{ cat.name }}
              </td>
              <td class="p-4 text-slate-400 max-w-md">
                {{ cat.description || '—' }}
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 bg-slate-700 text-slate-200 rounded-full font-bold text-[10px]">
                  {{ cat._count?.destinations || cat.destinations?.length || 0 }} destinations
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button
                  @click="openEditModal(cat)"
                  class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-[11px] transition-all"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(cat)"
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

    <!-- Modal Form -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-lg font-black text-white">
            {{ isEditing ? 'Edit Category' : 'Create Category' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form @submit.prevent="saveCategory" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-300 mb-1">Category Name *</label>
            <input
              v-model="form.name"
              required
              placeholder="e.g. Island, Historical, Eco-Tourism"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Brief summary of places in this category..."
              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-teal-500"
            ></textarea>
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
              class="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-black"
            >
              {{ saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create' }}
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
import { useDestinationStore } from '@/stores/destination';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const destinationStore = useDestinationStore();

const categories = ref([]);
const loading = ref(false);
const saving = ref(false);

const showModal = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  name: '',
  description: '',
});

const loadCategories = async () => {
  loading.value = true;
  try {
    const res = await api.get('/categories');
    categories.value = res.data.categories;
  } catch (err) {
    categories.value = await destinationStore.fetchCategories();
  } finally {
    loading.value = false;
  }
};

onMounted(loadCategories);

const openCreateModal = () => {
  isEditing.value = false;
  editId.value = null;
  form.value = { name: '', description: '' };
  showModal.value = true;
};

const openEditModal = (cat) => {
  isEditing.value = true;
  editId.value = cat.id;
  form.value = { name: cat.name, description: cat.description || '' };
  showModal.value = true;
};

const saveCategory = async () => {
  saving.value = true;
  try {
    if (isEditing.value) {
      await api.put(`/categories/${editId.value}`, form.value);
      toast.success('Category updated successfully!');
    } else {
      await api.post('/categories', form.value);
      toast.success('Category created successfully!');
    }
    showModal.value = false;
    loadCategories();
  } catch (err) {
    toast.error(err.message);
  } finally {
    saving.value = false;
  }
};

const handleDelete = async (cat) => {
  if (confirm(`Delete category "${cat.name}"? Destructive action.`)) {
    try {
      await api.delete(`/categories/${cat.id}`);
      toast.success(`Category "${cat.name}" deleted.`);
      loadCategories();
    } catch (err) {
      toast.error(err.message);
    }
  }
};
</script>
