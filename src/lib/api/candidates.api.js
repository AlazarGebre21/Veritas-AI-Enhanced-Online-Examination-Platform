import { apiClient } from "./client.js";

/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} enterpriseId
 * @property {string} externalId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} faceReferenceUrl
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateCandidatePayload
 * @property {string} email
 * @property {string} externalId
 * @property {string} faceReferenceUrl
 * @property {string} firstName
 * @property {string} lastName
 */

export const candidateApi = {
  /**
   * List candidates for the caller enterprise.
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<{ data: Candidate[], metadata: any }>}
   */
  list: async (params = {}) => {
    const { data } = await apiClient.get("/candidates", { params });
    return data;
  },

  /**
   * Create a single candidate.
   * @param {CreateCandidatePayload} payload
   * @returns {Promise<{ data: Candidate }>}
   */
  create: async (payload) => {
    const { data } = await apiClient.post("/candidates", payload);
    return data;
  },

  /**
   * Bulk upload candidates from a CSV file (max 5 MB).
   * CSV columns: external_id, first_name, last_name, email (optional), face_reference_url (optional).
   * @param {File} file
   * @returns {Promise<{ count: number, message: string }>}
   */
  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post("/candidates/bulk", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Get a candidate by ID.
   * @param {string} id
   * @returns {Promise<{ data: Candidate }>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/candidates/${id}`);
    return data;
  },

  /**
   * Update candidate fields.
   * @param {string} id
   * @param {{ email?: string, firstName?: string, lastName?: string, faceReferenceUrl?: string }} payload
   * @returns {Promise<{ message: string }>}
   */
  update: async (id, payload) => {
    const { data } = await apiClient.patch(`/candidates/${id}`, payload);
    return data;
  },

  /**
   * Soft-deactivate a candidate.
   * @param {string} id
   * @returns {Promise<{ message: string }>}
   */
  deactivate: async (id) => {
    const { data } = await apiClient.patch(`/candidates/${id}/deactivate`);
    return data;
  },
};
