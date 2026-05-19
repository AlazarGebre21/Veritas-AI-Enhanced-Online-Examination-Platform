import axios from "axios";
import { env } from "@/config/env.js";

/**
 * Separate Axios instance for candidate exam sessions.
 * Candidates authenticate with a session JWT received from POST /access/redeem.
 *
 * CORS constraint: only Authorization, Content-Type, X-Request-ID are allowed.
 * All enrollment/enterprise context is derived server-side from the token.
 */
export const candidateClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Read rawToken directly from sessionStorage to avoid:
 * 1. Circular dependency with examSessionStore
 * 2. Race condition from lazy dynamic import
 */
function getRawToken() {
  try {
    const raw = sessionStorage.getItem("veritas-exam-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.rawToken || null;
  } catch {
    return null;
  }
}

candidateClient.interceptors.request.use((config) => {
  // /access/redeem is a PUBLIC endpoint — must NOT have Authorization header
  if (config.url?.includes("/access/redeem")) {
    delete config.headers.Authorization;
    return config;
  }
  const rawToken = getRawToken();
  if (rawToken) {
    config.headers.Authorization = `Bearer ${rawToken}`;
  }
  return config;
});
