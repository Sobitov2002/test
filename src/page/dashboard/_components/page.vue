<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect } from 'vue';
import api from '@/service/apiService';
import { useDateStore } from '@/page/dashboard/store/index';
import router from '@/router';
import { computed } from 'vue';
const dateStoreq = useDateStore()
const store = useDateStore();
interface Administrator {
    total_students: number;
    count: number;
}
const startDate = computed(() => dateStoreq.endDate);

const totalStudents = ref(null); 

const getReception = async () => {
    try {
        if (!startDate.value) {
            console.error("startDate mavjud emas!");
            return;
        }

        console.log(startDate.value);
        const [year, month] = startDate.value.split("-");
        const response = await api.get(`/reception/get_total_reception_students?year=${year}&month=${month}`, { withCredentials: true });

        totalStudents.value = response.data.total_students; // Olingan ma'lumotni saqlash
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
};
watchEffect(() => {
    if (startDate.value) {
        getReception();
    }
});

const allCourses = ref<{ count: number } | null>(null);
const counter = ref<number | null>(null);
const allPayment = ref();

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
        type: Object as () => Administrator,
        default: null,
    },
});

onMounted(async () => {
    try {
        const response = await api.get('/course/get_count', { withCredentials: true });
        allCourses.value = response.data;
        counter.value = response.data.count;
    } catch (error) {
        console.error('Get course error:', error);
    }
});

const dateStore = useDateStore();
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



const nextStudent = () =>{
        router.push('/students')
}
const nextGroup = () =>{
    router.push('/group')
}
const nextTeacher = () =>{
    router.push('/teacher')
}

const nextReception = () =>{
    router.push('/reception')
}
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
        <!-- Student Count Card -->
        <div @click="nextStudent" class="stat-card">
            <div class="stat-content">
                <h3 class="stat-label">Talabalar soni:</h3>
                <p class="stat-value">{{ props.studentCount }}</p>
            </div>
            <div class="stat-icon-container">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>

        <!-- Teachers Count Card -->
        <div @click="nextTeacher" class="stat-card">
            <div class="stat-content">
                <h3 class="stat-label">Ustozlar soni:</h3>
                <p class="stat-value">{{ props.fetchAdminstratr.count }}</p>
            </div>
            <div class="stat-icon-container">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z" />
                </svg>
            </div>
        </div>

        <!-- Groups Count Card -->
        <div @click="nextGroup" class="stat-card">
            <div class="stat-content">
                <h3 class="stat-label">Guruhlar soni:</h3>
                <p class="stat-value">{{ counter }}</p>
            </div>
            <div class="stat-icon-container">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21 11.4389 21 12.3296C21 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296" />
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16V8L7 12L13 16Z" fill="currentColor" />
                </svg>
            </div>
        </div>

        <!-- Admissions Count Card -->
        <div @click="nextReception" class="stat-card">
            <div class="stat-content">
                <h3 class="stat-label">Qabullar soni:</h3>
                <p v-if="totalStudents !== null" class="stat-value">
                    {{ totalStudents }}
                </p>
                <p v-else class="stat-empty">
                    Ma'lumot yo'q
                </p>
            </div>
            <div class="stat-icon-container">
                <svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 12h14M12 5v14" />
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stat-card {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: #1E293B;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background-color: #06b853;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
}

.stat-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.stat-label {
    font-size: 0.875rem;
    color: #A0AEC0;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.stat-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: white;
    line-height: 1;
}

.stat-empty {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    opacity: 0.7;
}

.stat-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #06b853;
    border-radius: 0.75rem;
    width: 3rem;
    height: 3rem;
    padding: 0.75rem;
    align-self: center;
}

.stat-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
}

@media (max-width: 640px) {
    .stat-value {
        font-size: 1.75rem;
    }

    .stat-card {
        padding: 1.25rem;
    }
}
</style>