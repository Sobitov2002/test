<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebarStore';
const sidebarStore = useSidebarStore();
import Saidbar from '@/components/Saidbar.vue'
</script>
<template>
    <div class="antialiased  myBg ">
        <Saidbar />
        <main class="p-4 max-sm:p-0 max-sm:pt-14 lg:ml-64 min-h-screen h-auto pt-20" @click="sidebarStore.closeSidebar">
            <RouterView />
        </main>
    </div>
</template>
