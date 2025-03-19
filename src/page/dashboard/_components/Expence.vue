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
    const response = await api.get(`/expense/get?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
    const data = response.data;

    // Naxt va Click to'lovlarini jamlash
    let cashAmount = 0;
    let clickAmount = 0;
    
    data.forEach((item: { amount: number; payment_type: string }) => {
      if (item.payment_type === 'cash') {
        cashAmount += item.amount;
      } else if (item.payment_type === 'click') {
        clickAmount += item.amount;
      }
    });

    // Jami to'lovni hisoblash
    totalAmount.value = cashAmount + clickAmount;

    // Diagramma uchun ma'lumotlar
    payments.value = [
      { name: 'Naxt', amount: cashAmount, color: '#06b853' },
      { name: 'Click', amount: clickAmount, color: '#0F172A' }
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
  <div class="p-6 bg-[#1E293B] rounded-lg shadow-md">
    <h2 class="text-lg font-semibold text-white">Xarajatlar</h2>
    <div class="h-[300px] w-full flex justify-center">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <!-- To'lovlar ro'yxati -->
    <div class="mt-4 space-y-2">
      <div
        v-for="(payment, index) in payments"
        :key="index"
        class="flex justify-between items-center p-3 rounded bg-green-100 text-green-700"
      >
        <span class="font-medium">{{ payment.name }}</span>
        <span class="font-bold">{{ payment.amount.toLocaleString() }} so'm</span>
      </div>
    </div>

    <!-- Jami to'lov -->
    <div class="mt-4 p-3 rounded bg-blue-100 text-blue-700 flex justify-between items-center">
      <span class="font-medium">Jami:</span>
      <span class="font-bold">{{ totalAmount.toLocaleString() }} so'm</span>
    </div>
  </div>
</template>
