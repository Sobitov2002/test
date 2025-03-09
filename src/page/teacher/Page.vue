<script setup lang="ts">
import PageContainer from '@/components/ui/PageContainer.vue';
import Teacher from './_components/Teacher.vue';
</script>
<template>
    <PageContainer title="O'qituvchilar" subtitle="O'quv markazdagi barcha ustozlar !">
        <div class="mt-4">
            <Teacher />
        </div>
    </PageContainer>

</template>