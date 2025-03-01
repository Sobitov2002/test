<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebarStore';
import Saidbar from '@/components/Saidbar.vue';

const sidebarStore = useSidebarStore();
</script>

<template>
  <div class=" myBg">
    <Saidbar />
    <main class="p-4 max-sm:p-0 max-sm:pt-14 lg:ml-64 min-h-screen h-auto pt-20" @click="sidebarStore.closeSidebar">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.myBg {
  background-image: url('https://ik.imagekit.io/vtroph5l9/itechIcademy/Background%20(1).png?updatedAt=1740843847182');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
}
</style>

