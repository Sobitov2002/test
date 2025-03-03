<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Statistic from './_components/page.vue';
import fetchStudentCount from './servies';

const studentCount = ref();
const errorMessage = ref<string | null>(null);

onMounted(async () => {
    try {
        studentCount.value = await fetchStudentCount();
        console.log('Student count:', studentCount.value);
    } catch (error) {
        console.error('Error fetching student count:', error);
        errorMessage.value = 'An error occurred while fetching student count.';
    }
});
</script>

<template>

    <Statistic :studentCount="studentCount" />
</template>
