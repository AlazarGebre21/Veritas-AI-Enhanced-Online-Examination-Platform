import { apiClient } from "./client.js";

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} examId
 * @property {string} candidateId
 * @property {string} enrollmentId
 * @property {string} enterpriseId
 * @property {'Active'|'Submitted'|'Expired'|'Terminated'} status
 * @property {string} startedAt
 * @property {string} expiresAt
 * @property {string} submittedAt
 * @property {string} terminatedAt
 * @property {string} terminationReason
 * @property {number} cheatingScore
 * @property {string} clientIp
 * @property {string} userAgent
 * @property {string} faceRegisteredUrl
 * @property {any[]} questions
 * @property {any[]} answers
 * @property {any} submission
 * @property {string} createdAt
 */

export const sessionApi = {
  /**
   * List sessions for an exam (paginated, filterable by status/candidate).
   * @param {string} examId
   * @param {{ status?: string, candidateId?: string, page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<{ data: Session[], metadata: any }>}
   */
  listByExam: async (examId, params = {}) => {
    const { data } = await apiClient.get(`/exams/${examId}/sessions`, { params });
    return data;
  },

  /**
   * Get session details by ID.
   * @param {string} id
   * @returns {Promise<{ data: Session }>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/sessions/${id}`);
    return data;
  },

  /**
   * Get a session summary (includes answers and submission).
   * @param {string} id
   * @returns {Promise<{ data: Session }>}
   */
  getSummary: async (id) => {
    const { data } = await apiClient.get(`/sessions/${id}/summary`);
    return data;
  },

  /**
   * Terminate a session (enterprise/admin action).
   * @param {string} id
   * @param {{ reason: string }} payload
   * @returns {Promise<{ message: string }>}
   */
  terminate: async (id, payload) => {
    const { data } = await apiClient.post(`/sessions/${id}/terminate`, payload);
    return data;
  },

  /**
   * Force-expire a session.
   * @param {string} id
   * @returns {Promise<{ message: string }>}
   */
  expire: async (id) => {
    const { data } = await apiClient.post(`/sessions/${id}/expire`);
    return data;
  },
};
