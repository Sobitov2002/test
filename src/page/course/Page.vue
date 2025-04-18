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
const previewImage = ref<string | null>(null);
const isSkeletonLoading = ref(true); // Added skeleton loading state

onMounted(async () => {
    try {
        // Load data
        groupData.value = await getAllGroup();

        // Show skeleton for 1 second regardless of how fast the data loads
        setTimeout(() => {
            isSkeletonLoading.value = false;
        }, 300);
    } catch (error) {
        console.error('Guruhlarni yuklashda xatolik:', error);
        isSkeletonLoading.value = false; // Make sure to hide skeleton on error too
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
        // Create preview for selected image
        previewImage.value = URL.createObjectURL(target.files[0]);
    }
};

const createNewCourse = async () => {
    if (!courseName.value.trim()) {
        errorMessage.value = 'Kurs nomini kiriting';
        return;
    }

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
            isModalOpen.value = false;

            // Reset preview
            if (previewImage.value) {
                URL.revokeObjectURL(previewImage.value);
                previewImage.value = null;
            }
            selectedFile.value = null;
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
        console.error("Kursni o'chirishda xatolik:", error);
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    errorMessage.value = '';
    courseName.value = '';

    // Clean up preview
    if (previewImage.value) {
        URL.revokeObjectURL(previewImage.value);
        previewImage.value = null;
    }
    selectedFile.value = null;
};
</script>

<template>
    <div
        class="container p-6 rounded-xl max-w-[1400px] mx-auto bg-gradient-to-br from-[#060b26] to-[#1a1f37] shadow-2xl">
        <div class="flex justify-between items-center border-b border-gray-700/50 pb-4 mb-6">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-white">
                    <span class="bg-clip-text text-white">Guruhlar</span>
                </h3>
            </div>
            <button @click="isModalOpen = true"
                class="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Qo'shish
            </button>
        </div>

        <!-- Skeleton Loading -->
        <div v-if="isSkeletonLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 4" :key="'skeleton-' + i"
                class="group relative overflow-hidden rounded-xl bg-gray-800/60 border border-gray-700/30 animate-pulse">
                <div class="relative h-[200px] overflow-hidden bg-gray-700/50"></div>
                <div class="p-4">
                    <div class="h-6 bg-gray-700/70 rounded w-3/4"></div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="groupData.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-xl">Hozircha guruhlar mavjud emas</p>
            <button @click="isModalOpen = true" class="mt-4 text-blue-400 hover:text-blue-300 underline">Yangi guruh
                yaratish</button>
        </div>

        <!-- Actual content -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="(item, index) in groupData" :key="index"
                class="group relative overflow-hidden rounded-xl bg-gray-800/60 hover:bg-gray-700/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700/30 hover:border-blue-500/30">

                <!-- Card content -->
                <div @click="goToGroupCourse(item.id)" class="cursor-pointer">
                    <div class="relative h-[200px] overflow-hidden">
                        <img class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            :src="'https://iteachsystem.uz/images/' + item.image" :alt="item.name">
                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    </div>

                    <div class="p-4">
                        <p class="text-white text-xl font-bold truncate">{{ item.name }}</p>
                    </div>
                </div>

                <!-- Delete button -->
                <button @click.stop="openDeleteModal(item.id)"
                    class="absolute top-3 right-3 bg-gray-900/70 hover:bg-red-600 p-2 rounded-full transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Create Course Modal -->
    <div v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
        <div class="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/50 transform transition-all duration-300"
            :class="{ 'scale-100 opacity-100': isModalOpen, 'scale-95 opacity-0': !isModalOpen }">

            <div class="flex justify-between items-center mb-5">
                <h2 class="text-xl font-bold text-white">Yangi kurs yaratish</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                {{ errorMessage }}
            </div>

            <div class="space-y-4">
                <div>
                    <label for="courseName" class="block text-sm font-medium text-gray-300 mb-1">Kurs nomi</label>
                    <input id="courseName" v-model="courseName" type="text" placeholder="Kurs nomini kiriting"
                        class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Kurs rasmi</label>
                    <div class="relative">
                        <input type="file" @change="handleFileUpload" class="hidden" id="fileInput" accept="image/*" />
                        <label for="fileInput"
                            class="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-lg cursor-pointer transition-colors"
                            :class="{ 'h-32': !previewImage, 'h-auto': previewImage }">
                            <div v-if="!previewImage" class="text-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>Rasm tanlash uchun bosing</p>
                            </div>
                            <img v-else :src="previewImage" class="max-h-48 rounded-lg object-contain" />
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button @click="closeModal"
                    class="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    Bekor qilish
                </button>
                <button @click="createNewCourse" :disabled="isLoading"
                    class="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isLoading ? 'Yaratilmoqda...' : "Yaratish" }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
        <div class="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700/50 transform transition-all duration-300"
            :class="{ 'scale-100 opacity-100': showDeleteModal, 'scale-95 opacity-0': !showDeleteModal }">

            <div class="text-center mb-4">
                <div
                    class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-white">Kursni o'chirish</h2>
                <p class="text-gray-400 mt-2">Tanlangan kursni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
                </p>
            </div>

            <div class="flex justify-center gap-3 mt-6">
                <button @click="showDeleteModal = false"
                    class="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    Bekor qilish
                </button>
                <button @click="confirmDelete"
                    class="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-medium transition-all">
                    O'chirish
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.container {
    animation: fadeIn 0.5s ease-out;
}

.grid>div {
    animation: slideUp 0.5s ease-out;
    animation-fill-mode: both;
}

.grid>div:nth-child(1) {
    animation-delay: 0.1s;
}




@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 0.3;
    }
}

.animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>