<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebarStore';
import Saidbar from '@/components/Saidbar.vue';
import Header from '@/components/header/Header.vue'
const sidebarStore = useSidebarStore();
</script>
<template>
    <div class="antialiased myBg">
        <Saidbar />
        <Header />
        <main class="p-5 max-sm:p-0 max-sm:pt-14 lg:ml-72 min-h-screen h-auto pt-20" @click="sidebarStore.closeSidebar">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.myBg {
    background-color: #0F172A;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>