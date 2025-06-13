<template>
  <div
    class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white flex items-center pb-5 gap-2">
       <TrendingUp class="text-emerald-500" size="20" />

        Foydalar statistikasi
      </h2>
    </div>

    <!-- Loading state -->
 <div>

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
        Tanlangan sana oralig'ida hech qanday foyda ma'lumotlari mavjud emas
      </p>
      <div class="mt-6 flex space-x-3">
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
        <div class="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style="animation-delay: 600ms"></div>
      </div>
    </div>

    <!-- Chart and summary -->
    <div v-if="!isEmpty" class="flex flex-col gap-6">
      <!-- Total profit indicator -->
      

      <!-- Charts section -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Doughnut chart -->
        <div class="bg-slate-800/50 backdrop-blur rounded-lg p-4" v-if="hasChartData">
          <h3 class="text-sm font-medium text-slate-300 mb-4">Foyda taqsimoti</h3>
          <div class="relative h-[200px]">
            <canvas ref="chartCanvas"></canvas>
            <!-- Center total -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div class="text-lg text-slate-400">Jami</div>
              <div class="text-4xl font-bold text-white">{{ Math.abs(totalAmount).toLocaleString() }}</div>
              <div class="text-lg text-slate-400">so'm</div>
            </div>
          </div>
        </div>

        
      </div>

      <!-- Payment details -->
      <div class="flex-1 mt-6 flex flex-col justify-center">
        <div class="space-y-4">
          <div v-for="(payment, index) in payments" :key="index"
            class="bg-slate-800/50 backdrop-blur rounded-lg p-4 transition-all duration-300 hover:bg-slate-700/50 group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" :style="{ backgroundColor: payment.color + '20' }">
                  <component :is="getIcon(payment.icon)" :style="{ color: payment.color }" size="20" />
                </div>
                <div>
                  <div class="font-medium text-white">{{ payment.name }}</div>
                  <div class="text-xs text-slate-400">
                    {{ payment.amount >= 0 ? 'Foyda' : 'Zarar' }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold" 
                     :class="payment.amount >= 0 ? 'text-emerald-400' : 'text-white'">
                  {{ payment.amount >= 0 ? '+' : '' }}{{ payment.amount.toLocaleString() }}
                </div>
                <div class="text-xs text-slate-400">so'm</div>
              </div>
            </div>

            <!-- Progress bar with animation -->
            <div class="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden" v-if="hasChartData">
              <div class="h-full rounded-full transition-all duration-500 ease-out group-hover:brightness-110"
                :style="{ width: `${percentages[index]}%`, backgroundColor: payment.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
        
        <div class="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div class="flex justify-between items-center">
            <div class="font-medium text-slate-300">Jami Foydalar:</div>
            <div class="font-bold text-xl text-white">
                {{ Math.abs(totalAmount).toLocaleString() }} 
             <span class="text-sm font-normal text-slate-400">so'm</span>
            </div>

          </div>
        
      </div>
    </div>
    <div >

    </div>
   
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';
import { ArrowUpCircle,TrendingUp, Wallet, CreditCard, DollarSign, Loader2, FileQuestion, AlertCircle } from 'lucide-vue-next';

Chart.register(...registerables);

interface PaymentData {
  name: string;
  amount: number;
  color: string;
  icon: string;
}

interface ApiResponse {
  year: number;
  month: number;
  cash_profit: number;
  click_profit: number;
  total_profit: number;
}

const dateStore = useDateStore();
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const barChartCanvas = ref<HTMLCanvasElement | null>(null);
const payments = ref<PaymentData[]>([]);
const totalAmount = ref<number>(0);
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);
const errorMessage = ref<string>('');
let chartInstance: Chart | null = null;
let barChartInstance: Chart | null = null;

// Check if we have data to display
const isEmpty = computed(() =>
  !isLoading.value &&
  !hasError.value &&
  payments.value.length === 0
);

// Check if we should show chart (only if we have non-zero values)
const hasChartData = computed(() => 
  payments.value.some(payment => Math.abs(payment.amount) > 0)
);

// Calculate percentages based on absolute values for chart display
const percentages = computed(() => {
  const totalAbsolute = payments.value.reduce((sum, payment) => sum + Math.abs(payment.amount), 0);
  if (totalAbsolute === 0) return payments.value.map(() => 0);
  return payments.value.map(payment =>
    ((Math.abs(payment.amount) / totalAbsolute) * 100).toFixed(1)
  );
});

const fetchPaymentStatistics = async (): Promise<void> => {
  if (!dateStore.startDate || !dateStore.endDate) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await api.get<ApiResponse>(`/payment/profit?year=${dateStore.startDate}&month=${dateStore.endDate}`);
    const data = response.data;
    console.log("Response Data:", data);

    // Extract profit values from API response
    const cashProfit = data.cash_profit || 0;
    const clickProfit = data.click_profit || 0;
    totalAmount.value = data.total_profit || 0;

    // Prepare the payments array with profit data
    payments.value = [
      {
        name: 'Naxt',
        amount: cashProfit,
        color: cashProfit >= 0 ? '#10B981' : '#EF4444',
        icon: 'wallet'
      },
      {
        name: 'Click',
        amount: clickProfit,
        color: clickProfit >= 0 ? '#3B82F6' : '#F59E0B',
        icon: 'credit-card'
      }
    ];

    // Update the charts if there is data to display
    if (hasChartData.value) {
      updateChart();
      updateBarChart();
    }
  } catch (error) {
    console.error("Error fetching payment statistics:", error);
    hasError.value = true;
    errorMessage.value = 'Foyda ma\'lumotlarini olishda xatolik yuz berdi';
  } finally {
    isLoading.value = false;
  }
};

const updateChart = (): void => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (chartCanvas.value && hasChartData.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;

    // Use absolute values for chart display
    const chartData = payments.value.map(p => Math.abs(p.amount));
    const chartLabels = payments.value.map(p => `${p.name} (${p.amount >= 0 ? 'Foyda' : 'Zarar'})`);

    chartInstance = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
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
                const value = payments.value[context.dataIndex].amount;
                const percentage = percentages.value[context.dataIndex];
                const sign = value >= 0 ? '+' : '';
                return `${sign}${value.toLocaleString()} so'm (${percentage}%)`;
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

const updateBarChart = (): void => {
  if (barChartInstance) {
    barChartInstance.destroy();
  }

  if (barChartCanvas.value && hasChartData.value) {
    const ctx = barChartCanvas.value.getContext('2d');
    if (!ctx) return;

    barChartInstance = new Chart(barChartCanvas.value, {
      type: 'bar',
      data: {
        labels: payments.value.map(p => p.name),
        datasets: [{
          label: 'Foyda/Zarar',
          data: payments.value.map(p => p.amount),
          backgroundColor: payments.value.map(p => p.color + '80'),
          borderColor: payments.value.map(p => p.color),
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 30,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function(value) {
                return value.toLocaleString() + ' so\'m';
              }
            },
            beginAtZero: true
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }
        },
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
              label: function(context) {
                const value = context.raw as number;
                const sign = value >= 0 ? '+' : '';
                return `${sign}${value.toLocaleString()} so'm`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'wallet': return Wallet;
    case 'credit-card': return CreditCard;
    default: return DollarSign;
  }
};

// Fetch payment statistics on component mount
onMounted(() => {
  fetchPaymentStatistics();
});

// Watch for changes in date store and fetch statistics again
watch(() => [dateStore.startDate, dateStore.endDate], fetchPaymentStatistics, { deep: true });
</script>
