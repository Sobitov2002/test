<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
import { getMonthly } from "../servies"; // Backenddan ma'lumot olish

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const statistics = ref<{ course: string; students: number }[]>([]);

onMounted(async () => {
    try {
        const response = await getMonthly();
        statistics.value = response.statistics;
        console.log("Backenddan kelgan ma'lumot:", statistics.value);
    } catch (error) {
        console.error("Xatolik:", error);
    }
});


const labels = computed(() => statistics.value.map(stat => stat.course));

const salesData = computed(() => statistics.value.map(stat => stat.students));

// Chart.js uchun ma'lumot
const chartData = computed(() => ({
    labels: labels.value,
    datasets: [
        {
            label: "Talabalar soni",
            data: salesData.value, // Chiziqning balandligi
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4, // Chiziqni yumshoq qilish
            pointBackgroundColor: "white",
            pointBorderColor: "rgba(75, 192, 192, 1)",
            pointRadius: 5 // Nuqtalarni kattalashtirish
        }
    ]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Kurslar"
            }
        },
        y: {
            title: {
                display: true,
                text: "Talabalar soni"
            },
            beginAtZero: true
        }
    }
};
</script>

<template>
    <div class="w-full h-80 p-4 bg-[#060B28BD] rounded-lg text-white">
        <h2 class="text-xl font-bold text-center">Sales Overview</h2>
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
