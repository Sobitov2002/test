<script setup lang="ts">
import { getAllExpence } from './service.ts'
import { ref, onMounted, computed } from 'vue'
import api from '@/service/apiService';


interface Expense {
    id: number;
    amount: number;
    category: string;
    date: string;
    payment_type: string;
    description: string;
}

interface MonthOption {
    value: string;
    label: string;
}

// State variables
const expenses = ref<Expense[]>([]);
const selectedFilter = ref<string>("");
const searchQuery = ref<string>('');
const isModalOpen = ref<boolean>(false);
const isDeleteModalOpen = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const deletingExpenseId = ref<number | null>(null);

// Month and year filter state
const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0'); 
const currentYear = new Date().getFullYear().toString();
const selectedMonth = ref<string>(currentMonth);
const selectedYear = ref<string>(currentYear); 

const months: MonthOption[] = [
    { value: currentMonth, label: "Oy" },
    { value: "01", label: "Yanvar" },
    { value: "02", label: "Fevral" },
    { value: "03", label: "Mart" },
    { value: "04", label: "Aprel" },
    { value: "05", label: "May" },
    { value: "06", label: "Iyun" },
    { value: "07", label: "Iyul" },
    { value: "08", label: "Avgust" },
    { value: "09", label: "Sentabr" },
    { value: "10", label: "Oktabr" },
    { value: "11", label: "Noyabr" },
    { value: "12", label: "Dekabr" }
];

// Generate year options (current year and 5 years back)
const years = computed(() => {
    const yearOptions = [{ value: "", label: "Yil" }];
    for (let i = 0; i < 6; i++) {
        const year = parseInt(currentYear) - i;
        yearOptions.push({ value: year.toString(), label: year.toString() });
    }
    return yearOptions;
});

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

        // Month filter
        let matchesMonth = true;
        if (selectedMonth.value && expense.date) {
            const expenseDate = new Date(expense.date);
            const expenseMonth = String(expenseDate.getMonth() + 1).padStart(2, '0');
            matchesMonth = expenseMonth === selectedMonth.value;
        }

        // Year filter
        let matchesYear = true;
        if (selectedYear.value && expense.date) {
            const expenseDate = new Date(expense.date);
            const expenseYear = expenseDate.getFullYear().toString();
            matchesYear = expenseYear === selectedYear.value;
        }

        return matchesCategory && matchesPaymentType && matchesMonth && matchesYear;
    });
});

const confirmDeleteExpense = (id: number): void => {
    deletingExpenseId.value = id;
    isDeleteModalOpen.value = true;
};

const deleteExpense = async (): Promise<void> => {
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

const addExpense = async (): Promise<void> => {
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
    <div class="min-h-screen bg-gradient-to-br text-white p-4 md:p-6">
        <div class="">
            <!-- Header Section -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3
                        class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Xarajatlar
                    </h3>

                    <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <!-- Payment Type Filter -->
                        <select
                            class="bg-slate-700/70 border border-slate-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 w-full md:w-auto"
                            v-model="selectedFilter">
                            <option value="">To'lov turi</option>
                            <option value="click">Click</option>
                            <option value="cash">Cash</option>
                        </select>

                       
                        <select
                            class="bg-slate-700/70 border border-slate-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 w-full md:w-auto"
                            v-model="selectedMonth">
                            <option v-for="month in months" :key="month.value" :value="month.value">
                                {{ month.label }}
                            </option>
                        </select>

                        <!-- Year Filter -->
                        <select
                            class="bg-slate-700/70 border border-slate-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 w-full md:w-auto"
                            v-model="selectedYear">
                            <option v-for="year in years" :key="year.value" :value="year.value">
                                {{ year.label }}
                            </option>
                        </select>

                        
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

                <!-- Active Filters Display -->
                <div v-if="selectedFilter || selectedMonth || selectedYear || searchQuery"
                    class="flex flex-wrap gap-2 mt-4">
                    <div v-if="selectedFilter"
                        class="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span>{{ selectedFilter }}</span>
                    </div>
                    <div v-if="selectedMonth"
                        class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span>{{months.find(m => m.value === selectedMonth)?.label}}</span>
                    </div>
                    <div v-if="selectedYear"
                        class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span>{{ selectedYear }}</span>
                    </div>
                    <div v-if="searchQuery"
                        class="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <span>"{{ searchQuery }}"</span>
                    </div>
                </div>
            </div>

            <!-- Expense Card Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Dynamic Expense Cards -->
                <div v-for="(item, index) in filteredExpenses" :key="index"
                    class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex items-center gap-3">
                                <div class="bg-indigo-500/20 p-3 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-white">{{ item.category }}</h4>
                                    <p class="text-sm text-slate-400">{{ item.date }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="h-2.5 w-2.5 rounded-full"
                                    :class="item.payment_type === 'click' ? 'bg-purple-500' : 'bg-emerald-500'">
                                </div>
                                <span class="text-sm text-slate-300">{{ item.payment_type }}</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <p class="text-sm text-slate-300">{{ item.description }}</p>
                        </div>

                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-xs text-slate-400">Summa</p>
                                <p class="text-xl font-bold text-white">{{ item.amount.toLocaleString() }}</p>
                            </div>
                            <button @click="confirmDeleteExpense(item.id)"
                                class="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-full transition-colors duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="filteredExpenses.length === 0" class="col-span-full">
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-4 text-slate-500 mx-auto"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p class="text-lg font-medium text-white">Hech qanday ma'lumot topilmadi</p>
                        <p class="mt-1 text-slate-400">Yangi xarajat qo'shish uchun "Qo'shish" tugmasini bosing</p>
                    </div>
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