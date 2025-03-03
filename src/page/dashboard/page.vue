<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Statistic from './_components/page.vue';
import CourseSlider from './_components/pagea.vue';
import { fetchStudentCount, fetchFullCourse, fetchAdminstrator, Adminstrator, courseGetAll } from './servies';

const studentCount = ref();
const getAllCourse = ref();
const getCourseLength = ref();
const fetchAdminstratr = ref();
const allCourse = ref();
const adminstratr = ref();
const errorMessage = ref<string | null>(null);

onMounted(async () => {
    try {
        studentCount.value = await fetchStudentCount();
        getAllCourse.value = await fetchFullCourse();
        fetchAdminstratr.value = await fetchAdminstrator();
        allCourse.value = await courseGetAll();        
        adminstratr.value = await Adminstrator();
        getCourseLength.value = getAllCourse.value.length;        
    } catch (error) {
        console.error('Error fetching data:', error);
        errorMessage.value = 'An error occurred while fetching the data.';
    }
});
</script>

<template>
    <div class="p-2">
        <div class="">
            <Statistic :studentCount="studentCount" :getAllCourse="getCourseLength" :fetchAdminstratr="fetchAdminstratr"
                :adminstratr="adminstratr" />
        </div>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-10 mt-4 ">
            <CourseSlider :allCourse="allCourse" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <CourseSlider :allCourse="allCourse" />
                <CourseSlider :allCourse="allCourse" />

            </div>
        </div>
    </div>
</template>
