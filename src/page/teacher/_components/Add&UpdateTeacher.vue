<script setup lang="ts">
import { ref } from "vue";
import  api  from '@/service/apiService'


const addTeacher = async (teacherData: {
    full_name: string;
    password: string;
    email: string;
    phone_number: string;
}) => {
    try {
        const response = await api.post("/admistrator/create_teacher", teacherData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error: any) {
        console.log("Xatolik:", error.response?.data || error.message);
        return null;
    }
};

const newTeacher = ref({
    full_name: "",
    password: "",
    email: "",
    phone_number: ""
});


const submitTeacher = async () => {
    console.log("Jo‘natilayotgan obyekt:", newTeacher.value);

    if (!newTeacher.value.full_name || !newTeacher.value.password || !newTeacher.value.email || !newTeacher.value.phone_number) {
        alert("Barcha maydonlarni to‘ldiring!");
        return;
    }

    if (newTeacher.value.password.length < 6) {
        alert("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
        return;
    }

    const response = await addTeacher(newTeacher.value);

    if (response) {
        alert("O‘qituvchi muvaffaqiyatli qo‘shildi!");
        newTeacher.value = { full_name: '', password: '', email: '', phone_number: '' };
    } else {
        console.log("Server javobi:", response);
    }
};



</script>

<template>
    <div class="  ">
        <div style="background: linear-gradient(126.97deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(26, 31, 55, 0.5) 91.2%);"
            class="w-[90%] m-auto p-4 rounded-xl shadow-lg flex justify-center items-center ">

            <form @submit.prevent="submitTeacher" class="space-y-4">
                <h3 class="text-xl font-semibold text-white text-center mb-4">Yangi o‘qituvchi qo‘shish</h3>
                <div class="flex gap-10 ">
                    <div class="">
                        <div>
                            <label class="text-white" for="">Ism Familya</label>
                            <input v-model="newTeacher.full_name" type="text" placeholder="To‘liq ism"
                                class="w-full px-4 py-2 rounded-md bg-slate-900/40 text-white focus:ring-2 focus:ring-blue-500"
                                autocomplete="off" required />
                        </div>

                        <div class="mt-4">
                            <label class="text-white" for="">Parol</label>
                            <input v-model="newTeacher.password" type="password" placeholder="Parol"
                                class="w-full px-4 py-2 rounded-md bg-slate-900/40 text-white focus:ring-2 focus:ring-blue-500"
                                autocomplete="off" required />
                        </div>
                    </div>

                    <div>
                        <div>
                            <label class="text-white" for="">Email</label>
                            <input v-model="newTeacher.email" type="email" placeholder="Email"
                                class="w-full px-4 py-2 rounded-md bg-slate-900/40 text-white focus:ring-2 focus:ring-blue-500"
                                autocomplete="off" required />
                        </div>

                        <div class="mt-4">
                            <label class="text-white" for="">Telefon raqam</label>
                            <input v-model="newTeacher.phone_number" type="text" placeholder="Telefon raqam"
                                class="w-full px-4 py-2 rounded-md bg-slate-900/40 text-white focus:ring-2 focus:ring-blue-500"
                                autocomplete="off" required />
                        </div>
                    </div>
                </div>

                <button type="submit"
                    class="p-2 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
                    Qo‘shish
                </button>
                
            </form>
        </div>
    </div>
</template>
