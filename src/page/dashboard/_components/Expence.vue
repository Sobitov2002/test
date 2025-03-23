<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';
import { ArrowUpCircle, Wallet, CreditCard, DollarSign, Loader2 } from 'lucide-vue-next';

Chart.register(...registerables);

const dateStore = useDateStore();
const chartCanvas = ref(null);
const payments = ref([]);
const totalAmount = ref(0);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
let chartInstance = null;

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

  try {
    const response = await api.get(`/expense/get?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
    const data = response.data;

    // Group payments by type
    let cashAmount = 0;
    let clickAmount = 0;

    data.forEach((item) => {
      if (item.payment_type === 'cash') {
        cashAmount += item.amount;
      } else if (item.payment_type === 'click') {
        clickAmount += item.amount;
      }
    });

    // Calculate total
    totalAmount.value = cashAmount + clickAmount;

    // Prepare chart data
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

    updateChart();
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
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
          backgroundColor: gradients,
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
    <div class="flex items-center justify-between mb-">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        <ArrowUpCircle class="text-emerald-500" size="20" />
        Xarajatlar statistikasi
      </h2>

      <!-- Date range indicator could go here -->
      <div v-if="isLoading" class="flex items-center  h-[240px] text-blue-400 text-sm">
        <Loader2 class="animate-spin mr-2  h-[240px] " size="12" />
        Yuklanmoqda...
      </div>
    </div>

    <!-- Error message -->
    <div v-if="hasError" class="bg-red-900/30 text-red-300 p-4 rounded-lg mb-4 flex items-center">
      <span class="mr-2">⚠️</span>
      {{ errorMessage }}
    </div>

    <!-- Chart and summary -->
    <div class="flex flex-col kg:flex-row gap-6">
      <!-- Chart section -->
      <div class="relative flex-1 h-[200px]">
        <div v-if="isLoading && !chartInstance" class="absolute inset-0 flex items-center justify-center">
          <Loader2 class="animate-spin text-blue-400" size="40" />
        </div>
        <canvas ref="chartCanvas" :class="{ 'opacity-50': isLoading && chartInstance }"></canvas>

        <!-- Center total -->
        <div v-if="!isLoading && totalAmount > 0"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div class="text-sm text-slate-400">Jami</div>
          <div class="text-xl font-bold text-white">{{ totalAmount.toLocaleString() }}</div>
          <div class="text-xs text-slate-400">so'm</div>
        </div>
      </div>

      <!-- Payment details -->
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

            <!-- Progress bar -->
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