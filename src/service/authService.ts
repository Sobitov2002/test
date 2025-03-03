import api from "./apiService";

export async function login(username: string, password: string) {
    try {
        const response = await api.post("/auth/login", { username, password });
        
        const token = response.data.token;
        if (!token) throw new Error("Token olinmadi!");

        localStorage.setItem("token", token); // ✅ Tokenni saqlash
        console.log("✅ Token saqlandi:", token);
        return true;
    } catch (error) {
        console.error("❌ Login xatosi:", error);
        return false;
    }
}

export function logout() {
    localStorage.removeItem("token");
    console.log("🚪 Foydalanuvchi chiqdi, token o‘chirildi!");
}
