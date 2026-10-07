import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Explore from '@/views/Explore.vue';
import DestinationDetails from '@/views/DestinationDetails.vue';
import BucketList from '@/views/BucketList.vue';
import Favorites from '@/views/Favorites.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
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

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
