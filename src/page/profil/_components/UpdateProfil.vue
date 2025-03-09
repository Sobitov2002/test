<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { profilUpdate } from '../servise';

const props = defineProps(['profilData']);
const emit = defineEmits(['profileUpdated']);

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');


const updateProfile = async () => {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    try {
        await profilUpdate(props.profilData);
        successMessage.value = "Profil muvaffaqiyatli yangilandi!";
        emit('profileUpdated');
    } catch (error) {
        errorMessage.value = "Xatolik yuz berdi! Qayta urinib ko'ring.";
        console.error("Profilni yangilashda xatolik:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="text-white">
        <h2 class="text-white">Profilni Tahrirlash</h2>
        <div class="profile-info space-y-4">

            <div>
                <label class="block text-gray-600 font-medium mb-1">Ism</label>
                <input v-model="props.profilData.full_name" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Ismingizni kiriting" />
            </div>
            <div>
                <label class="block text-gray-600 font-medium mb-1">Telefon</label>
                <input v-model="props.profilData.phone" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+998901234567" />
            </div>

           
        </div>
        <button class="p-2 mt-4 rounded-md bg-blue-600" @click="updateProfile" :disabled="loading">
            {{ loading ? "Yuklanmoqda..." : "Profilni yangilash" }}
        </button>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<style scoped>

</style>
