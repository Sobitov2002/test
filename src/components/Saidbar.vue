<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue';
import { sidebarData } from '@/constants/index';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useSidebarStore } from '@/stores/sidebarStore';

const userStore = useUserStore();
const sidebarStore = useSidebarStore();
const router = useRouter();
const route = useRoute();
const sidebarRef = ref<HTMLElement | null>(null);

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
    const activeClass = isActive ? 'text-white' : 'text-gray-400 group-hover:text-white';
    return icon.replace(/class="[^"]+"/, `class="w-5 h-5 transition-all duration-300 ${activeClass}"`);
};

const toggleSidebar = () => {
    sidebarStore.isOpen = !sidebarStore.isOpen;
};

// Add smooth scrolling to active item
onMounted(() => {
    if (sidebarRef.value && currentPage.value !== -1) {
        const activeItem = sidebarRef.value.querySelector('.active-menu-item');
        activeItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
</script>

<template>
    <!-- Sidebar Backdrop (Mobile) -->
    <div v-if="sidebarStore.isOpen" @click="toggleSidebar"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"></div>

    <!-- Sidebar -->
    <aside ref="sidebarRef"
        class="fixed lg:top-0 left-0 z-40 w-[280px] h-screen transition-all duration-300 ease-in-out top-14 -translate-x-full lg:translate-x-0"
        :class="{ 'translate-x-0 shadow-2xl': sidebarStore.isOpen }">
        <div style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
            class="h-full rounded-[20px] py-6 px-4 m-2 overflow-hidden flex flex-col relative">
            <!-- Sidebar Header -->
            <div class="flex flex-col items-center mb-6">
                <div
                    class="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[#0075FF] to-[#00A3FF] rounded-xl shadow-lg mb-3">
                    <span class="text-white text-xl font-bold">IT</span>
                </div>
                <h1
                    class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#757A8C] text-transparent bg-clip-text">
                    ITEACH ACADEMY
                </h1>
                <div class="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <!-- Sidebar Menu -->
            <div class="flex-1 overflow-y-auto sidebar-scrollbar">
                <ul class="space-y-1.5 pb-6">
                    <template v-for="(item, index) in filteredSidebarData" :key="index">
                        <li class="cursor-pointer group transition-all duration-200" @click="changePage(item.path)">
                            <div class="flex items-center py-2.5 px-3 text-base font-medium rounded-xl transition-all duration-200"
                                :class="[
                                    currentPage === index
                                        ? 'bg-gradient-to-r from-[#0075FF]/20 to-[#0075FF]/5 text-white active-menu-item'
                                        : 'text-gray-300 hover:bg-white/5'
                                ]">
                                <div class="flex justify-center items-center w-10 h-10 rounded-xl transition-all duration-300 shadow-sm"
                                    :class="{
                                        'bg-[#0075FF] shadow-[#0075FF]/20 shadow-lg': currentPage === index,
                                        'bg-[#1A1F37] group-hover:bg-[#252b4a]': currentPage !== index
                                    }">
                                    <span v-html="getSvgIcon(item.icon, currentPage === index)"></span>
                                </div>
                                <span class="ml-3 font-medium transition-all duration-200" :class="{
                                    'text-white': currentPage === index,
                                    'text-gray-400 group-hover:text-white': currentPage !== index
                                }">
                                    {{ item.title }}
                                </span>

                                <!-- Active Indicator -->
                                <div v-if="currentPage === index" class="ml-auto w-1.5 h-8 bg-[#0075FF] rounded-full">
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>

            <!-- Sidebar Footer -->
            <div class="mt-auto pt-4 border-t border-white/10">
                <div class="flex items-center px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm">
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-[#0075FF] to-[#00A3FF] flex items-center justify-center text-white font-bold">
                        {{ userStore.currentRole?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div class="ml-3">
                        <p class="text-white text-sm font-medium truncate">{{ userStore.currentRole }}</p>
                        <p class="text-gray-400 text-xs">{{ new Date().toLocaleDateString() }}</p>
                    </div>
                    <button @click="toggleSidebar"
                        class="ml-auto lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
/* Custom scrollbar */
.sidebar-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}

.sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Active menu item animation */
.active-menu-item {
    position: relative;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0.5;
        transform: translateX(-5px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Hover effects */
.group:hover .group-hover\:bg-\[\#252b4a\] {
    background-color: #252b4a;
}

.group:hover .group-hover\:text-white {
    color: white;
}
</style>