<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllGroup, createCourse } from './servise';
import { useGroupStore } from './store/groupStore';
import api from '@/service/apiService';

const router = useRouter();
const groupData = ref<any[]>([]);
const groupStore = useGroupStore();
const isModalOpen = ref(false);
const courseName = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const newCourseId = ref<number | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const showDeleteModal = ref(false);
const selectedCourseId = ref<number | null>(null);

onMounted(async () => {
    try {
        groupData.value = await getAllGroup();
    } catch (error) {
        console.error('Guruhlarni yuklashda xatolik:', error);
    }
});

const goToGroupCourse = (id: number) => {
    groupStore.setSelectedGroup(id);
    localStorage.setItem('selectedGroupId', id.toString());
    router.push('/group/course');
};

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        selectedFile.value = target.files[0];
    }
};

const createNewCourse = async () => {
    if (!courseName.value.trim()) return;
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const newCourse = await createCourse(courseName.value);
        if (newCourse && newCourse.id) {
            newCourseId.value = newCourse.id;
            courseName.value = '';

            if (selectedFile.value) {
                await uploadCourseImage(newCourse.id);
            }

            groupData.value = await getAllGroup();
            isModalOpen.value = false; // Modalni yopish
        } else {
            errorMessage.value = 'Kurs yaratishda xatolik yuz berdi.';
        }
    } catch (error) {
        errorMessage.value = 'Kurs yaratishda server xatosi.';
        console.error('Kurs yaratishda xatolik:', error);
    } finally {
        isLoading.value = false;
    }
};

const uploadCourseImage = async (courseId: number) => {
    if (!selectedFile.value) return;
    isUploading.value = true;
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    try {
        await api.post(`/course/upload-image?ident=${courseId}`, formData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            }
        });
    } catch (error) {
        console.error("Rasm yuklashda xatolik:", error);
    } finally {
        isUploading.value = false;
    }
};


const openDeleteModal = (id: number) => {
    selectedCourseId.value = id;
    localStorage.setItem('selectedCourseId', id.toString());
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    if (!selectedCourseId.value) return;
    try {
        await api.delete(`/course/delete?ident=${selectedCourseId.value}`);
        groupData.value = await getAllGroup();
        showDeleteModal.value = false;
    } catch (error) {
        console.error("Kursni o‘chirishda xatolik:", error);
    }
};
</script>

<template>
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">Guruhlar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha guruhlar</p>
            </div>
            <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">+
                Qo'shish</button>
        </div>

        <div class="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            <div v-for="(item, index) in groupData" :key="index"
                class="flex-col gap-4 cursor-pointer items-center p-4 rounded-xl bg-gray-800"
                @click="goToGroupCourse(item.id)">
                <img class="h-[250px] rounded-xl" :src="'https://iteachsystem.uz/images/' + item.image"
                    :alt="item.name">
                <div class="flex items-center justify-between">
                    <p class="text-white flex items-center gap-4 text-xl font-bold">{{ item.name }}</p>
                    <img @click.stop="openDeleteModal(item.id)" class="w-5 h-5 cursor-pointer"
                        src="../../assets/icon/trash.svg" alt="O‘chirish">
                </div>
            </div>
        </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/60">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg font-semibold mb-4">Yangi kurs yaratish</h2>

            <input v-model="courseName" type="text" placeholder="Kurs nomi" class="w-full p-2 border rounded-md mb-4" />

            <input type="file" @change="handleFileUpload" class="w-full p-2 border rounded-md mb-4" />

            <div class="flex justify-end gap-3">
                <button @click="isModalOpen = false" class="px-4 py-2 bg-gray-300 rounded-lg">
                    Bekor qilish
                </button>
                <button @click="createNewCourse" :disabled="isLoading"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {{ isLoading ? 'Yaratilmoqda...' : "Yaratish" }}
                </button>
            </div>
        </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-50">
        <div class="bg-slate-900 p-6 rounded-lg shadow-lg w-80">
            <h2 class="text-lg font-semibold text-white">O'chirish</h2>
            <p class="text-white mt-2">Tanlangan kursni o‘chirishni tasdiqlang.</p>
            <div class="flex justify-end gap-3 mt-4">
                <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">Bekor qilish</button>
                <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg">O‘chirish</button>
            </div>
        </div>
    </div>
</template>
