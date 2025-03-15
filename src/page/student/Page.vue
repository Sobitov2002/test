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
        class="p-6 rounded-lg shadow-lg w-full mx-auto">
        <h1 class="text-3xl font-semibold text-white mb-6">Studentlar Ro'yxati</h1>
        <ul class="spacegoToGroupCourse-y-3">
            <li v-for="(student, index) in fetchFulstudent" :key="index" class="p-2 text-white"
                :class="{ 'border-b border-gray-600': index !== fetchFulstudent.length - 1 }">
                <div class="flex justify-between items-center">
                    <div class="flex justify-center items-center gap-4">
                        <img class="w-12 h-12 rounded-full"
                            src="https://i.pinimg.com/236x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg" alt="User">
                        <p class="text-sm text-gray-400">ID: {{ student.id }}</p>
                        <p class="text-lg font-bold">{{ student.full_name }}</p>
                    </div>
                    <div class="flex flex-col items-end">
                        <p class="text-sm text-gray-400">{{ student.phone_number }}</p>
                        <div class="flex items-center mt-2">
                            <!-- Agar kerak bo'lsa, statusni qo'shishingiz mumkin -->
                            <!-- <span class="h-2.5 w-2.5 rounded-full"
                                :class="student.role === 'active' ? 'bg-green-500' : 'bg-red-500'"></span>
                            <span class="ml-2 text-sm">{{ student.role }}</span> -->
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

