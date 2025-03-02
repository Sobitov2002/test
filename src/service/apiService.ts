import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL, // ✅ .env'dan URL olish
headers: {
"Accept": "application/json",
"Content-Type": "application/x-www-form-urlencoded",
},
});

api.interceptors.request.use((config) => {
const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export default api;
