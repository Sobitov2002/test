<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Statistic from './_components/page.vue';
import PeymentDiagram from './_components/PeymentDiagram.vue';
import Expence from './_components/Expence.vue'
import { fetchStudentCount, fetchFullCourse, fetchAdminstrator, Adminstrator, courseGetAll } from './servies';
import { useDateStore } from '@/page/dashboard/store/index';

const dateStore = useDateStore();

const studentCount = ref();
const getAllCourse = ref();
const fetchAdminstratr = ref();
const allCourse = ref();
const adminstratr = ref();
const allPayment = ref();

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

<template>
    <div class="p-2">
        <div>
            <div class="flex items-center gap-4">

                <input type="date" v-model="dateStore.startDate" @change="dateStore.setStartDate(dateStore.startDate)"
                    class="text-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input type="date" v-model="dateStore.endDate" @change="dateStore.setEndDate(dateStore.endDate)"
                    class="text-white p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <Statistic :studentCount="studentCount" :fetchAdminstratr="fetchAdminstratr" :adminstratr="adminstratr"
                :peyment="allPayment" />
        </div>
        <div class="grid md:grid-cols-3 gap-4 grid-cols-1 mt-4">
            <PeymentDiagram />
            <Expence />
             </div>
        </div>
</template>
