import { defineStore } from 'pinia';
import api from '@/services/api';

const LOCAL_USERS_KEY = 'vbl_local_users';

const getLocalUsers = () => {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.some((u) => u.email === 'traveler@visayasbucketlist.ph')) {
      list.push({
        id: 'demo-traveler-id',
        name: 'Juan Dela Cruz',
        email: 'traveler@visayasbucketlist.ph',
        password: 'User@123456',
        role: 'USER',
        profile_image: null,
        created_at: new Date().toISOString(),
      });
    }
    return list;
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    async register({ name, email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', { name, email, password });
        const { user, token } = response.data;
        this.setUserSession(user, token);
        return user;
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          const normalizedEmail = email.toLowerCase().trim();
          const users = getLocalUsers();
          if (users.some((u) => u.email === normalizedEmail)) {
            throw new Error('An account with this email already exists.');
          }
          const newUser = {
            id: `user-${Date.now()}`,
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'USER',
            profile_image: null,
            created_at: new Date().toISOString(),
          };
          users.push(newUser);
          saveLocalUsers(users);
          const { password: _, ...safeUser } = newUser;
          const token = `local-jwt-${Date.now()}`;
          this.setUserSession(safeUser, token);
          return safeUser;
        }
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;
        this.setUserSession(user, token);
        return user;
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          const normalizedEmail = email.toLowerCase().trim();
          const users = getLocalUsers();
          const found = users.find(
            (u) => u.email === normalizedEmail && u.password === password
          );
          if (!found) {
            throw new Error('Invalid email or password credentials.');
          }
          const { password: _, ...safeUser } = found;
          const token = `local-jwt-${Date.now()}`;
          this.setUserSession(safeUser, token);
          return safeUser;
        }
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMe() {
      if (!this.token) return null;
      if (this.token.startsWith('local-jwt')) {
        return this.user;
      }
      try {
        const response = await api.get('/auth/me');
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      } catch (err) {
        if (err.message === 'Network Error' || err.message.includes('timeout')) {
          return this.user;
        }
        this.logout();
        return null;
      }
    },

    setUserSession(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});
