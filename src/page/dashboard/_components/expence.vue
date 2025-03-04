<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchExpence } from '../servies';

ChartJS.register(ArcElement, Tooltip, Legend);

const expence = ref([]); // Boshlang‘ich qiymatni bo‘sh massiv qilish

onMounted(async () => {
    try {
        const fetchedData = await fetchExpence();
        expence.value = fetchedData;
        console.log("chiqim:", expence.value);
    } catch (error) {
        console.error("Xatolik:", error);
    }
});

const maxValue = 1000000; 

const percentValue = computed(() => {
    if (expence.value.length === 0) return 0; 

    const usedAmount = expence.value[0]?.amount || 0; 
    return Math.round((usedAmount / maxValue) * 100); 
});

const chartData = computed(() => ({
    labels: ['Foydalanilgan', 'Qolgan'],
    datasets: [
        {
            data: [percentValue.value, 100 - percentValue.value],
            backgroundColor: ['#05CD99', '#19274D'],
            cutout: '80%',
            borderWidth: 0,
            hoverBorderWidth: 0,
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
    },
};
</script>

<template>
    <div
        class="bg-gradient-to-b from-[#060B28BD] to-[#1A1F37] h-[300px] rounded-xl p-6 w-[350px] mx-auto text-center text-white shadow-lg">
        <p class="text-lg font-semibold">Umumiy Chiqimlar</p>
        <p class="text-sm opacity-70">Summasi (%)</p>

        <div class="relative w-full h-40">
            <Doughnut :data="chartData" :options="chartOptions" />
            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <span class="text-2xl">{{ percentValue *100 }}so'm</span>
            </div>
        </div>

        <div class="flex bg-[#060B28BD] p-3  rounded-2xl justify-between px-4 ]">
            <span class="text-xs">0%</span>
            <span class="text-2xl font-bold">{{ percentValue }}%</span>
            <span class="text-xs">100%</span>
        </div>
    </div>
</template>
