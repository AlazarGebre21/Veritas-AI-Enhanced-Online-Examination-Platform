import { apiClient } from "./client.js";

/**
 * @typedef {Object} RegisterEnterprisePayload
 * @property {string} contactEmail
 * @property {string} displayName
 * @property {string} legalName
 * @property {string} ownerEmail
 * @property {string} ownerPassword
 * @property {string} slug
 */

export const enterpriseApi = {
  /**
   * Register a new enterprise (public endpoint).
   * @param {RegisterEnterprisePayload} payload
   * @returns {Promise<any>}
   */
  register: async (payload) => {
    // According to API docs, public registration uses POST /enterprises
    const { data } = await apiClient.post("/enterprises", payload);
    return data;
  },

  /**
   * List enterprises (System Admin only)
   * @param {{ status?: string, subscription_status?: string, search?: string, page?: number, limit?: number, sort?: string, sort_dir?: string }} params
   * @returns {Promise<any>}
   */
  list: async (params) => {
    const { data } = await apiClient.get("/enterprises", { params });
    return data;
  },

  /**
   * Get an enterprise by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/enterprises/${id}`);
    return data;
  },

  /**
   * Update enterprise status (System Admin).
   * @param {{ id: string, status: string, reason?: string }} params
   * @returns {Promise<any>}
   */
  updateStatus: async ({ id, status, reason }) => {
    const { data } = await apiClient.patch(`/enterprises/${id}/status`, { status, reason });
    return data;
  },

  /**
   * Get audit logs for an enterprise (System Admin & Enterprise Admin).
   * @param {string} enterpriseId
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<any>}
   */
  getAuditLogs: async (enterpriseId, params = {}) => {
    const { data } = await apiClient.get(`/enterprises/${enterpriseId}/audit-logs`, { params });
    return data;
  },

  /**
   * Soft-delete an enterprise (System Admin only).
   * @param {string} id
   * @returns {Promise<void>}
   */
  deleteEnterprise: async (id) => {
    await apiClient.delete(`/enterprises/${id}`);
  },
};
