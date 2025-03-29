<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchFullstudent, addUser, deleteStudent } from "./services";
import api from '@/service/apiService';

const fetchFulstudent = ref<any[]>([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedStudent = ref<any | null>(null);
const isLoading = ref(true);
const searchQuery = ref("");

const groupId = ref<number | null>(parseInt(localStorage.getItem("group_id") || "0", 10) || null);

const newStudent = ref({
    full_name: "",
    phone_number: "",
    group_id: groupId.value,
    started_date: new Date().toISOString().split("T")[0],
});

const filteredStudents = computed(() => {
    if (!searchQuery.value) return fetchFulstudent.value;

    return fetchFulstudent.value.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
        
    );
    
});

onMounted(async () => {
    try {
        isLoading.value = true;
        fetchFulstudent.value = await fetchFullstudent();
    } catch (error) {
        console.log(error);
    } finally {
        isLoading.value = false;
    }
});

const addStudent = async () => {
    if (newStudent.value.full_name && newStudent.value.phone_number) {
        try {
            const response = await addUser(newStudent.value);
            fetchFulstudent.value = await fetchFullstudent();
            
        } catch (error) {
            console.error(error);
        }
        isModalOpen.value = false;
        newStudent.value.full_name = "";
        newStudent.value.phone_number = "";
    }
};

const removeStudent = async (id: number) => {
    const confirmDelete = confirm("Haqiqatan ham ushbu talabani o'chirmoqchimisiz?");
    if (!confirmDelete) return;

    try {
        const result = await deleteStudent(id);
        if (result) {
            fetchFulstudent.value = await fetchFullstudent();
            alert("Talaba muvaffaqiyatli o'chirildi!");
        }
    } catch (error) {
        console.error(error);
    }
};

const editStudent = (student: any) => {
    selectedStudent.value = { ...student };
    isEditModalOpen.value = true;
    // console.log("Student tanlagan ID" + selectedStudent.value.id);
};

const updateStudentData = async () => {
    if (!selectedStudent.value) return;

    const updatedData = {
        full_name: selectedStudent.value.full_name || "",
        group_id: selectedStudent.value.group_id || 0,
        phone_number: (selectedStudent.value.phone_number || ""),
        started_date: selectedStudent.value.started_date || "",
    };

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
        // console.log("Serverdan javob:", response.data);
    } catch (error) {
        console.error(error);
    }
};

const closeModal = () => {
    isModalOpen.value = false;
    newStudent.value.full_name = "";
    newStudent.value.phone_number = "";
};

const closeEditModal = () => {
    isEditModalOpen.value = false;
    selectedStudent.value = null;
};
</script>

<template>
    <div class="p-6 rounded-xl max-w-[1400px] mx-auto bg-gradient-to-br from-[#060b26] to-[#1a1f37] shadow-2xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-700 pb-4 mb-6">
            <div class="mb-4 md:mb-0">
                <h3 class="text-3xl font-bold text-white">O'quvchilar</h3>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Qidirish..."
                        class="bg-[#111633] text-white px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <button @click="isModalOpen = true"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Qo'shish
                </button>
            </div>
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="filteredStudents.length === 0" class="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-4 text-xl font-medium text-white">O'quvchilar topilmadi</h3>
            <p class="mt-2 text-gray-400">Yangi o'quvchi qo'shish uchun "Qo'shish" tugmasini bosing</p>
        </div>

        <div v-else class="overflow-x-auto scrollbar-container rounded-xl">
            <table class="w-full min-w-[800px] text-sm shadow-lg rounded-xl text-left">
                <thead class="bg-[#111633] text-gray-300 uppercase text-xs">
                    <tr>
                        <th class="px-6 py-4 rounded-tl-xl">O'quvchi</th>
                        <th class="px-6 py-4">Telefon raqami</th>
                        <th class="px-6 py-4">Boshlagan sana</th>
                        <th class="px-6 py-4 rounded-tr-xl">Harakatlar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, index) in filteredStudents" :key="index"
                        class="border-b border-gray-800 hover:bg-[#111633] transition-colors duration-200">
                        <td class="px-6 py-4 flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                {{ student.full_name.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="font-medium text-white">{{ student.full_name }}</p>
                               
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-300">{{ student.phone_number }}</td>
                        <td class="px-6 py-4 text-gray-300">{{ student.started_date }}</td>
                        <td class="px-6 py-4">
                            <div class="flex gap-3">
                                <button @click="editStudent(student)"
                                    class="p-2 rounded-lg bg-[#1a1f37] hover:bg-blue-600 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="removeStudent(student.id)"
                                    class="p-2 rounded-lg bg-[#1a1f37] hover:bg-red-600 transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add Student Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" @click="closeModal"></div>
        <div class="bg-[#111633] p-6 rounded-xl shadow-2xl w-full max-w-md relative z-10 transform transition-all">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-white">Yangi o'quvchi qo'shish</h2>
                <button @click="closeModal" class="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">To'liq ism</label>
                    <input v-model="newStudent.full_name" type="text" placeholder="Ism va familiya"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Telefon raqami</label>
                    <input v-model="newStudent.phone_number" type="text" placeholder="+998 XX XXX XX XX"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Boshlagan sana</label>
                    <input v-model="newStudent.started_date" type="date"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button @click="closeModal"
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                    Bekor qilish
                </button>
                <button @click="addStudent"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                    Qo'shish
                </button>
            </div>
        </div>
    </div>

    <!-- Edit Student Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" @click="closeEditModal"></div>
        <div class="bg-[#111633] p-6 rounded-xl shadow-2xl w-full max-w-md relative z-10 transform transition-all">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-white">O'quvchini tahrirlash</h2>
                <button @click="closeEditModal" class="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="space-y-4" v-if="selectedStudent">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">To'liq ism</label>
                    <input v-model="selectedStudent.full_name" type="text" placeholder="Ism va familiya"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Telefon raqami</label>
                    <input v-model="selectedStudent.phone_number" type="text" placeholder="+998 XX XXX XX XX"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Boshlagan sana</label>
                    <input v-model="selectedStudent.started_date" type="date"
                        class="w-full px-4 py-3 bg-[#1a1f37] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button @click="closeEditModal"
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                    Bekor qilish
                </button>
                <button @click="updateStudentData"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                    Saqlash
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add smooth transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Enhanced scrollbar for better mobile experience */
.scrollbar-container {
    -webkit-overflow-scrolling: touch;
    /* Smooth scrolling on iOS */
    scrollbar-width: thin;
    /* Firefox */
}


::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #1a1f37;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #3a3f57;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #4a4f67;
}


input[type="date"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}

@media (max-width: 640px) {
    .scrollbar-container {
        margin: 0 -1rem;
       
        padding: 0 1rem;
        
        width: calc(100% + 2rem);
    }

    
    table th,
    table td {
        white-space: nowrap;
    }
}
</style>