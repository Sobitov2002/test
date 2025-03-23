<script setup lang="ts">
import { ref, onMounted , computed } from 'vue';
import PageContainer from '@/components/ui/PageContainer.vue';
import { getAllStudents, postStudent,  } from './services.ts';
import api from '@/service/apiService'


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

const selectedFilter = ref<string>(''); // Payment type uchun filter
const selectedMonthFilter = ref<string>(''); // Oy bo‘yicha filter

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
        const response = await api.delete(`/payment/delete?ident=${id}`,);
        return response.data
    } catch (error) {
        console.log(error);

    }
}

const selectedPaymentId = ref<number | null>(null);



const openDeleteModal = (student: any) => {
    selectedStudent.value = student;
    selectedPaymentId.value = student.id; 
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    if (!selectedPaymentId.value) return;
    await deletePayment(selectedPaymentId.value);
    students.value = await getAllStudents(); // Ro‘yxatni yangilash
    showDeleteModal.value = false;
};


</script>

<template>



    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Umumiy to'lov</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 p-2 gap-4 items-center justify-center ">

                <select v-model="selectedMonthFilter" class="bg-slate-900 text-white px-4 py-2  text-md rounded-md">
                    <option value="">Hammasi</option>
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>

                <div class="relative w-full">
                    <input v-model="searchQuery" type="text" placeholder="Ism bo‘yicha qidirish..."
                        class="w-full px-4 py-1.5 pl-10 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <!-- Qidiruv ikonkasi (absolute holatda) -->
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                </div>

            </div>


        </div>

        <div class="overflow-x-auto w-full">
            <table class="w-full min-w-max text-sm shadow-md sm:rounded-lg overflow-hidden text-left text-gray-500"
                style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
                <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="px-2 text-white py-3 md:px-6">O'quvchilar ma'lumotlari</th>
                        <th scope="col" class="px-1 text-white py-3">Guruh</th>
                        <th scope="col" class="px-1 text-white py-3">Oy</th>
                        <th scope="col" class="px-1 text-white py-3">Summa</th>
                        <th scope="col" class="px-1 text-white py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredStudents" :key="index"
                        class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                        <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                            <img class="w-14 h-14 rounded-full border border-white"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                alt="">
                            {{ item.student_name }}
                        </th>
                        <td class="px-1 py-4"> {{ item.group_name }}</td>
                        <td class="px-1 py-4"> {{ item.month }}</td>
                        <td class="px-1 py-4"> {{ item.total_amount }}</td>
                        <td class="px-1 py-4">
                            <img @click="openDeleteModal(item)" class="w-5" src="../../assets/icon/trash.svg" alt="">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-50">
            <div class="bg-slate-900 p-6 rounded-lg shadow-lg w-80">
                <h2 class="text-lg font-semibold text-white">To‘lovni o‘chirish</h2>
                <p class="text-white mt-2">
                    {{ selectedStudent ? selectedStudent.student_name : 'Tanlangan to‘lovni' }} o‘chirishni
                    tasdiqlaysizmi?
                </p>
                <div class="flex justify-end gap-3 mt-4">
                    <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">
                        Bekor qilish
                    </button>
                    <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg">
                        O‘chirish
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>
