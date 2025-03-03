import { createRouter, createWebHashHistory } from 'vue-router'
import Teacher from '@/page/teacher/Teacher.vue'
import Dashboard from '@/page/dashboard/page.vue'
import Student from '@/page/student/Student.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Login from '@/page/auth/Login.vue'
import Cookies from "js-cookie";

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
    }
  
  
  ],

})
router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

  
 
export default router
