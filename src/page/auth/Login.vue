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
        router.push("/");
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.value = "Login yoki parol noto‘g‘ri!";
    }
};

</script>

<template>
    <div class="flex rounded-2xl px-5 w-[400px] items-center justify-center bg-white">
        <div class="w-full max-w-md p-4">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">Kirish</h2>

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
                <input id="email" v-model="email" type="email" placeholder="Email kiriting"
                    class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-600">Parol</label>
                <input id="password" v-model="password" type="password" placeholder="Parol kiriting"
                    class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <button @click="login"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300">
                Kirish
            </button>

            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
        </div>
    </div>
</template>
