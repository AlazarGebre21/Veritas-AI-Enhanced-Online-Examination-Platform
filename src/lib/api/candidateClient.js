import axios from "axios";
import { env } from "@/config/env.js";

// Lazily import to avoid circular dependency
let getSessionStore;
import("@/stores/examSessionStore.js").then((m) => {
  getSessionStore = m.useExamSessionStore.getState;
});

/**
 * Separate Axios instance for candidate exam sessions.
 * Candidates authenticate with a session token received from POST /access/redeem.
 *
 * CORS constraint: only Authorization, Content-Type, X-Request-ID are allowed.
 * All enrollment/enterprise context is derived server-side from the token.
 *
 * @example
 * // ✅ Correct
 * candidateClient.post("/access/redeem", { code: opaqueCode });
 * candidateClient.post("/sessions/start", formData); // multipart/form-data with face_image
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
