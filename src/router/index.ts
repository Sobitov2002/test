import { createRouter, createWebHashHistory } from 'vue-router'
import Teacher from '@/page/teacher/Teacher.vue'
import Dashboard from '@/page/dashboard/page.vue'
import Student from '@/page/student/Page.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Login from '@/page/auth/Login.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      meta: { layout: DefaultLayout }

    },
    {
      path: '/teacher',
      name: 'about',
      component: Teacher,
      meta: { layout: DefaultLayout }
    },
    {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { layout: AuthLayout }
    },
    {
    path: '/student',
    name: 'student',
    component: Student,
    meta: { layout: DefaultLayout }
    }
  ],

})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' }); 
  } else {
    next();
  }
});

  
 
export default router
