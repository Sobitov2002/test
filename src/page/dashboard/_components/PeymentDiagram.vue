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
      { name: 'Naxt', amount: data.cash_amount || 0, color: '#38bdf8' },
      { name: 'Click', amount: data.click_amount || 0, color: '#4ade80' }
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
      type: 'doughnut',
      data: {
        labels: payments.value.map(p => p.name),
        datasets: [{
          data: payments.value.map(p => p.amount),
          backgroundColor: payments.value.map(p => p.color),
          borderWidth: 0,
          borderRadius: 4,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                return `${value.toLocaleString()} so'm`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
};

onMounted(fetchPaymentStatistics);
watch(() => [dateStore.startDate, dateStore.endDate], fetchPaymentStatistics, { deep: true });
</script>

<template>
  <div class="bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div class="p-5">
      <h2 class="text-xl font-semibold text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-400">
          <circle cx="12" cy="12" r="10" />
          <polyline points="8 12 12 16 16 12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </svg>
        Tushumlar
      </h2>

      <div class="mt-4 grid md:grid-cols-1 gap-6 items-center">
        <div class="relative h-[300px] flex items-center justify-center">
          <canvas ref="chartCanvas" class="h-[240px]"></canvas>
          <div class="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span class="text-sm text-slate-400">Jami</span>
            <span class="text-2xl font-bold text-white">{{ totalAmount.toLocaleString() }}</span>
            <span class="text-xs text-slate-400">so'm</span>
          </div>
        </div>

        <div class="space-y-3">
          <div v-for="(payment, index) in payments" :key="index"
            class="bg-slate-800 rounded-lg p-4 transition-all duration-200 hover:bg-slate-700/50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: payment.color }"></div>
                <span class="font-medium text-white">{{ payment.name }}</span>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-bold text-white">{{ payment.amount.toLocaleString() }}</span>
                <span class="text-xs text-slate-400">so'm</span>
              </div>
            </div>
            <div class="mt-2 w-full bg-slate-700 rounded-full h-1.5">
              <div class="h-1.5 rounded-full" :style="{
                width: totalAmount ? `${(payment.amount / totalAmount * 100)}%` : '0%',
                backgroundColor: payment.color
              }"></div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-lg p-4 mt-4 border-t border-slate-600">
            <div class="flex justify-between items-center">
              <span class="font-medium text-white">Jami:</span>
              <div class="flex flex-col items-end">
                <span class="font-bold text-white">{{ totalAmount.toLocaleString() }}</span>
                <span class="text-xs text-slate-400">so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>