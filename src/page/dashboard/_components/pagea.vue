<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ref } from 'vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { onMounted } from 'vue';
import { courseGetAll } from '../servies';

const courses = ref(); 
onMounted(async () => {
    try {
        const fetchedCourses = await courseGetAll();
        courses.value = fetchedCourses;


    } catch (error) {
        console.log(error);
    }
});


const modules = [Autoplay, Pagination, Navigation];
const swiperRef = ref(null);

const onSwiperInit = (swiper: any) => {
    // Swiper initialization handler
};
</script>

<template>
    <div class="h-full p-[0px]">
        <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
            class="shadow-lg overflow-hidden rounded-[20px]">
            <swiper ref="swiperRef" :onSwiper="onSwiperInit" :spaceBetween="10" :slidesPerView="2" :loop="true"
                :autoplay="{ delay: 2500, disableOnInteraction: false }" :breakpoints="{
                    400: { slidesPerView: 1, spaceBetween: 5 },
                    480: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 1, spaceBetween: 40 }
                }" :modules="modules" class="mySwiper">
                <swiper-slide v-for="(course, index) in courses" :key="index">
                    <div class="flex items-center h-64 justify-between relative bg-cover bg-center rounded-[12px]"
                        :style="course.image">
                        <!-- Text Section -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 z-10 p-4">
                            <div>
                                <div>
                                    <p class="text-white text-[30px] font-bold">{{ course.name }}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<style scoped>
.card {
    cursor: pointer;
}
</style>
