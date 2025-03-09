<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
    show: boolean;
    itemName: string;
}>();

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 class="text-lg font-semibold text-gray-800">Tasdiqlash</h2>
            <p class="mt-2 text-gray-600">Siz rostdan ham <strong>{{ itemName }}</strong> o‘chirmoqchimisiz?</p>

            <div class="mt-4 flex justify-end gap-3">
                <button @click="emit('cancel')" class="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                    Bekor qilish
                </button>
                <button @click="emit('confirm')" class="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                    O‘chirish
                </button>
            </div>
        </div>
    </div>
</template>
