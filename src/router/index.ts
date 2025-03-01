import { createRouter, createWebHistory } from 'vue-router'
import About from '@/page/About.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  
  ],
})

export default router
