<script setup lang="ts">
import { onMounted, ref } from 'vue';
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

onMounted(async () => {
    const response = await getTeachers();
    teachers.value = response;
});


const openDeleteModal = (teacher: Teacher) => {
    selectedTeacher.value = teacher;
    modalOpen.value = true;
};

const confirmDeleteTeacher = async () => {
    if (!selectedTeacher.value) return;

    const response = await deleteTeacher(selectedTeacher.value.id);
    if (response) {
        teachers.value = teachers.value.filter((t) => t.id !== selectedTeacher.value?.id);
    }
    modalOpen.value = false;
};

const openEditModal = (teacher: Teacher) => {
    editTeacherData.value = { ...teacher };
    console.log("Tanlangan o‘qituvchi ID:", editTeacherData.value?.id);
    editModalOpen.value = true;
};

console.log();



const confirmEditTeacher = async () => {
    if (!editTeacherData.value) return;

    try {
        const response = await api.put(`/admistrator/update_user?ident=${editTeacherData.value.id}`, {
            full_name: editTeacherData.value.full_name,
            email: editTeacherData.value.email,
            phone_number: editTeacherData.value.phone_number.toString(), 
        });

        console.log("Yangilash muvaffaqiyatli:", response.data);
        editModalOpen.value = false;
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};


const nextAddUdt = () => {
    router.push('/teacher/add');
};
</script>

<template>
    
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        <div class="bg-slate-900 rounded-lg shadow-lg w-96 p-6">
            <h2 class="text-lg font-semibold text-gray-300">Tasdiqlash</h2>
            <p class="mt-2 text-gray-300">
                Siz rostdan ham <strong>{{ selectedTeacher?.full_name }}</strong> o‘chirmoqchimisiz?
            </p>
            <div class="mt-4 flex justify-end gap-3">
                <button @click="modalOpen = false"
                    class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                    Bekor qilish
                </button>
                <button @click="confirmDeleteTeacher" class="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                    O‘chirish
                </button>
            </div>
        </div>
    </div>

    
    <div v-if="editModalOpen" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        <div class="bg-slate-900 rounded-lg shadow-lg w-96 p-6">
            <h2 class="text-lg font-semibold text-gray-300">O‘qituvchini tahrirlash</h2>
            <div class="mt-4">
                <input v-model="editTeacherData!.full_name" placeholder="Ism"
                    class="w-full p-2 mb-2 border rounded bg-gray-200">
                <input v-model="editTeacherData!.email" placeholder="Email"
                    class="w-full p-2 mb-2 border rounded bg-gray-200">
                <input v-model="editTeacherData!.phone_number" placeholder="Telefon"
                    class="w-full p-2 mb-2 border rounded bg-gray-200">
            </div>
            <div class="mt-4 flex justify-end gap-3">
                <button @click="editModalOpen = false"
                    class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                    Bekor qilish
                </button>
                <button @click="confirmEditTeacher" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Saqlash
                </button>
            </div>
        </div>
    </div>

    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">O'qituvchilar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha Ustozlar</p>
            </div>
            <button @click="nextAddUdt" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">+ Qo'shish</button>
        </div>
        <table class="w-full text-sm shadow-md sm:rounded-lg overflow-hidden text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase">
                <tr>
                    <th class="px-2 text-white py-3">O'qituvchilar</th>
                    <th class="px-1 text-white py-3">Telefon raqami</th>
                    <th class="px-1 text-white py-3">Email</th>
                    <th class="px-0 text-white py-3 max-md:hidden">Status</th>
                    <th class="px-2 text-white py-3 w-[80px]">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in teachers" :key="index"
                    class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                    <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                        <img class="w-14 h-14 rounded-full border border-white"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                            alt=""> {{ item.full_name }}
                    </th>
                    <td class="px-1 py-4">+998 {{ item.phone_number }}</td>
                    <td class="px-1 py-4">{{ item.email }}</td>
                    <td class="px-0 py-4 max-md:hidden">{{  }}</td>
                    <td class="px-2 py-4 flex gap-3">
                        <span @click="openDeleteModal(item)">
                            <img src="../../../assets/icon/trash.svg" class="w-5 h-5 cursor-pointer">
                        </span>
                        <span @click="openEditModal(item)">
                            <img src="../../../assets/icon/edit.svg" class="w-5 h-5 cursor-pointer">
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
