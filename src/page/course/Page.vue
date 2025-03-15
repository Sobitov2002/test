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

onMounted(async () => {
    try {
        groupData.value = await getAllGroup();
    } catch (error) {
        console.error('Guruhlarni yuklashda xatolik:', error);
    }
});

const goToGroupCourse = (id: number) => {
    groupStore.setSelectedGroup(id);
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
            newCourseId.value = newCourse.id; // ✅ Kurs ID ni saqlaymiz
            courseName.value = '';
            groupData.value = await getAllGroup();
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

const uploadCourseImage = async () => {
    if (!selectedFile.value || !newCourseId.value) {
        alert("Fayl tanlanmagan yoki kurs ID mavjud emas!");
        return;
    }

    isUploading.value = true;
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    try {
        const response = await api.post(`/course/upload-image?ident=${newCourseId.value}`, formData, {
            headers: {
                
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            }
        });

        isModalOpen.value = false;
    } catch (error) {
        console.error(" Rasm yuklashda xatolik:", error);
        
    } finally {
        isUploading.value = false;
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    courseName.value = '';
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
            <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                + Qo'shish
            </button>
        </div>

        <div class="grid grid-cols-5 gap-4">
            <div v-for="(item, index) in groupData" :key="index"
                class="flex-col gap-4 cursor-pointer items-center p-4 rounded-xl bg-gray-800"
                style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                @click="goToGroupCourse(item.id)">
                <div>
                    <img class="h-[250px] rounded-xl" :src="'https://iteachsystem.uz/images/' + item.image"
                        :alt="item.name">
                </div>
                <div>
                    <p class="text-white flex items-center gap-4 text-xl font-bold">
                        {{ item.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/55 bg-opacity-20"
        @click.self="closeModal">
        <div class="bg-slate-900 p-6 rounded-lg shadow-lg w-96">
            <h2 class="text-lg text-white font-semibold mb-4">Ma'lumot kiriting</h2>
            <input v-model="courseName" type="text" placeholder="Kurs nomini kiriting"
                class="w-full text-white p-2 border rounded mb-4" />

            <p v-if="errorMessage" class="text-red-500 text-sm mb-2">{{ errorMessage }}</p>

            <div class="flex justify-end space-x-2">
                <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded">Bekor qilish</button>
                <button @click="createNewCourse" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="isLoading">
                    {{ isLoading ? 'Yuborilmoqda...' : 'Yuborish' }}
                </button>
            </div>

            <div v-if="newCourseId" class="mt-4 p-2 bg-gray-100 rounded">
                <p class="text-sm text-gray-700">Kurs ID: <span class="font-semibold">{{ newCourseId }}</span></p>
                <input type="file" @change="handleFileUpload" accept="image/*" class="mt-2 w-full p-2 border rounded" />
                <button @click="uploadCourseImage" class="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                    :disabled="!selectedFile || isUploading">
                    {{ isUploading ? 'Yuklanmoqda...' : 'Rasm yuklash' }}
                </button>
            </div>
        </div>
    </div>
</template>
