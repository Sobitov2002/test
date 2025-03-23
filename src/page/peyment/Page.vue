<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getAllStudents, postStudent } from './services.ts';
import api from '@/service/apiService';

const students = ref<any[]>([]);
const modalOpen = ref(false);
const selectedStudent = ref<any>(null);
const selectedMonth = ref<string>('');
const paymentAmount = ref<number | null>(null);
const paymentType = ref<string>('cash');
const paymentDate = ref<string>('');
const searchQuery = ref<string>('');
const showDeleteModal = ref(false);

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const deleteCount = ref();
const paymentTypes = ['cash', 'click'];

onMounted(async () => {
    try {
        students.value = await getAllStudents();
        console.log(students.value);
    } catch (error) {
        console.log(error);
    }
});

const openPaymentModal = (student: any) => {
    selectedStudent.value = student;
    modalOpen.value = true;
};

const selectedFilter = ref<string>(''); // Payment type filter
const selectedMonthFilter = ref<string>(''); // Month filter

const filteredStudents = computed(() => {
    return students.value.filter(student => {
        const matchesName = searchQuery.value
            ? student.student_name.toLowerCase().includes(searchQuery.value.toLowerCase())
            : true;

        const matchesPaymentType = selectedFilter.value
            ? student.payment_type === selectedFilter.value
            : true;

        const matchesMonth = selectedMonthFilter.value
            ? student.month === selectedMonthFilter.value
            : true;

        return matchesName && matchesPaymentType && matchesMonth;
    });
});

const deletePayment = async (id: number) => {
    try {
        const response = await api.delete(`/payment/delete?ident=${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const selectedPaymentId = ref<number | null>(null);

const openDeleteModal = (student: any) => {
    selectedStudent.value = student;
    selectedPaymentId.value = student.id;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    if (!selectedPaymentId.value) return;
    await deletePayment(selectedPaymentId.value);
    students.value = await getAllStudents(); // Refresh the list
    showDeleteModal.value = false;
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-6">
        <div
            class="max-w-[1400px] mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 overflow-hidden">
            <!-- Header Section -->
            <div class="p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3
                        class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Umumiy to'lov
                    </h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto md:max-w-md">
                    <!-- Month Filter -->
                    <div class="relative">
                        <select v-model="selectedMonthFilter"
                            class="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10">
                            <option value="">Barcha oylar</option>
                            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Search Input -->
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Ism bo'yicha qidirish..."
                            class="w-full px-4 py-2.5 pl-10 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none" />
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto w-full">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" class="px-4 py-4 md:px-6 font-medium">O'quvchilar ma'lumotlari</th>
                            <th scope="col" class="px-3 py-4 font-medium">Guruh</th>
                            <th scope="col" class="px-3 py-4 font-medium">Oy</th>
                            <th scope="col" class="px-3 py-4 font-medium">Summa</th>
                            <th scope="col" class="px-3 py-4 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in filteredStudents" :key="index"
                            class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-150">
                            <th class="px-4 py-3 md:px-6 flex items-center gap-3">
                                <div class="relative">
                                    <img class="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                        alt="" />
                                    <div
                                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800">
                                    </div>
                                </div>
                                <div>
                                    <p class="font-medium">{{ item.student_name }}</p>
                                </div>
                            </th>
                            <td class="px-3 py-3">
                                <span
                                    class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    {{ item.group_name }}
                                </span>
                            </td>
                            <td class="px-3 py-3">
                                <span
                                    class="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                    {{ item.month }}
                                </span>
                            </td>
                            <td class="px-3 py-3 font-medium">
                                <span class="text-green-400">{{ item.total_amount }}</span>
                            </td>
                            <td class="px-3 py-3 text-center">
                                <button @click="openDeleteModal(item)"
                                    class="p-2 rounded-full hover:bg-red-500/20 transition-colors duration-150 group">
                                    <svg class="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors duration-150"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                        </path>
                                    </svg>
                                </button>
                            </td>
                        </tr>

                        <!-- Empty state when no students match filters -->
                        <tr v-if="filteredStudents.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-400">
                                <div class="flex flex-col items-center">
                                    <svg class="w-12 h-12 mb-3 text-slate-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                        </path>
                                    </svg>
                                    <p class="text-lg font-medium">Hech qanday ma'lumot topilmadi</p>
                                    <p class="text-sm mt-1">Boshqa qidiruv parametrlarini sinab ko'ring</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
            <div class="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all"
                :class="showDeleteModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
                <div class="flex items-center justify-center mb-4 bg-red-500/20 w-16 h-16 rounded-full mx-auto">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                    </svg>
                </div>

                <h2 class="text-xl font-bold text-center mb-2">To'lovni o'chirish</h2>
                <p class="text-gray-300 text-center mb-6">
                    {{ selectedStudent ? selectedStudent.student_name : "Tanlangan to'lovni" }} o'chirishni
                    tasdiqlaysizmi?
                </p>

                <div class="flex gap-3">
                    <button @click="showDeleteModal = false"
                        class="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-150 font-medium">
                        Bekor qilish
                    </button>
                    <button @click="confirmDelete"
                        class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-150 font-medium">
                        O'chirish
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>