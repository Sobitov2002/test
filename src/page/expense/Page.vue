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
        // Reset form
        newExpense.value = {
            date: "",
            amount: 0,
            description: "",
            category: "",
            payment_type: ""
        };
    } catch (error) {
        console.error("Xatolik:", error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header Section -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3
                        class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Xarajatlar
                    </h3>

                    <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <!-- Filter -->
                        <select
                            class="bg-slate-700/70 border border-slate-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 w-full md:w-auto"
                            v-model="selectedFilter">
                            <option value="">Hammasi</option>
                            <option value="click">Click</option>
                            <option value="cash">Cash</option>
                        </select>

                        <!-- Search -->
                        <div class="relative w-full md:w-auto">
                            <input v-model="searchQuery" type="text" placeholder="Ism bo'yicha qidirish..."
                                class="w-full md:w-64 px-4 py-2.5 pl-10 rounded-lg bg-slate-700/70 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                            </svg>
                        </div>

                        <!-- Add Button -->
                        <button @click="isModalOpen = true"
                            class="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            Qo'shish
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
                <div class="overflow-x-auto w-full">
                    <table class="w-full min-w-full text-sm text-left">
                        <thead class="text-xs uppercase bg-slate-700/70 text-slate-300">
                            <tr>
                                <th scope="col" class="px-6 py-4 font-medium">
                                    O'qituvchilar ma'lumotlari
                                </th>
                                <th scope="col" class="px-6 py-4 font-medium">Sana</th>
                                <th scope="col" class="px-6 py-4 font-medium">Summa</th>
                                <th scope="col" class="px-6 py-4 font-medium max-md:hidden">To'lov turi</th>
                                <th scope="col" class="px-6 py-4 font-medium w-[100px] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredExpenses" :key="index"
                                class="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200">
                                <th class="px-6 py-4 flex items-center gap-3 whitespace-nowrap font-medium">
                                    <div class="relative">
                                        <img class="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH87TKQrWcl19xly2VNs0CjBzy8eaKNM-ZpA&s"
                                            alt="">
                                        <div
                                            class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-800">
                                        </div>
                                    </div>
                                    <span>{{ item.category }}</span>
                                </th>
                                <td class="px-6 py-4 whitespace-nowrap">{{ item.date }}</td>
                                <td class="px-6 py-4 whitespace-nowrap font-medium">
                                    <span class="bg-indigo-500/20 text-indigo-300 py-1 px-3 rounded-full">
                                        {{ item.amount }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 max-md:hidden whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="h-2.5 w-2.5 rounded-full"
                                            :class="item.payment_type === 'click' ? 'bg-purple-500' : 'bg-emerald-500'">
                                        </div>
                                        <span class="ml-2">{{ item.payment_type }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <button @click="confirmDeleteExpense(item.id)"
                                        class="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-full transition-colors duration-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>

                            <!-- Empty state -->
                            <tr v-if="filteredExpenses.length === 0">
                                <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                                    <div class="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-slate-500"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p class="text-lg font-medium">Hech qanday ma'lumot topilmadi</p>
                                        <p class="mt-1">Yangi xarajat qo'shish uchun "Qo'shish" tugmasini bosing</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Expense Modal -->
        <div v-if="isModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50"
            @click.self="isModalOpen = false">
            <div
                class="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 transform transition-all duration-300 scale-100">
                <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Yangi xarajat qo'shish
                </h2>

                <div class="space-y-4">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-slate-300">Sana:</label>
                        <input v-model="newExpense.date" type="date"
                            class="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-slate-300">Summa:</label>
                        <input v-model="newExpense.amount" type="number"
                            class="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-slate-300">Tavsif:</label>
                        <input v-model="newExpense.description" type="text"
                            class="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-slate-300">Ism-Familya:</label>
                        <input v-model="newExpense.category" type="text"
                            class="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200" />
                    </div>

                    <div>
                        <label class="block mb-2 text-sm font-medium text-slate-300">To'lov turi:</label>
                        <select v-model="newExpense.payment_type"
                            class="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                            <option value="click">Click</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button @click="isModalOpen = false"
                        class="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors duration-200">
                        Bekor qilish
                    </button>
                    <button @click="addExpense" :disabled="isLoading"
                        class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center">
                        <span v-if="isLoading" class="loader mr-2"></span>
                        Qo'shish
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="isDeleteModalOpen"
            class="fixed inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50"
            @click.self="isDeleteModalOpen = false">
            <div
                class="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 transform transition-all duration-300 scale-100">
                <div class="text-center mb-6">
                    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-white">Haqiqatan ham o'chirmoqchimisiz?</h2>
                    <p class="mt-2 text-slate-400">Bu amalni qaytarib bo'lmaydi.</p>
                </div>

                <div class="flex justify-center gap-3">
                    <button @click="isDeleteModalOpen = false"
                        class="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors duration-200">
                        Bekor qilish
                    </button>
                    <button @click="deleteExpense" :disabled="isLoading"
                        class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center">
                        <span v-if="isLoading" class="loader mr-2"></span>
                        Ha, o'chirish
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loader {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Smooth transitions */
.scale-100 {
    animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>