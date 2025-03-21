<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebarStore';


const sidebarStore = useSidebarStore();
const route = useRoute();
const router = useRouter();

// Sidebar'ni ochish / yopish
const toggleSidebar = () => {
    sidebarStore.isOpen = !sidebarStore.isOpen;
};

// Tokenni olish
const token = ref<string | null>(localStorage.getItem('token'));

// Foydalanuvchi ma'lumotlari
const user = reactive({
    name: 'Foydalanuvchi',
    avatar: 'https://i.pravatar.cc/100'
});

// Dropdown menyuni boshqarish
const menuOpen = ref(false);
const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

// Login funksiyasi
const loginHandler = () => {
    router.push('/login');
};

// Logout funksiyasi
const logoutHandler = () => {
    localStorage.removeItem('token'); // Tokenni tozalash
    token.value = null; // Vue state'ni yangilash
    console.log("Chiqildi");
};

// Foydalanuvchi ma'lumotlarini token bilan bog‘lash
watchEffect(() => {
    if (token.value) {
        // Token mavjud bo‘lsa, foydalanuvchi ma'lumotlarini yuklash (dummy ma'lumot)
        user.name = "John Doe";
        user.avatar = "https://i.pravatar.cc/100";
    }
});
</script>

<template>
    <header
        class="rounded-2xl fixed lg:left-0 right-0 mb-2 w-full bg-slate-900 md:bg-transparent text-white py-4 px-6 flex items-center justify-between z-50">

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
        <div>
            <div v-if="token" class="relative">
                <!-- User Menu -->
                <div @click="toggleMenu"
                    class="flex items-center cursor-pointer border border-gray-600 rounded-full p-2">
                    <img class="w-10 h-10 rounded-full" :src="user.avatar" alt="User Avatar" />
                    <p class="text-white ml-2">{{ user.name }}</p>
                </div>

                <!-- Dropdown Menu -->
                <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                    <ul class="py-2 text-white">
                        <li @click="profileHandler" class="px-4 py-2 hover:bg-gray-700 cursor-pointer">Profil</li>
                        <li @click="logoutHandler" class="px-4 py-2 hover:bg-gray-700 cursor-pointer">Chiqish</li>
                    </ul>
                </div>
            </div>

            <!-- Kirish tugmasi -->
            <div v-else class="grid grid-cols-1 border rounded-2xl items-center px-2 max-w-md ml-auto">
                <div @click="loginHandler" class="flex gap-2 items-center cursor-pointer">
                    <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="text-white px-2 py-1">Kirish</p>
                </div>
            </div>
        </div>
    </header>
</template>
