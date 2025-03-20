<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebarStore';
import { useRoute , useRouter } from 'vue-router';
import RouteName from './_components/RouterName.vue'

const sidebarStore = useSidebarStore();
const toggleSidebar = () => {
    sidebarStore.isOpen = !sidebarStore.isOpen;
};

// Hozirgi yo‘nalishni olish va ko‘rsatish
const route = useRoute();
const router = useRouter()
const getRouteName = () => {
    return route.path === '/' ? 'Bosh Sahifa' : route.path.replace('/', '').replace(/-/g, ' ').toUpperCase();
};
const loginhandler = () =>{
    router.push('/')
}
</script>

<template>
    <header
        class="rounded-2xl fixed lg:left-0 right-0 w-full bg-slate-900 md:bg-transparent text-white py-4 px-6 flex items-center justify-between z-50">

        <!-- Sidebar Toggle -->
        <div class="lg:hidden cursor-pointer" @click="toggleSidebar">
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>

        <!-- Router Name -->
        <div class="absolute lg:left-[284px] md:left-10 hidden md:block">
           <RouteName />
        </div>

        <!-- Search & User Menu -->
        <div class="grid grid-cols-2 items-center  max-w-md ml-auto">

            <!-- Search Input -->
            

            <!-- Sign In -->
            <div @click="loginhandler" class="flex gap-2 cursor-pointer">
                <svg class="w-6 h-6 text-gray-800 dark:text-[#E2E8F04D]" xmlns="http://www.w3.org/2000/svg" width="24"
                    height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                        clip-rule="evenodd" />
                </svg>
                <p class="text-[#718096] hidden md:block">Sign In</p>
            </div>

        </div>
    </header>
</template>
