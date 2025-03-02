<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const formatPath = (path: string) => {
    if (path === '/') return "Bosh sahifa";
    return path
        .split('/')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' > ');
};

const headerPusher = () => {
    router.push('/')
};
</script>

<template>
    <div class="p-4 rounded-lg">
        <p class="text-gray-700 font-bold dark:text-gray-300 text-sm">
            <span @click="headerPusher()" class="text-gray-500 cursor-pointer">Current Path /</span>
            <span class="font-bold p-1 rounded-md">
                {{ formatPath(route.path) }}
            </span>
        </p>


        <p class="font-bold cursor-pointer ">
            {{ formatPath(route.path) }}
        </p>
    </div>
</template>
