import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
   headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});


api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Agar token muddati tugagan bo'lsa — refresh qilish
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const formData = new URLSearchParams();
                    formData.append("grant_type", "refresh_token");
                    formData.append("refresh_token", refreshToken);
                    formData.append("client_id", "string");
                    formData.append("client_secret", "string");

                    const response = await axios.post(
                        "https://your-backend-url.com/login/token",
                        formData,
                        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                    );

                    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;

                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("refresh_token", newRefreshToken);
                    localStorage.setItem("token_expiry", (Date.now() + expires_in * 1000).toString());

                    // Yangi token bilan so‘rovni qayta yuborish
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    localStorage.clear();
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
