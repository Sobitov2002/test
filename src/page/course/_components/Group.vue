<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getTeachers } from '@/page/teacher/servise'
import api from '@/service/apiService'
import router from '@/router'
import { useGroupStore } from '../store/groupStore'

interface Group {
  id: number
  name: string
  student_count?: number
  active_student_count?: number // Added for active students count
  price?: number
  period?: number
  course_id?: number
  teacher_id?: number
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

const newGroupName = ref("")
const selectedTeacherId = ref<number | null>(null)
const coursePrice = ref<number | null>(null)
const coursePeriod = ref<number | null>(null)
const showUpdateModal = ref(false)

const openUpdateModal = (group: Group) => {
  selectedGroup.value = group
  newGroupName.value = group.name
  coursePrice.value = group.price || null
  coursePeriod.value = group.period || null
  selectedTeacherId.value = group.teacher_id || null
  showUpdateModal.value = true
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
          // If the API doesn't return active_student_count directly,
          // we'll assume it's the same as student_count when using the status=active parameter
          return res.data.map((group: Group) => ({
            ...group,
            active_student_count: group.student_count
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
</script>

<template>
  <div class="bg-slate-900 bg-opacity-90 p-6 rounded-xl max-w-[1400px] mx-auto shadow-xl">
    <div class="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
      <div>
        <h3 class="text-3xl max-md:text-2xl font-bold text-white">
          Guruhlar
        </h3>
      </div>
      <button @click="isModalOpen = true"
        class="bg-blue-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
        <span class="text-lg font-medium">+</span> Qo'shish
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="(item, index) in groupData" :key="index"
        class="relative bg-slate-950/55 rounded-xl py-5 overflow-hidden shadow-lg border border-slate-800 hover:border-slate-700 transition-all duration-200">
        <div @click="selectGroup(item)" class="p-5 cursor-pointer">
          <p class="text-white text-xl font-bold mb-2">{{ item.name }}</p>
          <p class="text-slate-300 text-sm">
            <span class="bg-green-800 px-2 py-0.5 rounded-md">{{ item.active_student_count || 0 }}</span>
          </p>
        </div>

        <div class="absolute right-3 top-3 flex gap-2">

          <button @click.stop="openUpdateModal(prepareItem(item))"
            class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" viewBox="0 0 20 20"
              fill="currentColor">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button @click.stop="openDeleteModal(item)"
            class="p-2 bg-slate-800 hover:bg-red-900 rounded-lg transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-slate-950 bg-opacity-80 z-50">
      <div class="bg-slate-900 p-6 rounded-xl shadow-2xl w-96 border border-slate-800">
        <h2 class="text-xl font-bold text-white mb-4">O'chirish</h2>
        <p class="text-slate-300 mb-6">
          "{{ selectedGroup?.name }}" guruhini o'chirishni tasdiqlang.
        </p>

        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200">
            Bekor qilish
          </button>
          <button @click="confirmDelete"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200">
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-slate-950 bg-opacity-80 flex items-center justify-center z-50">
      <div class="bg-slate-900 p-6 rounded-xl shadow-2xl w-[450px] border border-slate-800">
        <h2 class="text-2xl text-white font-bold mb-6">Guruhni tahrirlash</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Guruh nomi</label>
            <input v-model="newGroupName" type="text" placeholder="Guruh nomi"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Narx</label>
            <input v-model="coursePrice" type="number" placeholder="Narx"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Davomiylik (oy)</label>
            <input v-model="coursePeriod" type="number" placeholder="Davomiylik (oy)"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">O'qituvchi</label>
            <select v-model="selectedTeacherId"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600">
              <option value="" disabled>O'qituvchini tanlang</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="showUpdateModal = false"
            class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200">
            Bekor qilish
          </button>
          <button @click="updateGroup"
            class="px-5 py-2.5 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200">
            Yangilash
          </button>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-950 bg-opacity-80 flex items-center justify-center z-50">
      <div class="bg-slate-900 p-6 rounded-xl shadow-2xl w-[450px] border border-slate-800">
        <h2 class="text-2xl text-white font-bold mb-6">Yangi guruh qo'shish</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Guruh nomi</label>
            <input v-model="newGroupName" type="text" placeholder="Guruh nomini kiriting"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">O'qituvchi</label>
            <select v-model="selectedTeacherId"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600">
              <option value="" disabled>O'qituvchini tanlang</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.full_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Narx</label>
            <input v-model="coursePrice" type="number" placeholder="Narxni kiriting"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>

          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1">Davomiylik (oy)</label>
            <input v-model="coursePeriod" type="number" placeholder="Dars davomiyligini kiriting (oylarda)"
              class="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-600" />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button @click="isModalOpen = false"
            class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200">
            Bekor qilish
          </button>
          <button @click="addGroup"
            class="px-5 py-2.5 bg-blue-600 hover:bg-slate-500 text-white rounded-lg transition-colors duration-200">
            Qo'shish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>