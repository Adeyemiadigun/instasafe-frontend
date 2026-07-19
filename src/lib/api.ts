import axios from "axios";
import { getStoredToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      clearAuth();
      window.location.href = "/auth/login";
    } else if (status === 403) {
      clearAuth();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
