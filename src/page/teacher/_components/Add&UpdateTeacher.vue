<script setup lang="ts">
import { ref, reactive } from "vue";
import api from '@/service/apiService';

interface TeacherData {
    full_name: string;
    password: string;
    email: string;
    phone_number: string;
}

interface FormState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const formState = reactive<FormState>({
    loading: false,
    success: false,
    error: null
});

const newTeacher = ref<TeacherData>({
    full_name: "",
    password: "",
    email: "",
    phone_number: ""
});

const validationErrors = reactive({
    full_name: "",
    password: "",
    email: "",
    phone_number: ""
});

const validateForm = (): boolean => {
    let isValid = true;

    // Reset validation errors
    Object.keys(validationErrors).forEach(key => {
        validationErrors[key as keyof typeof validationErrors] = "";
    });

    if (!newTeacher.value.full_name) {
        validationErrors.full_name = "Ism Familya kiritilishi shart";
        isValid = false;
    }

    if (!newTeacher.value.password) {
        validationErrors.password = "Parol kiritilishi shart";
        isValid = false;
    } else if (newTeacher.value.password.length < 6) {
        validationErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
        isValid = false;
    }

    if (!newTeacher.value.email) {
        validationErrors.email = "Email kiritilishi shart";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newTeacher.value.email)) {
        validationErrors.email = "Noto'g'ri email format";
        isValid = false;
    }

    if (!newTeacher.value.phone_number) {
        validationErrors.phone_number = "Telefon raqam kiritilishi shart";
        isValid = false;
    }

    return isValid;
};

const addTeacher = async (teacherData: TeacherData) => {
    try {
        const response = await api.post("/admistrator/create_teacher", teacherData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.log("Xatolik:", error.response?.data || error.message);
        throw error;
    }
};

const resetForm = () => {
    newTeacher.value = {
        full_name: "",
        password: "",
        email: "",
        phone_number: ""
    };
    formState.success = false;
    formState.error = null;
};

const submitTeacher = async () => {
    if (!validateForm()) {
        return;
    }

    formState.loading = true;
    formState.error = null;

    try {
        const response = await addTeacher(newTeacher.value);
        formState.success = true;
        resetForm();
    } catch (error: any) {
        formState.error = error.response?.data?.message || "O'qituvchi qo'shishda xatolik yuz berdi";
        console.log("Server javobi:", error);
    } finally {
        formState.loading = false;
    }
};
</script>

<template>
    <div class="min-h-[400px] flex items-center justify-center p-6">
        <div class="w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
            <!-- Card Header -->
            <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                class="p-6 border-b border-gray-700/30">
                <h3 class="text-2xl font-bold text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Yangi o'qituvchi qo'shish
                </h3>
            </div>

            <!-- Card Body -->
            <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
                class="p-6">
                <!-- Success Message -->
                <div v-if="formState.success" class="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-green-300 font-medium">O'qituvchi muvaffaqiyatli qo'shildi!</p>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="formState.error" class="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
                    <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        <p class="text-red-300 font-medium">{{ formState.error }}</p>
                    </div>
                </div>

                <form @submit.prevent="submitTeacher" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Full Name -->
                        <div class="space-y-2">
                            <label class="text-white text-sm font-medium flex items-center gap-1" for="full_name">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Ism Familya
                            </label>
                            <div class="relative">
                                <input id="full_name" v-model="newTeacher.full_name" type="text"
                                    placeholder="To'liq ism"
                                    class="w-full px-4 py-3 rounded-lg bg-slate-900/40 text-white border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    :class="{ 'border-red-500/50 focus:ring-red-500': validationErrors.full_name }"
                                    autocomplete="off" />
                            </div>
                            <p v-if="validationErrors.full_name" class="text-red-400 text-xs mt-1">{{
                                validationErrors.full_name }}</p>
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label class="text-white text-sm font-medium flex items-center gap-1" for="email">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email
                            </label>
                            <div class="relative">
                                <input id="email" v-model="newTeacher.email" type="email" placeholder="Email"
                                    class="w-full px-4 py-3 rounded-lg bg-slate-900/40 text-white border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    :class="{ 'border-red-500/50 focus:ring-red-500': validationErrors.email }"
                                    autocomplete="off" />
                            </div>
                            <p v-if="validationErrors.email" class="text-red-400 text-xs mt-1">{{ validationErrors.email
                                }}</p>
                        </div>

                        <!-- Password -->
                        <div class="space-y-2">
                            <label class="text-white text-sm font-medium flex items-center gap-1" for="password">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Parol
                            </label>
                            <div class="relative">
                                <input id="password" v-model="newTeacher.password" type="password" placeholder="Parol"
                                    class="w-full px-4 py-3 rounded-lg bg-slate-900/40 text-white border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    :class="{ 'border-red-500/50 focus:ring-red-500': validationErrors.password }"
                                    autocomplete="off" />
                            </div>
                            <p v-if="validationErrors.password" class="text-red-400 text-xs mt-1">{{
                                validationErrors.password }}</p>
                        </div>

                        <!-- Phone Number -->
                        <div class="space-y-2">
                            <label class="text-white text-sm font-medium flex items-center gap-1" for="phone_number">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Telefon raqam
                            </label>
                            <div class="relative">
                                <input id="phone_number" v-model="newTeacher.phone_number" type="text"
                                    placeholder="Telefon raqam"
                                    class="w-full px-4 py-3 rounded-lg bg-slate-900/40 text-white border border-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    :class="{ 'border-red-500/50 focus:ring-red-500': validationErrors.phone_number }"
                                    autocomplete="off" />
                            </div>
                            <p v-if="validationErrors.phone_number" class="text-red-400 text-xs mt-1">{{
                                validationErrors.phone_number }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="resetForm"
                            class="px-5 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Tozalash
                        </button>
                        <button type="submit"
                            class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            :disabled="formState.loading">
                            <svg v-if="formState.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {{ formState.loading ? "Qo'shilmoqda..." : "Qo'shish" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom focus styles */
input:focus,
button:focus {
    outline: none;
}

/* Smooth transitions */
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.1);
}

::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.7);
}
</style>