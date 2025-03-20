<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect } from 'vue';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';

const store = useDateStore()
interface Adminstratr {
    total_students: number;
    count: number;
}

const allCourser = ref<{ count: number } | null>(null);
const counter = ref<number | null>(null);
const allPeyment = ref();


const props = defineProps({
    studentCount: {
        type: Number,
        default: null,
    },
    fetchAdminstratr: {
        type: Object as () => { count: number },
        default: () => ({ count: 0 }),
    },
    adminstratr: {
        type: Number,
        default: () => [],
    },
});

onMounted(async () => {
    try {
        const response = await api.get('/course/get_count', { withCredentials: true });
        allCourser.value = response.data;
        counter.value = response.data.count;
    } catch (error) {
        console.error('Get course error:', error);
    }
});

const dateStore = useDateStore();
const allPayment = ref();
const expense = ref();

watchEffect(async () => {
    if (dateStore.startDate && dateStore.endDate) {
        try {
            const response = await api.get(`/payment/monthly_sum?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
            allPayment.value = response.data;
        } catch (error) {
            console.error("To'lov ma'lumotlarini olishda xato:", error);
        }

        try {
            const response = await api.get(`/expense/get_sum_expense?start_date=${dateStore.startDate}&end_date=${dateStore.endDate}`);
            expense.value = response.data;
        } catch (error) {
            console.error("Xarajatlarni olishda xato:", error);
        }
    }
});

</script>


<template>
    <div class="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        <div class="flex justify-between p-4 rounded-[20px] bg-[#1E293B] ">
            <div>
                <h1 class="text-[#A0AEC0]">Talabalar soni: </h1>
                <p class="text-[40px] text-white font-bold">{{ props.studentCount }}</p>
            </div>
            <div class="flex justify-center items-center">
                <div class="bg-[#06b853] p-[11px] rounded-[12px]">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                            d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex justify-between p-4 rounded-[20px] bg-[#1E293B] ">
            <div>
                <h1 class="text-[#A0AEC0]">Ustozlar soni: </h1>
                <p class="text-[40px] text-white font-bold">{{ props.fetchAdminstratr.count }}</p>
            </div>
            <div class="flex justify-center items-center">
                <div class="bg-[#06b853] p-[11px] rounded-[12px]">
                    <svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z" />
                    </svg>

                </div>
            </div>
        </div>

        <div class="flex justify-between bg-[#1E293B] p-4 rounded-[20px]">
            <div>
                <h1 class="text-[#A0AEC0]">Guruhlar soni: </h1>
                <p class="text-[40px] text-white font-bold">{{ counter }}</p>
            </div>
            <div class="flex justify-center items-center">
                <div class="bg-[#06b853] p-[11px] rounded-[12px]">
                    <svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z" />
                    </svg>

                </div>
            </div>
        </div>




        <div class="flex justify-between bg-[#1E293B]  p-4 rounded-[20px]">
            <div>
                <h1 class="text-[#A0AEC0]">Qabullar soni: </h1>
                <p v-if="props.adminstratr" class="text-[40px] text-white font-bold">
                    {{ props.adminstratr.total_students }}
                </p>
                <p v-else class="text-[20px] text-white font-bold">
                    Ma'lumot yo'q
                </p>
            </div>

            <div class="flex justify-center items-center">
                <div class="bg-[#06b853] p-[11px] rounded-[12px]">
                    <svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z" />
                    </svg>

                </div>
            </div>
        </div>

        
        
    </div>





</template>