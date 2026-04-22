import { apiClient } from "./client.js";

/**
 * @typedef {Object} Submission
 * @property {string} id
 * @property {string} sessionId
 * @property {boolean} autoSubmitted
 * @property {string} gradingStatus
 * @property {number} totalScore
 * @property {string} submittedAt
 * @property {string} createdAt
 */

export const submissionApi = {
  /**
   * List submissions for an exam (paginated).
   * @param {string} examId
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<{ data: Submission[], metadata: any }>}
   */
  listByExam: async (examId, params = {}) => {
    const { data } = await apiClient.get(`/exams/${examId}/submissions`, { params });
    return data;
  },

  /**
   * Get a submission by ID.
   * @param {string} id
   * @returns {Promise<{ data: Submission }>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/submissions/${id}`);
    return data;
  },
};
