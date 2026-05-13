import { apiClient } from "./client.js";

/**
 * @typedef {Object} Enrollment
 * @property {string} id
 * @property {string} examId
 * @property {string} candidateId
 * @property {string} enterpriseId
 * @property {number} attemptsUsed
 * @property {number} maxAttempts
 * @property {string} tokenExpiresAt
 * @property {string} createdAt
 */

/**
 * @typedef {Object} EnrollCandidatesPayload
 * @property {string[]} candidateIds
 * @property {number} maxAttempts
 * @property {string} tokenExpiresAt - ISO 8601 date string
 */

export const enrollmentApi = {
  /**
   * Get an enrollment by ID.
   * @param {string} id
   * @returns {Promise<{ data: Enrollment }>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/enrollments/${id}`);
    return data;
  },

  /**
   * Send notification to a single enrollment (invitation email).
   * @param {string} id
   * @returns {Promise<{ message: string }>}
   */
  notify: async (id) => {
    const { data } = await apiClient.post(`/enrollments/${id}/notify`);
    return data;
  },

  /**
   * Get the invitation link for an enrollment.
   * @param {string} id
   * @returns {Promise<{ data: { link: string } }>}
   */
  getLink: async (id) => {
    const { data } = await apiClient.get(`/enrollments/${id}/link`);
    return data;
  },

  /**
   * Reset attempts used to zero for an enrollment.
   * @param {string} id
   * @returns {Promise<{ message: string }>}
   */
  resetAttempts: async (id) => {
    const { data } = await apiClient.post(`/enrollments/${id}/reset-attempts`);
    return data;
  },

  /**
   * Revoke an enrollment and prevent future use.
   * @param {string} id
   * @returns {Promise<{ message: string }>}
   */
  revoke: async (id) => {
    const { data } = await apiClient.patch(`/enrollments/${id}/revoke`);
    return data;
  },

  /**
   * List enrollments for an exam (paginated).
   * @param {string} examId
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<{ data: Enrollment[], metadata: any }>}
   */
  listByExam: async (examId, params = {}) => {
    const { data } = await apiClient.get(`/exams/${examId}/enrollments`, { params });
    return data;
  },

  /**
   * Enroll candidates in an exam (opaque codes issued server-side).
   * @param {string} examId
   * @param {EnrollCandidatesPayload} payload
   * @returns {Promise<{ message: string, count: number }>}
   */
  enrollCandidates: async (examId, payload) => {
    const { data } = await apiClient.post(`/exams/${examId}/enrollments`, payload);
    return data;
  },

  /**
   * Send notifications to all enrolled candidates for an exam.
   * @param {string} examId
   * @returns {Promise<{ message: string }>}
   */
  notifyAll: async (examId) => {
    const { data } = await apiClient.post(`/exams/${examId}/enrollments/notify`);
    return data;
  },
};
