<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getTeachers } from '@/page/teacher/servise'
import api from '@/service/apiService';
import router from '@/router';
import { useGroupStore } from '../store/groupStore';

const groupStore = useGroupStore();
const groupData = ref<{ id: number, name: string, student_count: number }[]>([]);
const teachers = ref<{ id: number, full_name: string }[]>([]);
const isModalOpen = ref(false);
const showDeleteModal = ref(false);
const selectedGroup = ref<{ id: number, name: string } | null>(null);

const newGroupName = ref("");
const selectedTeacherId = ref<number | null>(null);
const coursePrice = ref<number | null>(null);
const coursePeriod = ref<number | null>(null);



const showUpdateModal = ref(false);

const openUpdateModal = (group: { id: number, name: string, price: number, period: number, course_id: number, teacher_id: number }) => {
    selectedGroup.value = group;
    newGroupName.value = group.name;
    coursePrice.value = group.price;
    coursePeriod.value = group.period;
    selectedTeacherId.value = group.teacher_id;
    showUpdateModal.value = true;
};


onMounted(async () => {
    if (!groupStore.selectedGroupId) {
        console.warn("Tanlangan kurs ID mavjud emas.");
        return;
    }

    try {
        [teachers.value, groupData.value] = await Promise.all([
            getTeachers(),
            api.get(`group/get?course_id=${groupStore.selectedGroupId}`, { withCredentials: true }).then(res => res.data)
        ]);
        console.log("Group data", groupData.value);
        console.log("Teachers", teachers.value);
    } catch (error) {
        console.error("Xatolik:", error);
    }
});

const selectGroup = (group: { id: number }) => {
    localStorage.setItem("groupId", group.id.toString());
    router.push('/group/course/students');
};

const addGroup = async () => {
    const groupData = JSON.stringify({
        name: newGroupName.value.trim(),
        period: Number(coursePeriod.value),
        price: Number(coursePrice.value),
        course_id: Number(groupStore.selectedGroupId),
        teacher_id: Number(selectedTeacherId.value)
    });

    try {
        const response = await api.post('/group/create', groupData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("Guruh yaratildi:", response.data);
    } catch (error) {
        console.error("Guruh yaratishda xatolik yuz berdi:", error);

    }
    window.location.reload();
};


const openDeleteModal = (group: { id: number, name: string }) => {
    selectedGroup.value = group;
    showDeleteModal.value = true;
};

const confirmDelete = async () => {
    if (!selectedGroup.value) return;

    try {
        await api.delete(`group/delete?ident=${selectedGroup.value.id}`, { withCredentials: true });
        console.log("Guruh o‘chirildi:", selectedGroup.value.name);
        showDeleteModal.value = false;
    } catch (error) {
        console.error("Guruhni o‘chirishda xatolik yuz berdi:", error);
    }
    window.location.reload();
};


const prepareItem = (item) => ({
    ...item,
    price: item.price || 0,
    period: item.period || 0,
    course_id: item.course_id || 0,
    teacher_id: item.teacher_id || 0
});
const updateGroup = async () => {
    if (!selectedGroup.value || !groupStore.selectedGroupId) return;

    const updatedData = JSON.stringify({
        name: newGroupName.value.trim(),
        period: Number(coursePeriod.value),
        price: Number(coursePrice.value),
        course_id: Number(groupStore.selectedGroupId),
        teacher_id: Number(selectedTeacherId.value),
        group_id: Number(selectedGroup.value.id) 
    });

    try {
        const response = await api.put(`group/update?ident=${selectedGroup.value.id}`, updatedData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("Guruh yangilandi:", response.data);
        showUpdateModal.value = false; // Modalni yopish
        window.location.reload(); // Sahifani yangilash
    } catch (error) {
        console.error("Guruhni yangilashda xatolik:", error);
    }
};

</script>

<template>
    <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
        class="p-4 rounded-md max-w-[1400px] mx-auto">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">
                    Guruhlar
                </h3>
            </div>
            <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                + Qo'shish
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

            <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                v-for="(item, index) in groupData" :key="index"
                class="relative flex gap-4 items-center p-4 rounded-xl bg-gray-800 cursor-pointer">

                <div @click="selectGroup(item)">
                    <p class="text-white text-xl font-bold">{{ item.name }}</p>
                    <p class="text-white text-md font-bold">O'quvchilar soni: {{ item.student_count }}</p>
                </div>


                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex-col  gap-2">
                    <img src="../../../assets/icon/edit.svg" alt="edit_icon" class="w-5 h-5 mb-2 cursor-pointer"
                        @click="openUpdateModal(prepareItem(item))">
                    <img src="../../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5 cursor-pointer"
                        @click="openDeleteModal(item)">

                </div>
            </div>
        </div>


        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-50">
            <div class="bg-slate-900 p-6 rounded-lg shadow-lg w-80">
                <h2 class="text-lg font-semibold text-white">O'chirish </h2>
                <p class="text-white mt-2">"{{ selectedGroup?.name }}" guruhini o‘chirishni tasdiqlang.</p>

                <div class="flex justify-end gap-3 mt-4">
                    <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 rounded-lg">Bekor
                        qilish</button>
                    <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-lg">O‘chirish</button>
                </div>
            </div>
        </div>


        <div v-if="showUpdateModal" class="fixed inset-0 bg-black/90 flex items-center justify-center">
            <div class="bg-slate-800 p-6 rounded-lg shadow-lg w-[400px]">
                <h2 class="text-xl text-white font-bold mb-4">Guruhni tahrirlash</h2>

                <input v-model="newGroupName" type="text" placeholder="Guruh nomi"
                    class="w-full border text-white border-gray-300 rounded-md p-2 mb-4" />

                <input v-model="coursePrice" type="number" placeholder="Narx"
                    class="w-full border text-white border-gray-300 rounded-md p-2 mb-4" />

                <input v-model="coursePeriod" type="number" placeholder="Davomiylik (oy)"
                    class="w-full border text-white border-gray-300 rounded-md p-2 mb-4" />

                <div class="flex justify-end gap-2">
                    <button @click="showUpdateModal = false" class="px-4 py-2 bg-gray-300 rounded-md">Bekor
                        qilish</button>
                    <button @click="updateGroup" class="px-4 py-2 bg-blue-500 text-white rounded-md">Yangilash</button>
                </div>
            </div>
        </div>


        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center">
            <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                class=" p-6 rounded-lg shadow-lg w-[400px]">
                <h2 class="text-xl text-white font-bold mb-4">Yangi guruh qo'shish</h2>

                <input v-model="newGroupName" type="text" placeholder="Guruh nomini kiriting"
                    class="text-white w-full border border-gray-300 rounded-md p-2 mb-4" />

                <select v-model="selectedTeacherId" class="w-full border border-gray-300 rounded-md p-2 mb-4">
                    <option class="text-white" value="" disabled>O'qituvchini tanlang</option>
                    <option class="text-white bg-black/80" v-for="teacher in teachers" :key="teacher.id"
                        :value="teacher.id">
                        {{ teacher.full_name }}
                    </option>
                </select>

                <input v-model="coursePrice" type="number" placeholder="Narxni kiriting"
                    class="w-full border text-white border-gray-300 rounded-md p-2 mb-4" />

                <input v-model="coursePeriod" type="number" placeholder="Dars davomiyligini kiriting (oylarda)"
                    class="w-full border text-white border-gray-300 rounded-md p-2 mb-4" />

                <div class="flex justify-end gap-2">
                    <button @click="isModalOpen = false" class="px-4 py-2 bg-gray-300 rounded-md">Bekor qilish</button>
                    <button @click="addGroup" class="px-4 py-2 bg-blue-500 text-white rounded-md">Qo'shish</button>
                </div>
            </div>
        </div>

    </div>
</template>
