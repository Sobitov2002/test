<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useDateStore } from '../store/index';
import api from '@/service/apiService';

interface PaymentData {
    course_name: string;
    total_amount: number;
}

const date = useDateStore();
const paymentData = ref<PaymentData[] | null>(null);
const isLoading = ref(true);

// Format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount);
};


watchEffect(async () => {
    if (!date.startDate || !date.endDate) return;

    isLoading.value = true;

    try {
        const response = await api.get(`/payment/statistics?start_date=${date.startDate}&end_date=${date.endDate}`);
        paymentData.value = response.data;

        // For demonstration, use mock data if API returns empty
        if (!response.data || response.data.length === 0) {
            paymentData.value = mockData;
        }
    } catch (error) {
        console.error("Xatolik:", error);
        // For demonstration, use mock data on error
        paymentData.value = mockData;
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div class="max-w-4xl mx-auto px-4 py-6 font-sans">


        <!-- Loading state -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
            <div class="w-8 h-8 border-2 border-slate-200 border-t-[#06b853] rounded-full animate-spin mb-4"></div>
            <p class="text-slate-500">Ma'lumot yuklanmoqda...</p>
        </div>

        <!-- Data table -->
        <div v-else-if="paymentData && paymentData.length" class="bg-slate-900 rounded-lg shadow overflow-hidden"> 
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-800">
                        <tr>
                            
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Kurs nomi
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                              
                            </th>
                            
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Jami
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-slate-800 divide-y divide-slate-200 max-h-96 overflow-y-auto block">
                        <tr v-for="item in paymentData" 
                            class=" transition-colors">
                            
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                                {{ item.course_name }}
                            </td>
                            
                           
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium font-mono text-white">
                                {{ formatCurrency(item.total_amount) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex justify-center py-12 text-slate-500">
            <p>Ma'lumot topilmadi</p>
        </div>
    </div>
</template>

<style>
/* Custom scrollbar styling */
.max-h-96 {
    max-height: 24rem;
    /* Approximately 4 rows */
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
    background:;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

/* Animation for spinner */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>