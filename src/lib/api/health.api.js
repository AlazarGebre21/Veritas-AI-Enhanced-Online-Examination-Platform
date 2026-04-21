import { apiClient } from "./client.js";

/**
 * @typedef {Record<string, string>} HealthResponse
 * The server returns a free-form JSON object when the service is alive,
 * e.g. { status: "ok", version: "1.0.0" }.
 */

export const healthApi = {
  /**
   * Check if the backend service is alive.
   * GET /health — no authentication required.
   * @returns {Promise<HealthResponse>}
   */
  check: async () => {
    const { data } = await apiClient.get("/health");
    return data;
  },
};
