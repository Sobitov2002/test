<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';
import { ArrowUpCircle, Wallet, CreditCard, DollarSign, Loader2, FileQuestion, AlertCircle } from 'lucide-vue-next';

Chart.register(...registerables);

const dateStore = useDateStore();
const chartCanvas = ref(null);
const payments = ref([]);
const totalAmount = ref(0);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
let chartInstance = null;

// Improved empty state check to consider total amount as well
const isEmpty = computed(() =>
  !isLoading.value &&
  !hasError.value &&
  (payments.value.length === 0 || totalAmount.value === 0)
);

const percentages = computed(() => {
  if (totalAmount.value === 0) return payments.value.map(() => 0);
  return payments.value.map(payment =>
    ((payment.amount / totalAmount.value) * 100).toFixed(1)
  );
});
const fetchPaymentStatistics = async () => {
  if (!dateStore.startDate || !dateStore.endDate) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await api.get(`/payment/monthly_sum?year=${dateStore.startDate}&month=${dateStore.endDate}`);

    const data = response.data;
    console.log("Response Data:", data);

    // Assign the values from the API response
    let cashAmount = data.cash_payment || 0;
    let clickAmount = data.click_payment || 0;
    totalAmount.value = data.total_expense || 0;

    // Calculate total
    totalAmount.value = data.total_expense || 0;

    // Prepare the payments array
    payments.value = [
      {
        name: 'Naxt',
        amount: cashAmount,
        color: '#10B981',
        icon: 'wallet'
      },
      {
        name: 'Click',
        amount: clickAmount,
        color: '#3B82F6',
        icon: 'credit-card'
      }
    ];

    // Update the chart if there is data
    if (totalAmount.value > 0) {
      updateChart();
    }
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    hasError.value = true;
    errorMessage.value = 'Xarajatlarni olishda xatolik yuz berdi';
  } finally {
    isLoading.value = false;
  }
};

const updateChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');

    // Create gradient fills
    const gradients = payments.value.map(payment => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, payment.color);
      gradient.addColorStop(1, payment.color + '80'); // Add transparency
      return gradient;
    });

    chartInstance = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: payments.value.map(p => p.name),
        datasets: [{
          data: payments.value.map(p => p.amount),
          backgroundColor: payments.value.map(p => p.color),
          borderColor: 'transparent',
          borderWidth: 0,
          hoverOffset: 15,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '69%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const percentage = ((value / totalAmount.value) * 100).toFixed(1);
                return `${value.toLocaleString()} so'm (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'wallet': return Wallet;
    case 'credit-card': return CreditCard;
    default: return DollarSign;
  }
};

onMounted(fetchPaymentStatistics);
watch(() => [dateStore.startDate, dateStore.endDate], fetchPaymentStatistics, { deep: true });
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white flex items-center pb-5 gap-2">
        <ArrowUpCircle class="text-emerald-500" size="20" />
        Xarajatlar statistikasi
      </h2>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-[240px]">
      <Loader2 class="animate-spin text-blue-400 mb-3" size="40" />
      <p class="text-slate-400">Yuklanmoqda...</p>
    </div>

    <!-- Error state with animation -->
    <div v-else-if="hasError" class="flex flex-col items-center justify-center h-[240px]">
      <div class="bg-red-900/30 text-red-300 p-6 rounded-lg flex flex-col items-center animate-pulse">
        <AlertCircle class="text-red-400 mb-3" size="40" />
        <p class="font-medium mb-1">Xatolik yuz berdi</p>
        <p class="text-sm">{{ errorMessage }}</p>
        <button @click="fetchPaymentStatistics"
          class="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors">
          Qayta urinish
        </button>
      </div>
    </div>

    <!-- Empty state with animation -->
    <div v-else-if="isEmpty" class="flex flex-col items-center justify-center h-[240px]">
      <div class="relative">
        <FileQuestion class="text-slate-600 mb-4" size="60" />
        <div
          class="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center animate-bounce">
          <span class="text-slate-300 text-xs">?</span>
        </div>
      </div>
      <p class="text-slate-300 font-medium mb-2">Ma'lumot topilmadi</p>
      <p class="text-slate-400 text-sm max-w-md text-center">
        Tanlangan sana oralig'ida hech qanday xarajat ma'lumotlari mavjud emas
      </p>
      <div class="mt-6 flex space-x-3">
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 600ms"></div>
      </div>
    </div>

    <!-- Chart and summary -->
    <div v-if="!isEmpty" class="flex flex-col  gap-6">
      <!-- Chart section -->
      <div class="relative flex-1 h-[200px]">
        <canvas ref="chartCanvas"></canvas>
        <!-- Center total -->
        <div v-if="totalAmount > 0"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div class="text-sm text-slate-400">Jami</div>
          <div class="text-xl font-bold text-white">{{ totalAmount.toLocaleString() }}</div>
          <div class="text-xs text-slate-400">so'm</div>
        </div>
      </div>

      <!-- Payment details -->
      <div v-if="totalAmount > 0" class="flex-1 flex flex-col justify-center">
        <div class="space-y-4">
          <div v-for="(payment, index) in payments" :key="index"
            class="bg-slate-800/50 backdrop-blur rounded-lg p-4 transition-all duration-300 hover:bg-slate-700/50 group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" :style="{ backgroundColor: payment.color + '20' }">
                  <component :is="getIcon(payment.icon)" :class="`text-${payment.color}`" size="20" />
                </div>
                <div>
                  <div class="font-medium text-white">{{ payment.name }}</div>
                  <div class="text-xs text-slate-400">{{ percentages[index] }}% of total</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-white">{{ payment.amount.toLocaleString() }}</div>
                <div class="text-xs text-slate-400">so'm</div>
              </div>
            </div>

            <!-- Progress bar with animation -->
            <div class="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110"
                :style="{ width: `${percentages[index]}%`, backgroundColor: payment.color }"></div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div class="flex justify-between items-center">
            <div class="font-medium text-slate-300">Jami xarajatlar:</div>
            <div class="font-bold text-xl text-white">{{ totalAmount.toLocaleString() }} <span
                class="text-sm font-normal text-slate-400">so'm</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>