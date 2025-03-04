<script setup lang="ts">
import { defineProps, ref , onMounted } from 'vue';
import { fetchFullstudent } from './services'

const fetchFulstudent = ref()

onMounted(async () => {
    try {
        fetchFulstudent.value = await fetchFullstudent() 
        console.log(fetchFulstudent.value);
        
    } catch (error) {
        console.log(error);
        
    }
});
</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class="p-6  rounded-lg shadow-lg w-full mx-auto">
        <h1 class="text-3xl font-semibold text-white mb-6">Studentlar Ro'yxati</h1>
        <ul class="space-y-6">
            <li v-for="(student, index) in fetchFulstudent" :key="index"
                class=" rounded-lg p-4 shadow-md hover:bg-slate-900/55">
                <div class="flex justify-between items-center text-white">
                    <div>
                        <p class="text-sm text-gray-400">ID: {{ student.id }}</p>
                        <p class="text-lg font-bold">{{ student.full_name }}</p>
                    </div>
                    <div class="bg-gray-700 text-white rounded-full py-2 px-4 text-sm">{{ student.phone_number }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>
