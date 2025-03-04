<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { fetchPayment } from '../servies';

// To'lov ma'lumotlari uchun reaktiv obyekt
const peyment = ref<{ total_expense: number, year: number, month: number }>({
    total_expense: 0,
    year: 2025,
    month: 2
});

onMounted(async () => {
    try {
        const fetchedData = await fetchPayment();
        peyment.value = fetchedData;
        console.log("Fetched Payment:", peyment.value);
    } catch (error) {
        console.log("Xatolik:", error);
    }
});

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// **Computed orqali dinamik diagramma**
const chartData = computed(() => {
    const totalIncome = peyment.value.total_expense; // Umumiy kirim
    const totalOutcome = totalIncome * 0.3; // Masalan, chiqimni 30% deb oldik

    return {
        labels: ['Barcha kirim', 'Barcha chiqim'],
        datasets: [
            {
                label: 'Mablag‘',
                backgroundColor: ['#0075FF', '#fff'],
                data: [totalIncome - totalOutcome, totalOutcome], // Ikkisini bo‘lib chiqamiz
            },
        ],
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: 'white', // Matn rangi oq
                font: {
                    size: 16, // Matn kattaroq
                },
            },
        },
    },
};
</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <Pie class="h-[200px]" :data="chartData" :options="chartOptions" />
    </div>
</template>
