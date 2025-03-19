<script setup lang="ts">
import { ref, onMounted , computed } from 'vue';
import PageContainer from '@/components/ui/PageContainer.vue';
import { getAllStudents ,postStudent } from './services.ts';

const students = ref<any[]>([]);
const modalOpen = ref(false);
const selectedStudent = ref<any>(null);
const selectedMonth = ref<string>('');
const paymentAmount = ref<number | null>(null);
const paymentType = ref<string>('cash');
const paymentDate = ref<string>('');
const searchQuery = ref<string>('');

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

const filteredStudents = computed(() => {
    if (!searchQuery.value) {
        return students.value; 
    }
    return students.value.filter(student =>
        student.student_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

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
    
       
    
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Xarajatlar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha xarajatlar</p>
            </div>
            <div class="flex gap-2 items-center justify-center">
                <select class="bg-slate-900 text-white p-2 py-3 text-md rounded-md">
                    <option value="">Hammasi</option>
                    <option value="click">Click</option>
                    <option value="cash">Cash</option>
                </select>
                <div class="">
            <input v-model="searchQuery" type="text" placeholder="Ism bo‘yicha qidirish..."
                class="w-full p-2 border border-gray-300 rounded-xl bg-gray-700 text-white" />
                </div>
            </div>
            

        </div>
           
        <table
            class="w-full max-xl:min-w-[550px] text-sm shadow-md sm:rounded-lg overflow-hidden text-left rtl:text-right text-gray-500"
            style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
            <thead class="text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" class="px-2 text-white py-3 md:px-6">O'quvchilar ma'lumotlari</th>
                    <th scope="col" class="px-1 text-white py-3">Guruh</th>
                    <th scope="col" class="px-1 text-white py-3">Oy</th>
                    <th scope="col" class="px-1 text-white py-3">To'lov</th>
                    <th scope="col" class="px-1 text-white py-3">Summa</th>
                </tr>
            </thead>
            <tbody>
                <tr   v-for="(item, index) in filteredStudents" :key="index"
                    class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">
                    <th class="px-2 py-2 md:px-6 flex items-center gap-2">
                        <img class="w-14 h-14 rounded-[50%] border border-white"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                            alt=""> {{ item.student_name }}
                    </th>
                    <td class="px-1 py-4"> {{ item.group_name }}</td>
                    <td class="px-1 py-4"> {{ item.month }}</td>
                    <td class="px-1 py-4">
                       
                    </td>
                    <td class="px-1 py-4"> {{ item.total_amount }}</td>

                </tr>
            </tbody>
        </table>
    </div>

</template>
