<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import api from "@/service/apiService";
import { getTeachers, deleteTeacher, updateTeacher } from '../servise';
import router from '@/router';

interface Teacher {
    id: string;
    full_name: string;
    password: string;
    email: string;
    phone_number: number;
}

const teachers = ref<Teacher[]>([]);
const modalOpen = ref(false);
const editModalOpen = ref(false);
const selectedTeacher = ref<Teacher | null>(null);
const editTeacherData = ref<Teacher | null>(null);
const loading = ref(true);
const searchQuery = ref('');

onMounted(async () => {
    try {
        loading.value = true;
        const response = await getTeachers();
        teachers.value = response;
    } catch (error) {
        console.error("Error fetching teachers:", error);
    } finally {
        loading.value = false;
    }
});

const filteredTeachers = computed(() => {
    if (!searchQuery.value) return teachers.value;

    const query = searchQuery.value.toLowerCase();
    return teachers.value.filter(teacher =>
        teacher.full_name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        String(teacher.phone_number).includes(query)
    );
});

const openDeleteModal = (teacher: Teacher) => {
    selectedTeacher.value = teacher;
    modalOpen.value = true;
};

const confirmDeleteTeacher = async () => {
    if (!selectedTeacher.value) return;

    try {
        const isDeleting = ref(true);
        const response = await deleteTeacher(selectedTeacher.value.id);
        if (response) {
            teachers.value = teachers.value.filter((t) => t.id !== selectedTeacher.value?.id);
            showToast('O\'qituvchi muvaffaqiyatli o\'chirildi', 'success');
        }
    } catch (error) {
        console.error("Error deleting teacher:", error);
        showToast('O\'qituvchini o\'chirishda xatolik yuz berdi', 'error');
    } finally {
        modalOpen.value = false;
    }
};

const openEditModal = (teacher: Teacher) => {
    editTeacherData.value = { ...teacher };
    console.log("Tanlangan o'qituvchi ID:", editTeacherData.value?.id);
    editModalOpen.value = true;
};

const confirmEditTeacher = async () => {
    if (!editTeacherData.value) return;

    try {
        const isUpdating = ref(true);
        const response = await api.put(`/admistrator/update_user?ident=${editTeacherData.value.id}`, {
            full_name: editTeacherData.value.full_name,
            email: editTeacherData.value.email,
            phone_number: editTeacherData.value.phone_number.toString(),
        });

        // Update the teacher in the local array
        const index = teachers.value.findIndex(t => t.id === editTeacherData.value?.id);
        if (index !== -1) {
            teachers.value[index] = { ...editTeacherData.value };
        }

        showToast('O\'qituvchi muvaffaqiyatli yangilandi', 'success');
        editModalOpen.value = false;
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        showToast('O\'qituvchini yangilashda xatolik yuz berdi', 'error');
    }
};

const nextAddUdt = () => {
    router.push('/teacher/add');
};

// Toast notification
const toast = ref({
    show: false,
    message: '',
    type: 'info'
});

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast.value = {
        show: true,
        message,
        type
    };

    setTimeout(() => {
        toast.value.show = false;
    }, 3000);
};

const formatPhoneNumber = (phone: number) => {
    const phoneStr = String(phone);
    if (phoneStr.length === 9) {
        return `+998 ${phoneStr.substring(0, 2)} ${phoneStr.substring(2, 5)} ${phoneStr.substring(5, 7)} ${phoneStr.substring(7, 9)}`;
    }
    return `+998 ${phoneStr}`;
};
</script>

<template>
    <!-- Delete Confirmation Modal -->
    <div v-if="modalOpen"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
        <div
            class="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 opacity-100">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white">Tasdiqlash</h2>
                <button @click="modalOpen = false" class="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="bg-slate-800 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                    <div class="bg-red-500 bg-opacity-20 rounded-full p-3 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <p class="text-gray-300">
                        Siz rostdan ham <span class="font-bold text-white">{{ selectedTeacher?.full_name }}</span>
                        o'chirmoqchimisiz?
                    </p>
                </div>
            </div>
            <div class="flex justify-end gap-3">
                <button @click="modalOpen = false"
                    class="px-4 py-2 text-gray-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                    Bekor qilish
                </button>
                <button @click="confirmDeleteTeacher"
                    class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    O'chirish
                </button>
            </div>
        </div>
    </div>

    <!-- Edit Teacher Modal -->
    <div v-if="editModalOpen"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
        <div
            class="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 opacity-100">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white">O'qituvchini tahrirlash</h2>
                <button @click="editModalOpen = false" class="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">To'liq ism</label>
                    <input v-model="editTeacherData!.full_name" placeholder="To'liq ism"
                        class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input v-model="editTeacherData!.email" placeholder="Email"
                        class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Telefon raqami</label>
                    <input v-model="editTeacherData!.phone_number" placeholder="Telefon raqami"
                        class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button @click="editModalOpen = false"
                    class="px-4 py-2 text-gray-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                    Bekor qilish
                </button>
                <button @click="confirmEditTeacher"
                    class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Saqlash
                </button>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="p-6 rounded-xl max-w-[1400px] mx-auto shadow-xl"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4 mb-6">
            <div>
                <h3 class="text-3xl font-bold text-white mb-2">O'qituvchilar</h3>
                <p class="text-gray-400 text-sm">O'qituvchilar ro'yxati va boshqaruvi</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Qidirish..."
                        class="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button @click="nextAddUdt"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Qo'shish
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTeachers.length === 0" class="bg-slate-800 rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 class="text-xl font-medium text-white mb-2">O'qituvchilar topilmadi</h3>
            <p class="text-gray-400">Hozircha o'qituvchilar ro'yxati bo'sh yoki qidiruv natijasi bo'sh</p>
        </div>

        <!-- Teachers Table -->
        <div v-else class="overflow-hidden rounded-xl shadow-md">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-800 text-gray-300 text-sm uppercase">
                        <tr>
                            <th class="px-6 py-4 font-medium">O'qituvchilar</th>
                            <th class="px-6 py-4 font-medium">Telefon raqami</th>
                            <th class="px-6 py-4 font-medium">Email</th>
                            <th class="px-6 py-4 font-medium max-md:hidden">Status</th>
                            <th class="px-6 py-4 font-medium text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700">
                        <tr v-for="(item, index) in filteredTeachers" :key="index"
                            class="bg-slate-800 hover:bg-slate-700 transition-colors duration-150 text-white">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <img class="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                            alt="">
                                        <span
                                            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></span>
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ item.full_name }}</p>
                                        <p class="text-xs text-gray-400">O'qituvchi</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-300">{{ formatPhoneNumber(item.phone_number) }}</td>
                            <td class="px-6 py-4 text-gray-300">{{ item.email }}</td>
                            <td class="px-6 py-4 max-md:hidden">
                                <span
                                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-500 bg-opacity-20 text-green-500">
                                    Faol
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end gap-3">
                                    <button @click="openEditModal(item)"
                                        class="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 hover:bg-opacity-30 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="openDeleteModal(item)"
                                        class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination (Optional) -->
        
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100"
        :class="{
            'bg-green-600': toast.type === 'success',
            'bg-red-600': toast.type === 'error',
            'bg-blue-600': toast.type === 'info'
        }">
        <div class="flex items-center">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-if="toast.type === 'info'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white font-medium">{{ toast.message }}</span>
        </div>
    </div>
</template>

<style scoped>
/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.fixed {
    animation: fadeIn 0.3s ease-out;
}

.transform {
    animation: slideIn 0.3s ease-out;
}

/* Focus styles */
input:focus,
button:focus {
    outline: none;
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
}
</style>