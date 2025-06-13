<template>
    <div class="p-4">
        <div class="flex items-center gap-4 flex-wrap">
           
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Oy tanlang</label>
                <select v-model="dateStore.endDate" @change="dateStore.setEndDate(dateStore.endDate)"
                    class="bg-gray-800 text-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option v-for="month in months" :key="month.value" :value="month.value">
                        {{ month.name }}
                    </option>
                </select>
            </div>

            <!-- START DATE (YIL TANLASH) -->
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Yil tanlang</label>
                <select v-model="dateStore.startDate" @change="dateStore.setStartDate(dateStore.startDate)"
                    class="bg-gray-800 text-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option v-for="year in years" :key="year" :value="year">
                        {{ year }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Statistic Component -->
        <div class="mt-6">
            <Statistic :studentCount="studentCount" :fetchAdminstratr="fetchAdminstratr" :adminstratr="adminstratr"
                :peyment="allPayment" />
        </div>

        <!-- Diagrams -->
        <div class="grid md:grid-cols-3 gap-6 grid-cols-1 mt-6">
            <PeymentDiagram />
            <Expence />
            <Profit />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import Statistic from './_components/page.vue';
import PeymentDiagram from './_components/PeymentDiagram.vue';
import Profit from './_components/PaymentList.vue';
import Expence from './_components/Expence.vue';
import {
    fetchStudentCount,
    fetchFullCourse,
    fetchAdminstrator,
    Adminstrator,
    courseGetAll,
} from './servies';
import { useDateStore } from '@/page/dashboard/store/index';

const dateStore = useDateStore();

const studentCount = ref();
const getAllCourse = ref();
const fetchAdminstratr = ref();
const allCourse = ref();
const adminstratr = ref();
const allPayment = ref();

dateStore.startDate = "2025";


const currentMonth = new Date().getMonth() + 1;
dateStore.endDate = currentMonth.toString().padStart(2, '0');

const years = Array.from({ length: 10 }, (_, i) => 2018 + i);
const months = [
    { name: 'Yanvar', value: '01' },
    { name: 'Fevral', value: '02' },
    { name: 'Mart', value: '03' },
    { name: 'Aprel', value: '04' },
    { name: 'May', value: '05' },
    { name: 'Iyun', value: '06' },
    { name: 'Iyul', value: '07' },
    { name: 'Avgust', value: '08' },
    { name: 'Sentyabr', value: '09' },
    { name: 'Oktyabr', value: '10' },
    { name: 'Noyabr', value: '11' },
    { name: 'Dekabr', value: '12' },
];

onMounted(async () => {
    try {
        studentCount.value = await fetchStudentCount();
        getAllCourse.value = await fetchFullCourse();
        fetchAdminstratr.value = await fetchAdminstrator();
        allCourse.value = await courseGetAll();
        adminstratr.value = await Adminstrator();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
</script>
