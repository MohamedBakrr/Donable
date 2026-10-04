import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            new Error(
                error.response?.data?.message ||
                    error.message ||
                    "The request failed",
            ),
        ),
);
