import { createRouter, createWebHashHistory } from 'vue-router'
import Teacher from '@/page/teacher/Teacher.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Student from '@/page/student/Student.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
    },
    {
      path: '/teacher',
      name: 'about',
      component: Teacher
    },
    {
      path: '/student',
      name: 'student',
      component: Student
    }
  
  ],
})

export default router
