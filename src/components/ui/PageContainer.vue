<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    }
})
</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class=" p-4 rounded-md max-w-[1400px] mx-auto max-sm:p-2 max-sm:min-h-[100vh] max-sm:rounded-none">
        <div>
            <h3 class="text-4xl font-extrabold  text-white max-sm:text-2xl">{{ props.title }}</h3>
            <p class="text-sm text-white text-muted-foreground">
                {{ props.subtitle }}
            </p>
            <div class="block mt-1 h-[1px] bg-slate-300 w-full"></div>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>