import { apiClient } from "./client.js";

/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 */

export const authApi = {
  /**
   * Login with email and password. Returns JWT tokens.
   * @param {LoginPayload} payload
   * @returns {Promise<AuthTokens>}
   */
  login: async (payload) => {
    const { data } = await apiClient.post("/auth/login", payload);
    return data;
  },

  /**
   * Exchange a refresh token for new access/refresh tokens.
   * @param {{ refreshToken: string }} payload
   * @returns {Promise<AuthTokens>}
   */
  refresh: async (payload) => {
    const { data } = await apiClient.post("/auth/refresh", payload);
    return data;
  },

  /**
   * Invalidate the current refresh token. Returns 204.
   * @param {{ refreshToken: string }} payload
   * @returns {Promise<void>}
   */
  logout: async (payload) => {
    await apiClient.post("/auth/logout", payload);
  },
};
