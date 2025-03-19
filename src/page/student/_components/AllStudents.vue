<script setup lang="ts">
import api from '@/service/apiService';
import { postStudent } from '../services';
import { onMounted, ref } from 'vue';

const students = ref()

const modalOpen = ref(false);
const selectedStudent = ref<any>(null);
const selectedMonth = ref<string>('');
const paymentAmount = ref<number | null>(null);
const paymentType = ref<string>('cash');
const paymentDate = ref<string>('');
const paymentSuccess = ref(false); // ✅ To'lov amalga oshirilganini ko'rsatish uchun

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const paymentTypes = ['cash', 'click'];

onMounted(async () => {
    try {
        const response = await api.get('/student/get_all_students', { withCredentials: true });
        students.value = response.data;
    } catch (error) {
        console.log(error);
    }
});

const openPaymentModal = (student: any) => {
    selectedStudent.value = student;
    modalOpen.value = true;
    paymentSuccess.value = false; // Modal ochilganda xabarni yashirish
};

const confirmPayment = async () => {
    if (!selectedStudent.value || !paymentAmount.value || !selectedMonth.value || !paymentDate.value) {
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
    };

    try {
        await postStudent(paymentData);
        console.log("Payment successfully submitted:", paymentData);

        // ✅ To'lov amalga oshirildi xabarini ko'rsatish
        paymentSuccess.value = true;

        // 1 sekund kutib, modalni yopish
        setTimeout(() => {
            modalOpen.value = false;
            paymentSuccess.value = false;

            // 🔄 Formani tozalash
            paymentAmount.value = null;
            selectedMonth.value = 'January';
            paymentType.value = 'cash';
            paymentDate.value = new Date().toISOString().split('T')[0];
        }, 1000);
    } catch (error) {
        console.error("To‘lovni yuborishda xatolik yuz berdi:", error);
    }
};
</script>

<template>
    <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
        <div class="bg-slate-900 rounded-lg shadow-lg w-96 p-6">
            <h2 class="text-lg font-semibold text-gray-300">To'lov oynasi</h2>

            <p class="mt-2 text-gray-300">
                <strong>{{ selectedStudent?.full_name }}</strong> uchun oy tanlang:
            </p>

            <div v-if="paymentSuccess" class="text-green-400 text-center mt-2 font-bold">
                ✅ To'lov amalga oshirildi!
            </div>

            <div v-else>
                <div class="my-2 flex-col">
                    <label for="payment-amount" class="text-sm text-gray-500">To'lov qiymati:</label>
                    <input v-model="paymentAmount" type="number" id="payment-amount"
                        class="mt-2 w-full p-2 rounded bg-gray-700 text-white">
                </div>

                <label class="text-sm text-gray-500">Oyni tanlang:</label>
                <select v-model="selectedMonth" class="mt-2 w-full p-2 rounded bg-gray-700 text-white">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>

                <div class="my-2">
                    <label for="payment-type" class="text-sm text-gray-500">To'lov turi:</label>
                    <select v-model="paymentType" id="payment-type"
                        class="mt-2 w-full p-2 rounded bg-gray-700 text-white">
                        <option v-for="type in paymentTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                </div>

                <div class="my-2">
                    <label for="payment-date" class="text-sm text-gray-500">To'lov sanasi:</label>
                    <input v-model="paymentDate" type="date" id="payment-date"
                        class="mt-2 w-full p-2 rounded bg-gray-700 text-white">
                </div>
            </div>

            <div v-if="!paymentSuccess" class="mt-4 flex justify-end gap-3">
                <button @click="modalOpen = false"
                    class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                    Bekor qilish
                </button>
                <button @click="confirmPayment" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                    Tasdiqlash
                </button>
            </div>
        </div>
    </div>

    <table class="w-full text-sm shadow-md sm:rounded-lg overflow-hidden text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase">
            <tr>
                <th class="px-2 text-white py-3">O'qituvchilar</th>
                <th class="px-1 text-white py-3">Telefon raqami</th>
                <th class="px-1 text-white py-3">Email</th>
                <th class="px-0 text-white py-3 max-md:hidden">Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in students" :key="index"
                class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                    <img class="w-14 h-14 rounded-full border border-white"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                        alt=""> {{ item.full_name }}
                </th>
                <td class="px-1 py-4">+998 {{ item.phone_number }}</td>
                <td class="px-1 py-4">{{ item.started_date }}</td>
                <td class="px-0 py-4 max-md:hidden">
                    <button @click="openPaymentModal(item)"
                        class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                        To'lov qilish
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
