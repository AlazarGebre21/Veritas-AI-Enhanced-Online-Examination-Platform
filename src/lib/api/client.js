import axios from "axios";
import { env } from "@/config/env.js";

// We import the store getter lazily to avoid circular dependency at module init
let getAuthStore;
import("@/stores/authStore.js").then((m) => {
  getAuthStore = m.useAuthStore.getState;
});

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Injects ONLY Authorization header.
// CORS allows: Authorization, Content-Type, X-Request-ID
// DO NOT inject X-Enterprise-ID, X-User-ID — backend resolves from JWT.
apiClient.interceptors.request.use((config) => {
  const accessToken = getAuthStore?.()?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor — 401 refresh logic ─────────────────────────────────
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken, setTokens, clearAuth } = getAuthStore?.() ?? {};
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(`${env.API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      getAuthStore?.()?.clearAuth?.();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
