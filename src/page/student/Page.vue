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
            <div class="mb-4">
                <h3 class="text-4xl max-md:text-2xl font-extrabold text-gray-700 dark:text-white ">O'quvchilar</h3>
            </div>
            <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                + Qo'shish
            </button>
        </div>

        <div class="overflow-x-auto w-full">
            <table class="w-full min-w-max text-sm shadow-md sm:rounded-lg text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th class="px-2 text-white py-3">O'quvchi</th>
                        <th class="px-2 text-white py-3">Telefon raqami</th>
                        <th class="px-2 text-white py-3">Boshlagan sana</th>
                        <th class="px-2 text-white py-3">Harakatlar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in fetchFulstudent" :key="index"
                        class="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900 bg-blue-950 text-gray-900 dark:text-white">



                        <td class="px-2 py-4 flex items-center  gap-2 whitespace-nowrap">
                            <img class="w-12 h-12 rounded-full border border-white"
                                src="https://i.pinimg.com/236x/4e/22/be/4e22beef6d94640c45a1b15f4a158b23.jpg"
                                alt="User">
                            <span class="font-bold"> {{ student.full_name }} </span>
                        </td>

                        <td class="px-2 py-4 whitespace-nowrap text-gray-400"> {{ student.phone_number }} </td>
                        <td class="px-2 py-4 whitespace-nowrap text-gray-400"> {{ student.started_date }} </td>

                        <td class="px-2 py-4    ">
                            <div class="flex gap-4 ">
                                <img src="../../assets/icon/edit.svg" alt="edit_icon" class="w-5 h-5 cursor-pointer"
                                    @click="editStudent(student)">
                                <img src="../../assets/icon/trash.svg" alt="delete_icon" class="w-5 h-5 cursor-pointer"
                                    @click="removeStudent(student.id)">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 class="text-xl font-bold mb-4">Yangi o'quvchi qo'shish</h2>
            <input v-model="newStudent.full_name" type="text" placeholder="Ism"
                class="border p-2 rounded w-full mb-3" />
            <input v-model="newStudent.phone_number" type="text" placeholder="Telefon raqam"
                class="border p-2 rounded w-full mb-3" />
            <div class="flex justify-end space-x-2">
                <button @click="isModalOpen = false" class="bg-gray-400 text-white px-4 py-2 rounded">Bekor
                    qilish</button>
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
                <button @click="isEditModalOpen = false" class="bg-gray-400 text-white px-4 py-2 rounded">Bekor
                    qilish</button>
                <button @click="updateStudentData" class="bg-blue-500 text-white px-4 py-2 rounded">Saqlash</button>
            </div>
        </div>
    </div>
</template>
