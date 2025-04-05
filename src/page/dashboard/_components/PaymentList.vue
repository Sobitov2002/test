<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useDateStore } from '../store/index';
import api from '@/service/apiService';
import { FileQuestion, DollarSign, TrendingUp } from 'lucide-vue-next';

interface PaymentData {
    course_name: string;
    total_amount: number;
}

const date = useDateStore();
const paymentData = ref<PaymentData[] | null>(null);
const isLoading = ref(true);

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount);
};

const getTotalAmount = (): number => {
    if (!paymentData.value) return 0;
    return paymentData.value.reduce((sum, item) => sum + item.total_amount, 0);
};

watchEffect(async () => {
    if (!date.startDate || !date.endDate) return;

    isLoading.value = true;

    try {
        const response = await api.get(`/payment/statistics?year=${date.startDate}&month=${date.endDate}`);
        paymentData.value = response.data;
    } catch (error) {
        console.error("Xatolik:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-6 font-sans">
        <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">Kurs to'lovlari</h2>
            <div v-if="paymentData && paymentData.length"
                class="flex items-center bg-emerald-900/30 px-4 py-2 rounded-lg">
                <TrendingUp class="text-emerald-400 mr-2" size="18" />
                <span class="text-emerald-400 font-medium">Jami: {{ formatCurrency(getTotalAmount()) }}</span>
            </div>
        </div>

        <!-- Card container -->
        <div class="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <!-- Loading state -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
                <div class="relative w-16 h-16">
                    <div class="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                    <div class="absolute inset-3 rounded-full border-2 border-slate-700"></div>
                    <DollarSign class="absolute inset-0 m-auto text-emerald-500" size="24" />
                </div>
                <p class="mt-4 text-slate-400">Ma'lumotlar yuklanmoqda...</p>
            </div>

            <!-- Data table -->
            <div v-else-if="paymentData && paymentData.length">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-700">
                        <thead>
                            <tr class="bg-slate-900/50">
                                <th scope="col"
                                    class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Kurs nomi
                                </th>
                                <th scope="col"
                                    class="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Jami
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700/50 max-h-96 overflow-y-auto block">
                            <tr v-for="(item, index) in paymentData" :key="index"
                                class="hover:bg-slate-700/50 transition-colors duration-150">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {{ item.course_name }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-right font-medium font-mono text-emerald-400">
                                    {{ formatCurrency(item.total_amount) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else class="flex flex-col items-center justify-center py-16">
                <div class="relative mb-4">
                    <div class="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center">
                        <FileQuestion class="text-slate-500" size="40" />
                    </div>
                    <div
                        class="absolute -top-2 -right-2 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center animate-bounce">
                        <span class="text-slate-300 text-xs">?</span>
                    </div>
                </div>
                <h3 class="text-slate-300 font-medium text-lg mb-2">Ma'lumot topilmadi</h3>
                <p class="text-slate-400 text-sm max-w-md text-center">
                    Tanlangan sana oralig'ida hech qanday to'lov ma'lumotlari mavjud emas
                </p>
                <div class="mt-6 flex space-x-3">
                    <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
                    <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 600ms"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Custom scrollbar styling */
.max-h-96 {
    max-height: 24rem;
}

/* Make the table body scrollable while keeping the header fixed */
tbody.max-h-96 {
    display: block;
    overflow-y: auto;
}

thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background-color: rgba(15, 23, 42, 0.3);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(203, 213, 225, 0.5);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgba(148, 163, 184, 0.7);
}

/* Animations */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1.5s linear infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.5;
    }

    50% {
        opacity: 1;
    }
}

.animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

.animate-bounce {
    animation: bounce 1.5s infinite;
}
</style>