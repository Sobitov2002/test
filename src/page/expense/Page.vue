<script setup lang="ts">
import { getAllExpence } from './service.ts'
import { ref, onMounted, computed } from 'vue'
import api from '@/service/apiService';

const expenses = ref<any[]>([]);
const selectedFilter = ref("");
const searchQuery = ref<string>('');
const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isLoading = ref(false);
const deletingExpenseId = ref<number | null>(null);

const newExpense = ref({
    date: "",
    amount: 0,
    description: "",
    category: "",
    payment_type: ""
});

onMounted(async () => {
    try {
        expenses.value = await getAllExpence();
    } catch (error) {
        console.log(error);
    }
});

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

const confirmDeleteExpense = (id: number) => {
    deletingExpenseId.value = id;
    isDeleteModalOpen.value = true;
};

const deleteExpense = async () => {
    if (deletingExpenseId.value === null) return;
    isLoading.value = true;
    try {
        await api.delete(`/expense/delete?ident=${deletingExpenseId.value}`);
        expenses.value = expenses.value.filter(expense => expense.id !== deletingExpenseId.value);
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    } finally {
        isLoading.value = false;
        isDeleteModalOpen.value = false;
    }
};

const addExpense = async () => {
    isLoading.value = true;
    try {
        const formattedExpense = {
            date: new Date(newExpense.value.date).toISOString().split('T')[0],
            amount: newExpense.value.amount,
            description: newExpense.value.description,
            category: newExpense.value.category,
            payment_type: newExpense.value.payment_type
        };
        await api.post('/expense/create', formattedExpense, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            }
        });
        expenses.value = await getAllExpence();
        isModalOpen.value = false;
    } catch (error) {
        console.error("Xatolik:", error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template >
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Xarajatlar</h3>
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


                <button @click="isModalOpen = true"
                    class="bg-blue-500 text-white px-4 py-2 rounded-md text-md w-full md:w-auto">+
                    Qo'shish
                </button>
            </div>

            <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-md w-96">
                    <h2 class="text-xl font-bold mb-4">Yangi xarajat qo'shish</h2>
                    <label class="block mb-2">Sana:</label>
                    <input v-model="newExpense.date" type="date" class="border p-2 w-full mb-2" />

                    <label class="block mb-2">Summa:</label>
                    <input v-model="newExpense.amount" type="number" class="border p-2 w-full mb-2" />

                    <label class="block mb-2">Tavsif:</label>
                    <input v-model="newExpense.description" type="text" class="border p-2 w-full mb-2" />

                    <label class="block mb-2">Ism-Familya:</label>
                    <input v-model="newExpense.category" type="text" class="border p-2 w-full mb-2" />

                    <label class="block mb-2">To'lov turi:</label>
                    <select v-model="newExpense.payment_type" class="border p-2 w-full mb-4">
                        <option value="click">Click</option>
                        <option value="cash">Cash</option>
                    </select>
                    <div class="flex  justify-end gap-2">
                        <button @click="isModalOpen = false" class="bg-gray-500 text-white px-4 py-2 rounded-md">Bekor
                            qilish</button>
                        <button @click="addExpense" :disabled="isLoading"
                            class="bg-blue-500  text-white px-4 py-2 rounded-md">Qo'shish</button>
                    </div>
                </div>
            </div>

            <div v-if="isDeleteModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-md w-96">
                    <h2 class="text-xl font-bold mb-4">Haqiqatan ham o‘chirmoqchimisiz?</h2>
                    <div class="flex justify-end gap-2">
                        <button @click="isDeleteModalOpen = false"
                            class="bg-gray-500 text-white px-4 py-2 rounded-md">Bekor qilish</button>
                        <button @click="deleteExpense"
                            class="bg-red-500 text-white px-4 py-2 rounded-md flex items-center" :disabled="isLoading">
                            <span v-if="isLoading" class="loader"></span>
                            Ha, o‘chirish
                        </button>
                    </div>
                </div>
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
                <tbody class="py-2">
                    <tr v-for="(item, index) in filteredExpenses" :key="index"
                        class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">

                        <th class="px-2 py-4 md:px-6 flex items-center gap-2 whitespace-nowrap">
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
                                <span @click="confirmDeleteExpense(item.id)" class="cursor-pointer">
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

<style scoped>
.loader {
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
