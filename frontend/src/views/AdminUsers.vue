<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">
          User Management
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          Manage traveler accounts, permissions, and administrative roles.
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
      <div class="w-full sm:w-80">
        <input
          v-model="searchQuery"
          @input="loadUsers"
          type="text"
          placeholder="Search by user name or email..."
          class="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
      </div>
      <span class="text-xs text-slate-400">
        Total Users: {{ total }}
      </span>
    </div>

    <!-- Table -->
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
            <tr>
              <th class="p-4">User</th>
              <th class="p-4">Role</th>
              <th class="p-4">Bucket List</th>
              <th class="p-4">Reviews</th>
              <th class="p-4">Joined</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center text-slate-400">Loading users...</td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-400">No users found.</td>
            </tr>
            <tr
              v-for="u in users"
              :key="u.id"
              class="hover:bg-slate-750/30 transition-colors"
            >
              <td class="p-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-700 text-teal-300 font-bold flex items-center justify-center text-xs">
                  {{ u.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <span class="font-bold text-white block">{{ u.name }}</span>
                  <span class="text-[10px] text-slate-400">{{ u.email }}</span>
                </div>
              </td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  :class="u.role === 'ADMIN' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-slate-700 text-slate-300'"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="p-4">{{ u._count?.bucket_lists || 0 }} entries</td>
              <td class="p-4">{{ u._count?.reviews || 0 }} reviews</td>
              <td class="p-4 text-slate-400 text-[10px]">
                {{ new Date(u.created_at).toLocaleDateString() }}
              </td>
              <td class="p-4 text-right space-x-2">
                <button
                  @click="toggleRole(u)"
                  class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-bold text-[11px] transition-all"
                >
                  {{ u.role === 'ADMIN' ? 'Demote to User' : 'Make Admin' }}
                </button>
                <button
                  @click="handleDelete(u)"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { getLocalUsers, saveLocalUsers } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const users = ref([]);
const total = ref(0);
const loading = ref(false);
const searchQuery = ref('');

const loadUsers = async () => {
  loading.value = true;
  try {
    const params = { limit: 50 };
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await api.get('/users', { params });
    users.value = res.data.users;
    total.value = res.data.pagination?.total || users.value.length;
  } catch (err) {
    let local = getLocalUsers();
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      local = local.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    users.value = local;
    total.value = local.length;
  } finally {
    loading.value = false;
  }
};

onMounted(loadUsers);

const toggleRole = async (u) => {
  const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
  if (confirm(`Change role of ${u.name} to ${newRole}?`)) {
    try {
      await api.put(`/users/${u.id}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}!`);
      loadUsers();
    } catch (err) {
      const local = getLocalUsers().map((item) =>
        item.id === u.id ? { ...item, role: newRole } : item
      );
      saveLocalUsers(local);
      toast.success(`User role updated to ${newRole}!`);
      loadUsers();
    }
  }
};

const handleDelete = async (u) => {
  if (confirm(`Delete account for "${u.name}"?`)) {
    try {
      await api.delete(`/users/${u.id}`);
      toast.success('User account removed.');
      loadUsers();
    } catch (err) {
      const local = getLocalUsers().filter((item) => item.id !== u.id);
      saveLocalUsers(local);
      toast.success('User account removed.');
      loadUsers();
    }
  }
};
</script>
