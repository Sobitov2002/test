<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTeachers, deleteTeacher } from '../servise';
import router from '@/router';

interface Teacher {
    id: string;
    full_name: string;
    phone_number: number;
    email: string;
    role: string;
}

const teachers = ref<Teacher[]>([]);
const modalOpen = ref(false);
const selectedTeacher = ref<Teacher | null>(null);

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

const nextAddUdt = () => {
    router.push('/teacher/add');
};
</script>

<template>
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
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

    <table style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class="w-full max-xl:min-w-[550px] text-sm shadow-md sm:rounded-lg overflow-hidden text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase">
            <tr>
                <th scope="col" class="px-2 text-white py-3 md:px-6">
                    O'qituvchilar ma'lumotlari
                </th>
                <th scope="col" class="px-1 text-white py-3">
                    Telefon raqami
                </th>
                <th scope="col" class="px-1 text-white py-3">
                    Email
                </th>
                <th scope="col" class="px-0 text-white py-3 max-md:hidden">
                    Status
                </th>
                <th scope="col" class="px-2 text-white py-3 w-[80px]">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in teachers" :key="index"
                class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                    <img class="w-14 h-14 rounded-[50%] border border-white"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                        alt=""> {{ item.full_name }}
                </th>
                <td class="px-1 py-4 ">
                    +998 {{ item.phone_number }}
                </td>
                <td class="px-1 py-4">
                    {{ item.email }}
                </td>
                <td class="px-0 py-4 max-md:hidden">
                    <div class="flex items-center">
                        <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> {{ item.role }}
                    </div>
                </td>
                <td class="px-2 py-4 relative">
                    <div class="flex gap-3 h-[18px]">
                        <!-- Delete -->
                        <span @click="openDeleteModal(item)" class="cursor-pointer">
                            <img src="../../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5 cursor-pointer"
                                @click="openDeleteModal(item)">
                        </span>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>
