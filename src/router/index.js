import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Kamar from '../pages/Kamar.vue';
import Tamu from '../pages/Tamu.vue';
import Reservasi from '../pages/Reservasi.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/kamar', name: 'Kamar', component: Kamar },
  { path: '/tamu', name: 'Tamu', component: Tamu },
  { path: '/reservasi', name: 'Reservasi', component: Reservasi }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
