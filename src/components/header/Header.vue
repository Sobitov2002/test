<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useRoute, useRouter } from 'vue-router';
import RouteName from './_components/RouterName.vue';

const sidebarStore = useSidebarStore();
const route = useRoute();
const router = useRouter();

const token = ref(localStorage.getItem('token') || null);


const loginHandler = () => {
    localStorage.setItem('token', 'user-token'); 
    token.value = 'user-token';
    router.push('/'); 
};




const getRouteName = computed(() => {
    return route.path === '/' ? 'Bosh Sahifa' : route.path.replace('/', '').replace(/-/g, ' ').toUpperCase();
});
</script>

<template>
    <header style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
        class=" fixed  rounded-2xl right-0    text-white py-4 px-6 flex items-center justify-between z-50">

        <!-- Sidebar Toggle -->
        <div class="lg:hidden cursor-pointer" @click="sidebarStore.isOpen = !sidebarStore.isOpen">
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>

        <!-- Router Name -->
       

        <!-- Sign In / Sign Out -->
        <div class="grid grid-cols-1 border-1 rounded-2xl bg-slate-900 items-center px-2 max-w-md ml-auto">
            <!-- Agar token bo‘lsa chiqish tugmasi chiqadi -->
            <div v-if="token" @click="loginHandler" class="flex gap-2 items-center cursor-pointer">
                <svg class="w-6 h-6 text-white dark:text-[#fff]" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                        clip-rule="evenodd" />
                </svg>
                <p class="text-white px-2 py-1">Chiqish</p>
            </div>

            <!-- Agar token bo‘lmasa kirish tugmasi chiqadi -->
            <div v-else @click="loginHandler" class="flex gap-2 items-center cursor-pointer">
                <svg class="w-6 h-6 text-white dark:text-[#fff]" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                        clip-rule="evenodd" />
                </svg>
                <p class="text-white px-2 py-1">Kirish</p>
            </div>
        </div>

    </header>
</template>
