<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>
<template>
    <div class="antialiased  flex items-center justify-center min-h-screen login-bg">
        <RouterView />
    </div>
</template>

<style scoped>
.login-bg {
    background-image: url(https://ik.imagekit.io/vtroph5l9/Product/Dina_5.png?updatedAt=1739558302118);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>