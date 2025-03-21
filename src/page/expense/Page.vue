<script setup lang="ts">
import { getAllExpence } from './service.ts'
import { ref , onMounted , computed } from 'vue'
import api from '@/service/apiService';


const expenses = ref<any[]>([]);
const selectedFilter = ref("");
const searchQuery = ref<string>('');
onMounted(async () =>{
    try {
        expenses.value = await getAllExpence();
        console.log(expenses.value);
        
    } catch (error) {
        console.log(error);
    }
})

const filteredExpenses = computed(() => {
    return expenses.value.filter(expense => {
        const matchesCategory = searchQuery.value
            ? expense.category.toLowerCase().includes(searchQuery.value.toLowerCase())
            : true;

        const matchesPaymentType = selectedFilter.value
            ? expense.payment_type === selectedFilter.value
            : true;

        return matchesCategory && matchesPaymentType;
    });
});
const deleteExpense = async (id: number) => {
    try {
        await api.delete(`/expense/delete?ident=${id}`);
        console.log("O'chirildi", id);
        expenses.value = expenses.value.filter(expense => expense.id !== id);
        return getAllExpence()
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};



</script>

<template >
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Xarajatlar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha xarajatlar</p>
            </div>
            <div class="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <!-- Filter -->
                <select class="bg-slate-900 text-white p-2 py-3 text-md rounded-md w-full md:w-auto"
                    v-model="selectedFilter">
                    <option value="">Hammasi</option>
                    <option value="click">Click</option>
                    <option value="cash">Cash</option>
                </select>

                <!-- Search -->
                <div class="relative w-full md:w-auto">
                    <input v-model="searchQuery" type="text" placeholder="Ism bo‘yicha qidirish..."
                        class="w-full px-4 py-1.5 pl-10 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <!-- Qidiruv ikonkasi -->
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                    </svg>
                </div>

                <!-- Qo'shish tugmasi -->
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-md w-full md:w-auto">+
                    Qo'shish
                </button>
            </div>


        </div>
        <div class="overflow-x-auto w-full">
            <table
                style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                class="w-full min-w-full text-sm shadow-md sm:rounded-lg text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="px-2 text-white py-3 md:px-6">
                            O'qituvchilar ma'lumotlari
                        </th>
                        <th scope="col" class="px-1 text-white py-3">Sana</th>
                        <th scope="col" class="px-1 text-white py-3">Summa</th>
                        <th scope="col" class="px-0 text-white py-3 max-md:hidden">To'lov turi</th>
                        <th scope="col" class="px-2 text-white py-3 w-[80px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredExpenses" :key="index"
                        class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">

                        <th class="px-2 py-2 md:px-6 flex items-center gap-2 whitespace-nowrap">
                            <img class="w-10 h-10 rounded-full border border-white"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                alt="">
                            {{ item.category }}
                        </th>

                        <td class="px-1 py-4 whitespace-nowrap"> {{ item.date }} </td>
                        <td class="px-1 py-4 whitespace-nowrap"> {{ item.amount }} </td>

                        <!-- To'lov turi faqat katta ekran uchun -->
                        <td class="px-0 py-4 max-md:hidden whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                {{ item.payment_type }}
                            </div>
                        </td>

                        <td class="px-2 py-4 whitespace-nowrap">
                            <div class="flex gap-3 h-[18px]">
                                <span @click="deleteExpense(item.id)" class="cursor-pointer">
                                    <img src="../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5">
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
