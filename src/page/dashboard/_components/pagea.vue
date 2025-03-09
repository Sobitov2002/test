<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ref, onMounted } from 'vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { courseGetAll } from '../servies';

const courses = ref([]);

onMounted(async () => {
    try {
        const fetchedCourses = await courseGetAll();
        courses.value = fetchedCourses;
        console.log(courses.value);
    } catch (error) {
        console.error("Xatolik:", error);
    }
});


const modules = [Autoplay, Pagination, Navigation];
</script>

<template>
    <div class="h-full p-0">
        <div class="shadow-lg overflow-hidden rounded-[20px]"
            style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
            <swiper :spaceBetween="10" :slidesPerView="2" :loop="true"
                :autoplay="{ delay: 2500, disableOnInteraction: false }" :breakpoints="{
                    400: { slidesPerView: 1, spaceBetween: 5 },
                    480: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 1, spaceBetween: 40 }
                }" :modules="modules" class="mySwiper">
                <swiper-slide v-for="(course, index) in courses" :key="index">
                    <div class="flex items-center h-[300px] justify-between relative rounded-[12px] overflow-hidden">
                        <img class="absolute inset-0 w-full h-full object-cover"
                            :src="'https://iteachsystem.uz/images/'  " alt="Course Image">
                        
                        <div class="relative z-10 p-4 w-full ">
                            <p class="text-white text-[30px] font-bold"></p>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>
