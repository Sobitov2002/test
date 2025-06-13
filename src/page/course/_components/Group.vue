<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTeachers } from '@/page/teacher/servise'
import api from '@/service/apiService'
import router from '@/router'
import { useGroupStore } from '../store/groupStore'

interface Group {
  id: number
  name: string
  student_count?: number
  active_student_count?: number
  price?: number
  period?: number
  course_id?: number
  teacher_id?: number
  status?: string
}

interface Teacher {
  id: number
  full_name: string
}

const groupStore = useGroupStore()
const groupData = ref<Group[]>([])
const teachers = ref<Teacher[]>([])
const isModalOpen = ref(false)
const showDeleteModal = ref(false)
const selectedGroup = ref<Group | null>(null)
const showDropdown = ref<number | null>(null)

const newGroupName = ref("")
const selectedTeacherId = ref<number | null>(null)
const coursePrice = ref<number | null>(null)
const coursePeriod = ref<number | null>(null)
const showUpdateModal = ref(false)

const toggleDropdown = (id: number) => {
  showDropdown.value = showDropdown.value === id ? null : id
}

const openUpdateModal = (group: Group) => {
  selectedGroup.value = group
  newGroupName.value = group.name
  coursePrice.value = group.price || null
  coursePeriod.value = group.period || null
  selectedTeacherId.value = group.teacher_id || null
  showUpdateModal.value = true
  showDropdown.value = null
}

onMounted(async () => {
  if (!groupStore.selectedGroupId) {
    console.warn("Tanlangan kurs ID mavjud emas.")
    return
  }

  try {
    [teachers.value, groupData.value] = await Promise.all([
      getTeachers(),
      api.get(`group/get?course_id=${groupStore.selectedGroupId}&status=active`, { withCredentials: true })
        .then(res => {
          return res.data.map((group: Group) => ({
            ...group,
            active_student_count: group.student_count,
            status: 'active'
          }))
        })
    ])
    console.log("Group data", groupData.value)
    console.log("Teachers", teachers.value)
  } catch (error) {
    console.error("Xatolik:", error)
  }
})

const selectGroup = (group: Group) => {
  localStorage.setItem("groupId", group.id.toString())
  router.push('/group/course/students')
}

const addGroup = async () => {
  const groupData = JSON.stringify({
    name: newGroupName.value.trim(),
    period: Number(coursePeriod.value),
    price: Number(coursePrice.value),
    course_id: Number(groupStore.selectedGroupId),
    teacher_id: Number(selectedTeacherId.value)
  })

  try {
    const response = await api.post('/group/create', groupData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("Guruh yaratildi:", response.data)
    isModalOpen.value = false
    window.location.reload()
  } catch (error) {
    console.error("Guruh yaratishda xatolik yuz berdi:", error)
  }
}

const openDeleteModal = (group: Group) => {
  selectedGroup.value = group
  showDeleteModal.value = true
  showDropdown.value = null
}

const confirmDelete = async () => {
  if (!selectedGroup.value) return

  try {
    await api.delete(`group/delete?ident=${selectedGroup.value.id}`, { withCredentials: true })
    console.log("Guruh o'chirildi:", selectedGroup.value.name)
    showDeleteModal.value = false
    window.location.reload()
  } catch (error) {
    console.error("Guruhni o'chirishda xatolik yuz berdi:", error)
  }
}

const prepareItem = (item: Group): Group => ({
  ...item,
  price: item.price || 0,
  period: item.period || 0,
  course_id: item.course_id || 0,
  teacher_id: item.teacher_id || 0
})

const updateGroup = async () => {
  if (!selectedGroup.value || !groupStore.selectedGroupId) return

  const updatedData = JSON.stringify({
    name: newGroupName.value.trim(),
    period: Number(coursePeriod.value),
    price: Number(coursePrice.value),
    course_id: Number(groupStore.selectedGroupId),
    teacher_id: Number(selectedTeacherId.value),
    group_id: Number(selectedGroup.value.id)
  })

  try {
    const response = await api.put(`group/update?ident=${selectedGroup.value.id}`, updatedData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log("Guruh yangilandi:", response.data)
    showUpdateModal.value = false
    window.location.reload()
  } catch (error) {
    console.error("Guruhni yangilashda xatolik:", error)
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('UZS', '')
}

const getTeacherName = (teacherId: number | undefined) => {
  if (!teacherId) return 'Not assigned'
  const teacher = teachers.value.find(t => t.id === teacherId)
  return teacher ? teacher.full_name : 'Not assigned'
}
</script>

<template>
  <div
        class="container p-6 rounded-xl max-w-[1400px] mx-auto bg-gradient-to-br from-[#060b26] to-[#1a1f37] shadow-2xl">
        <div class="flex justify-between items-center border-b border-gray-700/50 pb-4 mb-6">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-white">
                    <span class="bg-clip-text text-white">Guruhlar</span>
                </h3>
            </div>
            <button @click="isModalOpen = true"
        class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <span class="font-medium">+</span> Qo'shish
      </button>
        </div>

        <div class="flex justify-between items-center mb-6">
      
      
    </div>

    <div class="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="group in groupData" :key="group.id" 
        class="bg-slate-800 rounded-lg text-white  p-5 relative hover:shadow-md transition-shadow">
        <div class="relative">
          <!-- Menu button -->
          <button @click.stop="toggleDropdown(group.id)" 
            class="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          <!-- Dropdown menu -->
          <div v-if="showDropdown === group.id" 
            class="absolute right-0 top-8 bg-white shadow-lg rounded-lg border border-gray-100 z-10 w-32">
            <div class="py-1">
              <button @click.stop="openUpdateModal(prepareItem(group))" 
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button @click.stop="openDeleteModal(group)" 
                class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div @click="selectGroup(group)" class="cursor-pointer">
          <h2 class="text-xl font-bold mb-1">{{ group.name }}</h2>
          
          <div class="mb-3">
            <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {{ group.status }}
            </span>
          </div>
          
          <p class="text-gray-500 text-sm mb-4">
            {{ getTeacherName(group.teacher_id) }}
          </p>
          
          <div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span class="text-white">O'quvchilar</span>
            <span class="ml-auto font-medium">{{ group.active_student_count || 0 }} / 30</span>
          </div>
          
          <div class="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-white">Muddati</span>
            <span class="ml-auto font-medium">{{ group.period || 0 }} Hafta</span>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white">Narxi</span>
            <span class="ml-auto font-medium">{{ formatPrice(group.price || 0) }}</span>
          </div>
<!--           
          <div class="pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
            <div>Starts: {{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</div>
            <div>Ends: {{ new Date(Date.now() + (group.period || 4) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 class="text-xl font-bold mb-4">O'chirish</h2>
        <p class="text-gray-600 mb-6">
          "{{ selectedGroup?.name }}" guruhini o'chirishni tasdiqlang.
        </p>

        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Bekor qilish
          </button>
          <button @click="confirmDelete"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl w-[450px]">
        <h2 class="text-2xl font-bold mb-6">Guruhni tahrirlash</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Guruh nomi</label>
            <input v-model="newGroupName" type="text" placeholder="Guruh nomi"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Narx</label>
            <input v-model="coursePrice" type="number" placeholder="Narx"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">Davomiylik (hafta)</label>
            <input v-model="coursePeriod" type="number" placeholder="Davomiylik (hafta)"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>

          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">O'qituvchi</label>
            <select v-model="selectedTeacherId"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="" disabled>O'qituvchini tanlang</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="showUpdateModal = false"
            class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Bekor qilish
          </button>
          <button @click="updateGroup"
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Yangilash
          </button>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-slate-900 p-6 rounded-lg shadow-xl w-[450px]">
        <h2 class="text-2xl font-bold mb-6 text-white">Yangi guruh qo'shish</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-white text-sm font-medium mb-1">Guruh nomi</label>
            <input v-model="newGroupName" type="text" placeholder="Guruh nomini kiriting"
              class="w-full bg-gray-800  text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-1">O'qituvchi</label>
            <select v-model="selectedTeacherId"
              class="w-full bg-gray-800  text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <option value="" disabled></option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-1">Narx</label>
            <input v-model="coursePrice" type="number" placeholder="Narxni kiriting"
              class="w-full bg-gray-800 text-white border border-gray-300 text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>

          <div>
            <label class="block text-white text-sm font-medium mb-1">Davomiylik (hafta)</label>
            <input v-model="coursePeriod" type="number" placeholder="Dars davomiyligini kiriting (haftalarda)"
              class="w-full bg-gray-800 text-white text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-200" />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="isModalOpen = false"
            class="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
            Bekor qilish
          </button>
          <button @click="addGroup"
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Qo'shish
          </button>
        </div>
      </div>
    </div>
        </div>
</template>
