<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PageContainer from '@/components/ui/PageContainer.vue';
import { getAllStudents ,postStudent } from './services.ts';

const students = ref<any[]>([]);
const modalOpen = ref(false);
const selectedStudent = ref<any>(null);
const selectedMonth = ref<string>('');
const paymentAmount = ref<number | null>(null);
const paymentType = ref<string>('cash');
const paymentDate = ref<string>('');

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

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

        // Formani tozalash
        paymentAmount.value = null;
        selectedMonth.value = 'January';
        paymentType.value = 'cash';
        paymentDate.value = new Date().toISOString().split('T')[0];

        modalOpen.value = false;
    } catch (error) {
        console.error("To‘lovni yuborishda xatolik yuz berdi:", error);
    }
};





</script>

<template>
    <PageContainer title="To'lovlar">
        <div v-if="modalOpen" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div class="bg-slate-900 rounded-lg shadow-lg w-96 p-6">
                <h2 class="text-lg font-semibold text-gray-300">To'lov oynasi</h2>
                <p class="mt-2 text-gray-300">
                    <strong>{{ selectedStudent?.full_name }}</strong> uchun oy tanlang:
                </p>
                <div class="my-2 flex-col">
                    <label for="payment-amount" class="text-sm text-gray-500">To'lov qiymati:</label>
                    <input v-model="paymentAmount" type="number" id="payment-amount"
                        class="mt-2 w-full p-2 rounded bg-gray-700 text-white">
                </div>
                <label  class="text-sm text-gray-500">Oyni tanlang:</label>
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
                <div class="mt-4 flex justify-end gap-3">
                    <button @click="modalOpen = false"
                        class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                        Bekor qilish
                    </button>
                    <button @click="confirmPayment"
                        class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                        Tasdiqlash
                    </button>
                </div>
            </div>
        </div>

        <table
            class="w-full max-xl:min-w-[550px] text-sm shadow-md sm:rounded-lg overflow-hidden text-left rtl:text-right text-gray-500"
            style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
            <thead class="text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" class="px-2 text-white py-3 md:px-6">O'quvchilar ma'lumotlari</th>
                    <th scope="col" class="px-1 text-white py-3">Telefon</th>
                    <th scope="col" class="px-1 text-white py-3">To'lov</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students" :key="index"
                    class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                    <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                        <img class="w-14 h-14 rounded-[50%] border border-white"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                            alt=""> {{ item.full_name }}
                    </th>
                    <td class="px-1 py-4">+998 {{ item.phone_number }}</td>
                    <td class="px-1 py-4">
                        <button @click="openPaymentModal(item)"
                            class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                            To'lov qilish
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </PageContainer>
</template>
