import axios from "axios";
import { env } from "@/config/env.js";

// Lazily import to avoid circular dependency
let getSessionStore;
import("@/stores/examSessionStore.js").then((m) => {
  getSessionStore = m.useExamSessionStore.getState;
});

/**
 * Separate Axios instance for candidate exam sessions.
 * Candidates authenticate with a raw enrollment token (not a JWT).
 *
 * CORS constraint: only Authorization, Content-Type, X-Request-ID are allowed.
 * All enrollment/enterprise context is passed in the REQUEST BODY, not headers.
 *
 * @example
 * // ✅ Correct
 * candidateClient.post("/access/validate", { token: rawToken, enterpriseId });
 * candidateClient.post("/sessions/start", { enrollmentId, enterpriseId });
 *
 * // ❌ Wrong — CORS will block
 * // headers: { "X-Enrollment-Id": enrollmentId }
 */
export const candidateClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

candidateClient.interceptors.request.use((config) => {
  const rawToken = getSessionStore?.()?.rawToken;
  if (rawToken) {
    config.headers.Authorization = `Bearer ${rawToken}`;
  }
  return config;
});
