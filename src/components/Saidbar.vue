<script setup lang="ts">
import { ref, computed } from 'vue';
import { sidebarData } from '@/constants/index';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
const currentPage = ref<number>(0);
const router = useRouter();
const filteredSidebarData = computed(() => {
    return sidebarData.filter(item => item.role.includes(userStore.currentRole));
});
const changePage = (index: number, path: string) => {
    currentPage.value = index;
    if (path == '/profile') {
        localStorage.setItem('userId', '');
    }
    router.push(path);
};
const getSvgIcon = (icon: string, isActive: boolean) => {
    const activeClass = isActive ? 'text-white dark:text-white  group-hover:text-white' : 'dark:text-white text-gray-700 group-hover:text-gray-800 dark:group-hover:text-white';
    return icon.replace('class="w-6 h-6 text-green-500 transition duration-75"', `class="w-6 h-6 text-gray-700 transition duration-75 ${activeClass}"`);
};
</script>
<template>
    <aside
        class="fixed top-0 left-0 m-[10px]  z-40 w-[264px] h-screen  transition-transform -translate-x-full   lg:translate-x-0  dark:border-gray-700">
        <div style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
            class="overflow-y-auto rounded-[20px] my-scroll-0 py-5 px-3 h-full bg-white ">
            <!-- Logo section -->
                <div>
                </div>

            <!-- menu -->
            <ul class="space-y-2 pb-[140px]">
                <template v-for="(item, index) in filteredSidebarData" :key="index">
                    <li class="cursor-pointer flex items-center py-2 px-3 text-base font-medium border-spacing-0 rounded-lg group"
                        :class="[currentPage == index ? 'bg-opacity-100 text-white sideBar-menu' : 'bg-opacity-0  text-gray-700 rounded-lg dark:text-white hover:bg-opacity-15 dark:hover:bg-opacity-25']"
                        @click="changePage(index, item.path)">
                        <div class="flex justify-center items-center bg-[#1A1F37]  w-[40px] h-[40px] rounded-[12px]"
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
