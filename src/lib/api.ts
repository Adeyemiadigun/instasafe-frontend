import axios from "axios";
import { getStoredToken, getStoredRefreshToken, storeAuth, clearAuth } from "./auth";
import { getStoredUser } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5129/api",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/refresh-token`,
          { token: getStoredToken(), refreshToken }
        );
        const data = res.data;
        const newToken = data.token || data.Token;
        const newRefresh = data.refreshToken || data.RefreshToken;
        const user = getStoredUser();
        if (newToken && user) {
          storeAuth(newToken, newRefresh || refreshToken, user as Record<string, unknown>);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null);
          return api(originalRequest);
        }
        throw new Error("Invalid refresh response");
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      clearAuth();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
