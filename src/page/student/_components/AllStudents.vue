<script setup lang="ts">
import api from '@/service/apiService';
import { postStudent } from '../services';
import { onMounted, ref, computed } from 'vue';

const students = ref([]);

const modalOpen = ref(false);
const selectedStudent = ref<any>(null);
const selectedMonth = ref<string>('');
const paymentDiscount = ref<number>()
const paymentAmount = ref<number | null>(null);
const paymentType = ref<string>('cash');
const paymentDate = ref<string>(new Date().toISOString().split('T')[0]);
const paymentSuccess = ref(false);
const isLoading = ref(false);
const searchQuery = ref("");
const fetchFulstudent = ref<any[]>([]);
// Add status filter
const statusFilter = ref<string>("active");

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const paymentTypes = ['cash', 'click'];

// Add status options
const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' }
];

const isFormValid = computed(() => {
    return selectedStudent.value &&
        paymentAmount.value &&
        selectedMonth.value &&
        paymentDate.value;
});

// Update the fetch function to use the status filter
const fetchStudents = async (status = statusFilter.value) => {
    try {
        isLoading.value = true;
        const response = await api.get(`student/get_all_students?status=${status}`, { withCredentials: true });
        students.value = response.data;
        fetchFulstudent.value = response.data;
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchStudents();
});

// Add function to handle status change
const handleStatusChange = (status: string) => {
    statusFilter.value = status;
    fetchStudents(status);
};

interface students {
    id: number;
    name: string;
    full_name: string;
    phone_number: number;
    group_name: string;
    discount: number;
}
interface Student {
    full_name: string;
    started_date: string;
    phone_number: string;
}

const Student = ref<Student[]>([]);

const openPaymentModal = (student: any) => {
    selectedStudent.value = student;
    modalOpen.value = true;
    paymentSuccess.value = false;
    paymentDate.value = new Date().toISOString().split('T')[0];

};

const confirmPayment = async () => {
    if (!isFormValid.value) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    const paymentData = {
        student_id: selectedStudent.value?.id || 0,
        group_id: selectedStudent.value?.group_id || 0,
        amount: paymentAmount.value || 0,
        month: selectedMonth.value || 'January',
        payment_type: paymentType.value || 'cash',
        payment_date: paymentDate.value || new Date().toISOString().split('T')[0],
        discount: paymentDiscount.value || 0
    };

    try {
        isLoading.value = true;
        await postStudent(paymentData);
        console.log("Payment successfully submitted:", paymentData);
        paymentSuccess.value = true;

        setTimeout(() => {
            modalOpen.value = false;
            paymentSuccess.value = false;
            paymentAmount.value = null;
            selectedMonth.value = '';
            paymentType.value = 'cash';
        }, 1500);
    } catch (error) {
        console.error("To'lovni yuborishda xatolik yuz berdi:", error);
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    if (!isLoading.value) {
        modalOpen.value = false;
    }
};


const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value;

    return students.value.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

</script>

<template>
    <!-- Modal Backdrop with transition -->
    <transition name="fade">
        <div v-if="modalOpen" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            @click="closeModal">

            <!-- Modal Card -->
            <div class="relative max-w-md w-full mx-4" @click.stop>
                <div
                    class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
                    <!-- Modal Header -->
                    <div class="p-5 border-b border-slate-700">
                        <h2 class="text-xl font-bold text-white">To'lov oynasi</h2>
                        <p class="mt-1 text-slate-300">
                            <span class="font-medium">{{ selectedStudent?.full_name }}</span> uchun to'lov
                        </p>
                    </div>

                    <!-- Success Message -->
                    <div v-if="paymentSuccess" class="p-8 flex flex-col items-center justify-center">
                        <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-1">To'lov amalga oshirildi!</h3>
                        <p class="text-slate-400 text-center">To'lov muvaffaqiyatli qayd etildi</p>
                    </div>

                    <!-- Payment Form -->
                    <div v-else class="p-5 space-y-4">
                        <!-- Payment Amount -->
                        <div class="space-y-1.5">
                            <label for="payment-amount" class="block text-sm font-medium text-slate-300">To'lov
                                qiymati</label>
                            <div class="relative">
                                <input v-model="paymentAmount" type="number" id="payment-amount"
                                    placeholder="Miqdorni kiriting"
                                    class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            </div>
                        </div>

                        <!-- Month Selection -->
                        <div class="space-y-1.5">
                            <label for="month-select" class="block text-sm font-medium text-slate-300">Oyni
                                tanlang</label>
                            <select v-model="selectedMonth" id="month-select"
                                class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                <option value="" disabled selected>Oyni tanlang</option>
                                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <label for="payment-amount" class="block text-sm font-medium text-slate-300">Chegirma
                                (%)</label>
                            <div class="relative">
                                <input v-model="paymentDiscount" type="number" id="payment-amount"
                                    placeholder="Miqdorni kiriting"
                                    class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                            </div>
                        </div>
                        <!-- Payment Type -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-slate-300">To'lov turi</label>
                            <div class="flex space-x-4">
                                <label v-for="type in paymentTypes" :key="type" class="flex items-center">
                                    <input type="radio" :value="type" v-model="paymentType"
                                        class="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500" />
                                    <span class="ml-2 text-slate-300 capitalize">{{ type }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Payment Date -->
                        <div class="space-y-1.5">
                            <label for="payment-date" class="block text-sm font-medium text-slate-300">To'lov
                                sanasi</label>
                            <input v-model="paymentDate" type="date" id="payment-date"
                                class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div v-if="!paymentSuccess" class="p-5 border-t border-slate-700 flex justify-end space-x-3">
                        <button @click="closeModal" :disabled="isLoading"
                            class="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
                            Bekor qilish
                        </button>
                        <button @click="confirmPayment" :disabled="isLoading || !isFormValid"
                            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:bg-blue-800/50 flex items-center">
                            <span v-if="isLoading"
                                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Tasdiqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>

    <!-- Main Content -->
    <div
        class="p-6 rounded-xl w-full mx-auto bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl border border-slate-700">
        <!-- Header -->
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-700">
            <div>
                <h3 class="text-2xl md:text-3xl font-bold text-white">O'quvchilar</h3>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <!-- Status Filter Tabs -->
                <div class="flex bg-slate-800/50 rounded-lg p-1 w-full sm:w-auto">
                    <button v-for="status in statusOptions" :key="status.value"
                        @click="handleStatusChange(status.value)" :class="[
                            'px-4 py-2 text-sm font-medium rounded-md transition-all flex-1 sm:flex-none',
                            statusFilter === status.value
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-300 hover:bg-slate-700/50'
                        ]">
                        {{ status.label }}
                    </button>
                </div>

                <!-- Search Input -->
                <div class="relative w-full sm:w-auto">
                    <input v-model="searchQuery" type="text" placeholder="Qidirish..."
                        class="bg-[#111633] text-white px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !students.length" class="flex justify-center items-center py-20">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Students Table - 100% width with horizontal scroll -->
        <div v-else class="w-full rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <div class="table-scroll-container">
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-800 text-slate-300 uppercase text-xs tracking-wider">
                        <tr>
                            <th class="px-6 py-4 whitespace-nowrap">O'quvchilar</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">Telefon raqam</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">To'lov summa</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">Chegirma</th>
                            <th class="px-6 py-4 text-center whitespace-nowrap">Amallar</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700">
                        <tr v-for="(item, index) in filteredStudents" :key="index"
                            class="bg-slate-800/30 hover:bg-slate-700/50 transition-colors text-white">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden hidden lg:block border border-slate-600">
                                        <img class="w-full h-full object-cover"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                            alt="" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ item.full_name }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap  ">{{ item.phone_number }}
                            </td>

                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap">
                                {{ item.payment_amount.toLocaleString() }}
                            </td>
                            <td class="px-6 py-4 text-slate-300 text-center whitespace-nowrap">{{ item.discount }} %
                            </td>
                            <td class="px-6 py-4 text-center whitespace-nowrap">
                                <button @click="openPaymentModal(item)"
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>To'lov </span>
                                </button>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="!students.length && !isLoading">
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                                <div class="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-slate-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p class="text-lg font-medium">O'quvchilar topilmadi</p>
                                    <p class="mt-1">{{ statusFilter }} holatidagi o'quvchilar ro'yxati bo'sh</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.table-scroll-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    position: relative;
    display: block;
}


.table-scroll-container::-webkit-scrollbar {
    height: 6px;
}

.table-scroll-container::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.2);
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.5);
    border-radius: 10px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.7);
}


table {
    width: 100%;
    min-width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
}


.whitespace-nowrap {
    white-space: nowrap;
}

@media (max-width: 768px) {
    .table-scroll-container {
        width: 100%;
        max-width: 100vw;
    }

    table {
        min-width: 800px;

    }
}
</style>