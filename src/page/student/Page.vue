<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchFullstudent, addUser, deleteStudent, } from "./services";
import api from '@/service/apiService';

const fetchFulstudent = ref<any[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedStudent = ref<any | null>(null);

const groupId = ref<number | null>(parseInt(localStorage.getItem("group_id") || "0", 10) || null);

const newStudent = ref({
    full_name: "",
    phone_number: "",
    group_id: groupId.value, 
    started_date: new Date().toISOString().split("T")[0], 
});

onMounted(async () => {
    try {
        fetchFulstudent.value = await fetchFullstudent();
    } catch (error) {
        console.log(error);
    }
});

const addStudent = async () => {
    if (newStudent.value.full_name && newStudent.value.phone_number) {
        try {
            const response = await addUser(newStudent.value);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        isModalOpen.value = false;
        newStudent.value.full_name = "";
        newStudent.value.phone_number = "";
    }
};

const removeStudent = async (id: number) => {
    const confirmDelete = confirm("Haqiqatan ham ushbu talabani o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    const result = await deleteStudent(id);
    if (result) {
        alert("Talaba muvaffaqiyatli o‘chirildi!");
    }
};

const editStudent = (student: any) => {
    selectedStudent.value = { ...student };
    isEditModalOpen.value = true;
    console.log("Student tanlagan ID"+selectedStudent.value.id);
    
};


const updateStudentData = async () => {
    if (!selectedStudent.value) return;

    const updatedData = {
        full_name: selectedStudent.value.full_name || "",
        group_id: selectedStudent.value.group_id || 0, 
        phone_number: String(selectedStudent.value.phone_number || ""),
        started_date: selectedStudent.value.started_date || "", 
    };

    console.log("Yuborilayotgan ma'lumotlar:", updatedData);

    try {
        const response = await api.put(`/student/update?ident=${selectedStudent.value.id}`,
            updatedData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        fetchFulstudent.value = await fetchFullstudent();
        isEditModalOpen.value = false;
        console.log("Serverdan javob:", response.data);
    } catch (error) {
        console.error(error);
    }
};



</script>

<template>
    <div class="p-4 rounded-md max-w-[1400px] mx-auto"
        style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);">
        <div class="flex justify-between border-b border-gray-600 mb-4">
            <div>
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white">O'quvchilar</h3>
                <p class="text-sm text-white text-muted-foreground">Barcha O'quvchilar</p>
            </div>
            <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                + Qo'shish
            </button>
        </div>

        <ul class="space-y-3">
            <li v-for="(student, index) in fetchFulstudent" :key="index" class="p-2 text-white"
                :class="{ 'border-b border-gray-600': index !== fetchFulstudent.length - 1 }">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <img class="w-12 h-12 rounded-full"
                            src="https://i.pinimg.com/236x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg" alt="User">
                        <p class="text-sm text-gray-400">ID: {{ student.id }}</p>
                        <p class="text-lg font-bold">{{ student.full_name }}</p>
                    </div>
                    <p class="text-sm text-gray-400">{{ student.phone_number }}</p>
                    <p class="text-sm text-gray-400">{{ student.started_date }}</p>
                    <div class="flex gap-4">
                        <img src="../../assets/icon/edit.svg" alt="edit_icon" class="w-5 h-5 mb-2 cursor-pointer"
                            @click="editStudent(student)">
                        <img src="../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5 cursor-pointer"
                            @click="removeStudent(student.id)">
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 class="text-xl font-bold mb-4">Yangi o'quvchi qo'shish</h2>
            <input v-model="newStudent.full_name" type="text" placeholder="Ism"
                class="border p-2 rounded w-full mb-3" />
            <input v-model="newStudent.phone_number" type="text" placeholder="Telefon raqam"
                class="border p-2 rounded w-full mb-3" />
            <div class="flex justify-end space-x-2">
                <button @click="isModalOpen = false" class="bg-gray-400 text-white px-4 py-2 rounded">Bekor qilish</button>
                <button @click="addStudent" class="bg-blue-500 text-white px-4 py-2 rounded">Qo'shish</button>
            </div>
        </div>
    </div>

    <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 class="text-xl font-bold mb-4">O'quvchini tahrirlash</h2>
            <input v-model="selectedStudent.full_name" type="text" placeholder="Ism"
                class="border p-2 rounded w-full mb-3" />
            <input v-model="selectedStudent.phone_number" type="text" placeholder="Telefon raqam"
                class="border p-2 rounded w-full mb-3" />
            <div class="flex justify-end space-x-2">
                <button @click="isEditModalOpen = false" class="bg-gray-400 text-white px-4 py-2 rounded">Bekor qilish</button>
                <button @click="updateStudentData" class="bg-blue-500 text-white px-4 py-2 rounded">Saqlash</button>
            </div>
        </div>
    </div>
</template>
