<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/service/apiService";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);

const login = async () => {
    if (!email.value || !password.value) {
        errorMessage.value = "Email va parol kiritilishi shart!";
        return;
    }

    errorMessage.value = "";
    isLoading.value = true;

    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "password");
        formData.append("username", email.value);
        formData.append("password", password.value);
        formData.append("scope", "");
        formData.append("client_id", "string");
        formData.append("client_secret", "string");

        const response = await api.post("/login/token", formData);

        await localStorage.setItem("token", response.data.access_token);
        router.push("/dashboard");
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.value = "Login yoki parol noto'g'ri!";
    } finally {
        isLoading.value = false;
    }
};

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

<template>
    <div class="grid md:grid-cols-2 w-full min-h-screen">
        <!-- Left side with image -->
        <div class="hidden md:block relative overflow-hidden">
            <div class="myimg absolute inset-0 flex items-center justify-center">
                <div class="absolute inset-0 bg-gradient-to-t from-[#0F123B]/80 to-transparent"></div>
                <img src="https://ik.imagekit.io/vtroph5l9/itechIcademy/photo_2025-03-10_11-58-11-Photoroom.png?updatedAt=1741592141139"
                    alt="Logo"
                    class="relative z-10 max-w-[70%] transform hover:scale-105 transition-transform duration-500" />
            </div>
        </div>

        <!-- Right side with login form -->
        <div class="bg-[#0F123B] min-h-screen flex items-center justify-center px-4">
            <div class="w-full max-w-md">
                <!-- Logo for mobile view -->
                <div class="md:hidden flex justify-center mb-8">
                    <img src="https://ik.imagekit.io/vtroph5l9/itechIcademy/photo_2025-03-10_11-58-11-Photoroom.png?updatedAt=1741592141139"
                        alt="Logo" class="w-40" />
                </div>

                <!-- Login card -->
                <div
                    class="backdrop-blur-sm bg-[#0F123B]/50 rounded-2xl p-8 border border-[#582CFF]/30 shadow-lg shadow-[#582CFF]/10">
                    <h2 class="text-3xl font-bold text-white mb-8 text-center">Kirish</h2>

                    <!-- Email field -->
                    <div class="mb-6">
                        <label for="email" class="block text-sm font-medium text-gray-200 mb-2">Email</label>
                        <div class="relative">
                            <input id="email" v-model="email" type="email" placeholder="Email kiriting"
                                class="w-full p-4 pl-5 bg-[#090D2E] text-gray-100 border border-[#582CFF]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#582CFF] focus:border-transparent transition-all duration-300" />
                        </div>
                    </div>

                    <!-- Password field -->
                    <div class="mb-8">
                        <label for="password" class="block text-sm font-medium text-gray-200 mb-2">Parol</label>
                        <div class="relative">
                            <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                placeholder="Parol kiriting"
                                class="w-full p-4 pl-5 bg-[#090D2E] text-gray-100 border border-[#582CFF]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#582CFF] focus:border-transparent transition-all duration-300" />
                            <button @click="togglePasswordVisibility" type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Error message -->
                    <div v-if="errorMessage" class="mb-6">
                        <div
                            class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{{ errorMessage }}</span>
                        </div>
                    </div>

                    <!-- Login button -->
                    <button @click="login" :disabled="isLoading"
                        class="w-full bg-[#582CFF] hover:bg-[#6A3CFF] text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#582CFF]/30 hover:shadow-[#582CFF]/50">
                        <span>Kirish</span>
                        <div v-if="isLoading" class="loader"></div>
                    </button>

                    <!-- Forgot password link -->
                    <div class="mt-6 text-center">
                        <a href="#" class="text-[#582CFF] hover:text-[#6A3CFF] text-sm transition-colors">
                            Parolni unutdingizmi?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.myimg {
    background-image: url("https://ik.imagekit.io/vtroph5l9/itechIcademy/f82b2ead74cabcb8c47273f4713a6493.jpg?updatedAt=1742541434948");
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
}

.loader {
    width: 18px;
    height: 18px;
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0px 1000px #090D2E inset;
    transition: background-color 5000s ease-in-out 0s;
}

input::placeholder {
    color: rgba(156, 163, 175, 0.5);
}

input:focus::placeholder {
    opacity: 0.5;
}
</style>