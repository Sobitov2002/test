<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/service/apiService";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "password");
        formData.append("username", email.value);
        formData.append("password", password.value);
        formData.append("scope", "");
        formData.append("client_id", "string");
        formData.append("client_secret", "string");

        const response = await api.post("/token", formData);

        await localStorage.setItem("token", response.data.access_token); 
        router.push("/dashboard");
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.value = "Login yoki parol noto‘g‘ri!";
    }
};

</script>

<template>
    <div class="grid grid-cols-2 w-full">

        <div class="myimg flex items-center justify-center">
            <img src="https://ik.imagekit.io/vtroph5l9/itechIcademy/photo_2025-03-10_11-58-11-Photoroom.png?updatedAt=1741592141139"
                alt="">
        </div>
        <div class="bg-[#0F123B] flex items-center pl-4">
            <div class="flex rounded-2xl px-3 py-5 w-[400px] border border-[#cccccc69] items-center justify-center ">
                <div class="w-full max-w-md p-4">
                    <h2 class="text-2xl font-bold text-center text-white mb-4">Kirish</h2>

                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium text-gray-100">Email</label>
                        <input id="email" v-model="email" type="email" placeholder="Email kiriting"
                            class="w-full mt-1 p-3 border text-gray-100 bg-[#090D2E] border-[#582CFF] rounded-[20px] " />
                    </div>

                    <div class="mb-4">
                        <label for="password" class="block text-sm font-medium text-gray-100">Parol</label>
                        <input id="password" v-model="password" type="password" placeholder="Parol kiriting"
                            class="w-full bg-[#090D2E] mt-1 p-3 text-gray-100 border rounded-[20px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " />
                    </div>

                    <button @click="login"
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-[12px] transition duration-300">
                        Kirish
                    </button>

                    <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
                </div>
            </div>
        </div>
            

    </div>


</template>

<style scoped>
.myimg{
   
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100%;
}
</style>
