<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';
import { ArrowUpCircle, Wallet, CreditCard, Loader2 } from 'lucide-vue-next';

Chart.register(...registerables);

const dateStore = useDateStore();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const payments = ref<{ name: string; amount: number; color: string; icon: string }[]>([]);
const totalAmount = ref(0);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
let chartInstance: Chart | null = null;

const fetchPaymentStatistics = async () => {
  if (!dateStore.startDate || !dateStore.endDate) return;

  isLoading.value = true;
  hasError.value = false;

  try {
    const response = await api.get(`/payment/statistics?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
    const data = response.data[0];

    totalAmount.value = data.total_amount || 0;
    payments.value = [
      { name: 'Naxt', amount: data.cash_amount || 0, color: '#10B981', icon: 'wallet' },
      { name: 'Click', amount: data.click_amount || 0, color: '#3B82F6', icon: 'credit-card' }
    ];

    updateChart();
  } catch (error) {
    console.error("To'lov statistikalarini olishda xato:", error);
    hasError.value = true;
    errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi";
  } finally {
    isLoading.value = false;
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
        cutout: '69%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${value.toLocaleString()} so'm`;
              }
            }
          }
        },
        animation: { animateScale: true, animateRotate: true }
      }
    });
  }
};

const getIcon = (iconName: string) => {
  return iconName === 'wallet' ? Wallet : CreditCard;
};

onMounted(fetchPaymentStatistics);
watch(() => [dateStore.startDate, dateStore.endDate], fetchPaymentStatistics, { deep: true });
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-white flex items-center gap-2 pb-5">
        <ArrowUpCircle class="text-emerald-500" :size="20" />
        Tushumlar statistikasi
      </h2>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-[240px]">
      <Loader2 class="animate-spin text-blue-400" :size="40" />

    </div>

    <div v-if="hasError" class="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4 flex items-center">
      <span class="mr-2">⚠️</span>
      {{ errorMessage }}
    </div>

    <div class="flex flex-col  gap-6">
      <div class="relative flex-1 h-[200px] ">
        <canvas ref="chartCanvas"></canvas>
        <div v-if="!isLoading && totalAmount > 0"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div class="text-sm text-slate-400">Jami</div>
          <div class="text-xl font-bold text-white">{{ totalAmount.toLocaleString() }}</div>
          <div class="text-xs text-slate-400">so'm</div>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <div v-if="payments.length === 0 && !isLoading" class="text-slate-400 text-center py-8">
          Ma'lumot topilmadi
        </div>

        <div v-else class="space-y-4">
          <div v-for="(payment, index) in payments" :key="index"
            class="bg-slate-800/50 backdrop-blur rounded-lg p-4 transition-all duration-300 hover:bg-slate-700/50 group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" :style="{ backgroundColor: payment.color + '20' }">
                  <component :is="getIcon(payment.icon)" class="text-white" :size="20" />
                </div>
                <div>
                  <div class="font-medium text-white">{{ payment.name }}</div>
                  <div class="text-xs text-slate-400">{{ ((payment.amount / totalAmount) * 100).toFixed(1) }}% of total
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-white">{{ payment.amount.toLocaleString() }}</div>
                <div class="text-xs text-slate-400">so'm</div>
              </div>
            </div>

            <div class="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110"
                :style="{ width: `${((payment.amount / totalAmount) * 100).toFixed(1)}%`, backgroundColor: payment.color }">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div class="flex justify-between items-center">
            <div class="font-medium text-slate-300">Jami tushumlar:</div>
            <div class="font-bold text-xl text-white">
              {{ totalAmount.toLocaleString() }} <span class="text-sm font-normal text-slate-400">so'm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
