<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchPayment } from '../servies';

ChartJS.register(ArcElement, Tooltip, Legend);

const peyment = ref<{ total_expense: number, year: number, month: number }>({
    total_expense: 0,
    year: 2025,
    month: 2
});

onMounted(async () => {
    try {
        const fetchedData = await fetchPayment();
        peyment.value = fetchedData;
    } catch (error) {
        console.error("Xatolik:", error);
    }
});

const maxValue = 100000; 
const percentValue = computed(() => Math.round((peyment.value.total_expense / maxValue) ));


const chartData = computed(() => ({
    labels: ['Foydalanilgan', 'Qolgan'],
    datasets: [
        {
            data: [percentValue.value, 100 - percentValue.value],
            backgroundColor: ['#0075FF', '#19274D'],
            cutout: '80%', 
        }
    ]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180, 
    plugins: {
        legend: {
            display: false
        }
    }
};
</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class="bg-gradient-to-b h-[300px]   rounded-xl p-6 w-72 mx-auto text-center text-white shadow-lg">
        <p class="text-lg font-semibold">Umumiy to'lov </p>
        <p class="text-sm opacity-70">Summasi (%)</p>

        <div class="relative w-full h-40">
            <Doughnut :data="chartData" :options="chartOptions" />

            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <span class="text-4xl"></span>
            </div>
        </div>


        <div class="flex bg-[#060B28BD] p-4 rounded-2xl justify-between px-4 mt-[-10px]">
            <span class="text-xs">0%</span>
            <span class="text-2xl font-bold">{{ percentValue }}%</span>
            <span class="text-xs">100%</span>
        </div>
    </div>
</template>
