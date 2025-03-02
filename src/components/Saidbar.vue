<script setup lang="ts">
import { computed, watch } from 'vue';
import { sidebarData } from '@/constants/index';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useSidebarStore } from '@/stores/sidebarStore';

const userStore = useUserStore();
const sidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute();

const filteredSidebarData = computed(() => {
    return sidebarData.filter(item => item.role.includes(userStore.currentRole));
});

const currentPage = computed(() => {
    return filteredSidebarData.value.findIndex(item => item.path === route.path);
});

watch(route, () => {
    sidebarStore.closeSidebar();
});

const changePage = (path: string) => {
    router.push(path);
};

const getSvgIcon = (icon: string, isActive: boolean) => {
    const activeClass = isActive ? 'text-white dark:text-white' : 'dark:text-white text-gray-700';
    return icon.replace(/class="[^"]+"/, `class="w-6 h-6 transition duration-75 ${activeClass}"`);
};

const toggleSidebar = () => {
    sidebarStore.isOpen = !sidebarStore.isOpen;
};
</script>

<template>
    <!-- Sidebar -->
    <aside
        class="fixed lg:top-0 left-0 z-40 w-[264px] h-screen transition-transform top-14 -translate-x-full lg:translate-x-0"
        :class="{ 'translate-x-0': sidebarStore.isOpen }">
        <div style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
            class="overflow-y-auto rounded-[20px] py-5 px-3 m-2 h-full relative">

           
            <div class="w-full m-auto">
                <h1
                    class=" mt-[30px] text-center font-bold -tracking-tighter bg-gradient-to-r from-white to-[#757A8C] text-transparent bg-clip-text ">
                    ITECH ACADEMY</h1>
                <div class="block mt-[30px] bg-gradient-to-br from-[#27282b] via-white to-[#191a1c] w-full h-[2px]">
                </div>
            </div>

            <!-- Sidebar menyusi -->
            <ul class="space-y-2 pb-[140px] mt-[22px]">
                <template v-for="(item, index) in filteredSidebarData" :key="index">
                    <li class="cursor-pointer flex items-center py-2 px-3 text-base font-medium border-spacing-0 rounded-lg group"
                        :class="[currentPage === index ? 'bg-opacity-100 text-white sideBar-menu' : 'bg-opacity-0 text-gray-700 rounded-lg dark:text-white hover:bg-opacity-15 dark:hover:bg-opacity-25']"
                        @click="changePage(item.path)">
                        <div class="flex justify-center items-center bg-[#1A1F37] w-[40px] h-[40px] rounded-[12px]"
                            :class="{ 'bg-[#0075FF]': currentPage === index }">
                            <span v-html="getSvgIcon(item.icon, currentPage === index)"></span>
                        </div>
                        <span class="ml-3 py-[10px] text-[14px] leading-[14px] font-bold">{{ item.title }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </aside>
</template>
