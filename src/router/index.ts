import { createRouter, createWebHistory } from 'vue-router'
import Teacher from '@/page/teacher/Page.vue'
import Dashboard from '@/page/dashboard/page.vue'
import Student from '@/page/student/Page.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Login from '@/page/auth/Login.vue'
import Profil from '@/page/profil/Page.vue'
import AddUpdateTeacher from '@/page/teacher/_components/Add&UpdateTeacher.vue'
import Group from '@/page/course/Page.vue'
import Course from "@/page/course/_components/Group.vue"
import Peyment from '@/page/peyment/Page.vue'
import Expence from '@/page/expense/Page.vue'
import StudentsAll from '@/page/student/_components/AllStudents.vue'
const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
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
      path: '/teacher/add',
      name: 'add-teacher',
      component:AddUpdateTeacher, 
      meta: { layout: DefaultLayout, requiresAuth: true }
    },
    {
    path: '/',
    name: 'login',
    component: Login,
    meta: { layout: AuthLayout }
    },
    {
    path: '/payment',
    name: 'peyment',
    component: Peyment,
    meta: { layout: DefaultLayout }
    },   
     {
    path: '/group',
    name: 'group',
    component:Group,
    meta: { layout: DefaultLayout }
    },
     {
    path: '/group/course',
    name: 'course',
    component:Course,
    meta: { layout: DefaultLayout }
    },
     {
    path: '/group/course/students',
    name: 'student',
    component:Student,
    meta: { layout: DefaultLayout }
    },
     {
    path: '/expense',
    name: 'expense',
    component:Expence,
    meta: { layout: DefaultLayout }
    },
     {
    path: '/students',
    name: 'students',
    component:StudentsAll,
    meta: { layout: DefaultLayout }
    },
    {
    path: '/profil',
    name: 'profil',
    component: Profil,
    meta: { layout: DefaultLayout }
    }
  ],

})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token && to.path !== '/login') {
    next('/login'); 
  } else {
    next();
  }
});

  
 
export default router
