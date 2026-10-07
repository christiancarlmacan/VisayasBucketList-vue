import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Explore from '@/views/Explore.vue';
import DestinationDetails from '@/views/DestinationDetails.vue';
import BucketList from '@/views/BucketList.vue';
import Favorites from '@/views/Favorites.vue';
import Visited from '@/views/Visited.vue';
import Achievements from '@/views/Achievements.vue';
import Profile from '@/views/Profile.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

// Admin Views
import AdminDashboard from '@/views/AdminDashboard.vue';
import AdminDestinations from '@/views/AdminDestinations.vue';
import AdminCategories from '@/views/AdminCategories.vue';
import AdminReviews from '@/views/AdminReviews.vue';
import AdminUsers from '@/views/AdminUsers.vue';

import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
  },
  {
    path: '/destinations/:id',
    name: 'DestinationDetails',
    component: DestinationDetails,
  },
  {
    path: '/bucket-list',
    name: 'BucketList',
    component: BucketList,
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true },
  },
  {
    path: '/visited',
    name: 'Visited',
    component: Visited,
    meta: { requiresAuth: true },
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: Achievements,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },

  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/destinations',
    name: 'AdminDestinations',
    component: AdminDestinations,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: AdminCategories,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/reviews',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true, layout: 'admin' },
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresAdmin && (!isAuthenticated || !isAdmin)) {
    return next({ name: 'Home' });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
