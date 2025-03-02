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

        // ✅ Tokenni cookie-ga saqlash
        document.cookie = `token=${response.data.access_token}; path=/; secure;`;

        // 🔹 Dashboard sahifasiga yo‘naltirish
        router.push("/");
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.value = "Login yoki parol noto‘g‘ri!";
    }
};
</script>

<template>
    <div>
        <h2>Kirish</h2>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Parol" />
        <button @click="login">Kirish</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
</template>
