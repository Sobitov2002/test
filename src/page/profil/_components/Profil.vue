<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { profilGet } from '../servise';
import UpdateProfile from './UpdateProfil.vue';

const profilData = ref({
    full_name: '',
    profile_image: '',
    username: '',
    phone: '',
    role: '',
});

const isModalOpen = ref(false);

const loadProfile = async () => {
    try {
        const response = await profilGet();
        console.log("Profil API javobi:", response);

        profilData.value = {
            full_name: response.full_name || 'Ism mavjud emas',
            profile_image: response.image || 'default-avatar.jpg',
            username: response.email || 'Noma’lum foydalanuvchi',
            phone: response.phone_number || 'Telefon mavjud emas',
            role: response.role || 'Telefon mavjud emas',
        };
    } catch (error) {
        console.error("Profilni yuklashda xatolik:", error);
    }
};

onMounted(loadProfile);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class="w-full h-auto rounded-[20px] shadow-lg overflow-hidden relative">
        <div
            class="banner w-full sm:h-[180px] h-[140px] rounded-t-[20px] bg-slate-400 relative flex sm:justify-start sm:pl-[30px] justify-center">
            <img src="https://i.pinimg.com/736x/78/22/d4/7822d44284a4218f82d4e001f80c4ca9.jpg"
                class="absolute top-0 left-0 w-full h-full object-cover" loading="lazy">
            <img class="absolute w-[164px] h-[164px] rounded-full border-4 border-white bg-gray-700 dark:border-gray-800 bottom-[-82px]"
                :src="'https://iteachsystem.uz/images/' + profilData.profile_image" alt="Profile image" loading="lazy">
        </div>

        <div class="info mt-[100px] mb-2 pl-[30px] text-left max-sm:text-center">
            <div class="flex gap-4">

                <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ profilData.full_name }}</h1>
                <div class="text-right items-center ">
                    <button @click="openModal" class=" text-white transition">
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                        </svg>
                    </button>
                </div>

            </div>
            <h2 class="text-gray-700 text-sm font-medium dark:text-white">{{ profilData.role }}</h2>
        </div>

        <div class="grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 w-[95%] m-auto gap-4 mb-[20px]">
            <div class="flex items-start gap-2 w-full p-[5px] flex-col text-left">
                <h1 class="block text-gray-600 m-0 dark:text-white">Telefon</h1>
                <p class="text-gray-700 text-lg font-bold dark:text-white flex items-center">
                    <svg class="w-[40px] h-[40px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-width="2"
                            d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>+998{{ profilData.phone }}
                </p>
            </div>
            <div>
                <h1 class="block text-gray-600 m-0 dark:text-white">Email</h1>
                <h3 class="text-lg text-gray-500 font-bold mt-4 dark:text-white flex items-center">
                    <svg class="w-[40px] h-[40px] text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
                    </svg>
                    {{ profilData.username }}
                </h3>
            </div>

        </div>
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/95 bg-opacity-50">
            <div class="bg-gray-800 p-6 rounded-xl ">
                
                <UpdateProfile :profilData="profilData" @profileUpdated="loadProfile;  closeModal()" />
               
            </div>
        </div>

    </div>
</template>
