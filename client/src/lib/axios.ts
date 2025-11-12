import axios from "axios";
import { AuthServices } from "../services/auth.api";

const api = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "/api" : "http://localhost:8080/api",
    baseURL: import.meta.env.PROD ? import.meta.env.SERVER_URL : "http://localhost:8080/api",
    withCredentials: true
});


let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("in the interceptor")

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                if (refreshPromise) {
                    await refreshPromise;
                    return api(originalRequest);
                }

                refreshPromise = AuthServices.refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return api(originalRequest);
            } catch (refreshError) {
                // AuthServices.logout();
                console.log("logging out due to error", refreshError)
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);
    }
)

export default api;