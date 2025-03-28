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
    <Transition name="fade">
        <div v-if="sidebarStore.isOpen" @click="toggleSidebar"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"></div>
    </Transition>

    <!-- Sidebar -->
    <aside ref="sidebarRef"
        class="fixed top-0 left-0 z-40 w-[280px] h-screen transition-transform  ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full lg:translate-x-0"
        :class="{ 'translate-x-0 shadow-2xl': sidebarStore.isOpen }">
        <div style="background: linear-gradient(100.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%);"
            class="h-full  py-6 px-4  overflow-hidden flex flex-col relative backdrop-blur-md">

            <!-- Sidebar Header -->
            <div class="flex flex-col items-center mb-8">
                
                <h1
                    class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#757A8C] text-transparent bg-clip-text">
                    ITEACH ACADEMY
                </h1>
                <div class="mt-5 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <!-- Sidebar Menu -->
            <div class="flex-1 overflow-y-auto sidebar-scrollbar px-1">
                <ul class="space-y-2 pb-6">
                    <TransitionGroup name="list">
                        <li v-for="(item, index) in filteredSidebarData" :key="index"
                            class="cursor-pointer group transition-all duration-200" @click="changePage(item.path)">
                            <div class="flex items-center py-3 px-4 text-base font-medium rounded-xl transition-all duration-200"
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
                                <div v-if="currentPage === index" class="ml-auto flex items-center space-x-1">
                                    <div class="w-1 h-5 bg-[#0075FF] rounded-full"></div>
                                </div>
                            </div>
                        </li>
                    </TransitionGroup>
                </ul>
            </div>

            <!-- Sidebar Footer -->
            <div class="mt-auto pt-4 border-t border-white/10">
                <div
                    class="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                    <div
                        class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0075FF] to-[#00A3FF] flex items-center justify-center text-white font-bold shadow-md">
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
    width: 3px;
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
    animation: pulseGlow 2s infinite alternate;
}

@keyframes pulseGlow {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 117, 255, 0);
    }

    100% {
        box-shadow: 0 0 8px 1px rgba(0, 117, 255, 0.2);
    }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

/* Hover effects */
.group:hover .group-hover\:bg-\[\#252b4a\] {
    background-color: #252b4a;
}

.group:hover .group-hover\:text-white {
    color: white;
}
</style>