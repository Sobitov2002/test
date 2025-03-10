<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { profilUpdate, profilImageUpdate } from '../servise';

const props = defineProps(['profilData']);
const emit = defineEmits(['profileUpdated']);

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const selectedFile = ref<File | null>(null);
const uploadedImageUrl = ref<string | null>(null); // Yuklangan rasm URL

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
        uploadedImageUrl.value = null; // Yangi rasm tanlanganda avvalgi URLni tozalash
    }
};

const uploadFile = async () => {
    if (!selectedFile.value) {
        alert("Iltimos, rasm tanlang!");
        return;
    }

    try {
        const result = await profilImageUpdate(selectedFile.value);
        console.log("Natija:", result);

        uploadedImageUrl.value = result.imageUrl; // Serverdan qaytgan URLni saqlash
        successMessage.value = "Rasm muvaffaqiyatli yuklandi!";
    } catch (error) {
        console.error("Rasm yuklashda xatolik:", error);
        errorMessage.value = "Rasm yuklashda xatolik yuz berdi!";
    }
};

const saveProfileImage = async () => {
    if (!uploadedImageUrl.value) {
        alert("Avval rasm yuklang!");
        return;
    }

    try {
        props.profilData.image = uploadedImageUrl.value; // Profilga yangi rasmni qo‘shish
        await profilUpdate(props.profilData);
        successMessage.value = "Rasm muvaffaqiyatli saqlandi!";
        emit('profileUpdated');
    } catch (error) {
        errorMessage.value = "Rasmni saqlashda xatolik yuz berdi!";
        console.error("Rasmni saqlashda xatolik:", error);
    }
};
const updateProfile = async () => {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';
    window.location.reload();
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
    <div class="text-white w-[450px]">
        <h2 class="text-white">Profilni Tahrirlash</h2>
        <div class="profile-info space-y-4">

            <div>
                <label class="block text-gray-300 font-medium mb-1">Ism</label>
                <input v-model="props.profilData.full_name" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Ismingizni kiriting" />
            </div>
            <div>
                <label class="block text-gray-300 font-medium mb-1">Telefon</label>
                <input v-model="props.profilData.phone" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+998901234567" />
            </div>

            <div class="flex flex-col items-start gap-4">
                <label for="file-upload"
                    class="cursor-pointer text-black border-2 border-dashed border-gray-300 rounded-sm bg-gray-100 hover:bg-gray-200 transition px-4 py-2">
                    Rasm tanlang
                </label>
                <input id="file-upload" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />

                <button v-if="selectedFile" @click="uploadFile"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    Yuklash
                </button>

                <button v-if="uploadedImageUrl" @click="saveProfileImage"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Saqlash
                </button>

                <img v-if="uploadedImageUrl" :src="uploadedImageUrl" alt="Yuklangan rasm"
                    class="w-20 h-20 rounded-full border mt-2">
            </div>

        </div>
        <button class="p-2 mt-4 rounded-md bg-blue-600" @click="updateProfile" :disabled="loading">
            {{ loading ? "Yuklanmoqda..." : "Profilni yangilash" }}
        </button>
        <p v-if="successMessage" class="success text-green-400">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error text-red-400">{{ errorMessage }}</p>
    </div>
</template>
