<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';

Chart.register(...registerables);

const dateStore = useDateStore();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const payments = ref<{ name: string; amount: number; color: string }[]>([]);
const totalAmount = ref(0);
let chartInstance: Chart | null = null;

const fetchPaymentStatistics = async () => {
  if (!dateStore.startDate || !dateStore.endDate) return;

  try {
    const response = await api.get(`/payment/statistics?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
    const data = response.data[0];


    totalAmount.value = data.total_amount || 0;

    payments.value = [
      { name: 'Naxt', amount: data.cash_amount || 0, color: '#00ff71' },
      { name: 'Click', amount: data.click_amount || 0, color: '#00985b' }
    ];

    updateChart();
  } catch (error) {
    console.error("To'lov statistikalarini olishda xato:", error);
  }
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'pie',
      data: {
        labels: payments.value.map(p => p.name),
        datasets: [{
          data: payments.value.map(p => p.amount),
          backgroundColor: payments.value.map(p => p.color)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
};

onMounted(fetchPaymentStatistics);
watch(() => [dateStore.startDate, dateStore.endDate], fetchPaymentStatistics, { deep: true });
</script>

<template>
  <div class="px-4 py-2 bg-[#1E293B] rounded-lg shadow-md grid grid-cols-2 items- ">
    <div>
      <h2 class="text-lg font-semibold text-white">Tushumlar</h2>
      <div class="h-[300px] w-full flex justify-center">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <div class="  items-center">
      <!-- To'lovlar ro'yxati -->
      <div class="mt-4 space-y-2 ">
        <div v-for="(payment, index) in payments" :key="index"
          class="flex justify-between items-center p-1 rounded bg-[#0F172A] text-green-700">
          <span class="font-medium text-sm">{{ payment.name }}</span>
          <span class="font-bold text-sm">{{ payment.amount.toLocaleString() }} so'm</span>
        </div>
        <div class="mt-4 p-1 rounded bg-[#0F172A] text-white flex justify-between items-center">
          <span class="font-medium">Jami:</span>
          <span class="font-bold text-sm ">{{ totalAmount.toLocaleString() }} so'm</span>
        </div>
      </div>
    </div>
  </div>
</template>
