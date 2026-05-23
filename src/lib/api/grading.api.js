import { apiClient } from './client';

export const gradingApi = {
  /**
   * List graded students
   *
   * @param {{ exam_id?: string, limit?: number, offset?: number }} params
   * @returns {Promise<{ results: any[], total: number, limit: number, offset: number }>}
   */
  listResults: async (params) => {
    const { data } = await apiClient.get('/grading/results', { params });
    return data;
  },

  /**
   * Get detailed grading breakdown for an exam session
   *
   * @param {string} sessionId
   * @returns {Promise<any>}
   */
  getGradeDetail: async (sessionId) => {
    const { data } = await apiClient.get(`/grading/results/${sessionId}`);
    return data;
  },

  /**
   * Override a student's final grade (EnterpriseAdmin)
   *
   * @param {{ sessionId: string, new_score: number, reason: string }} payload
   * @returns {Promise<{ session_id: string, previous_score: number, new_score: number, new_percentage: number, status: string, message: string }>}
   */
  overrideGrade: async ({ sessionId, new_score, reason }) => {
    const { data } = await apiClient.post(`/grading/results/${sessionId}/override`, {
      new_score,
      reason,
    });
    return data;
  },

  /**
   * Get the immutable audit history / edit logs for an exam session's grade
   *
   * @param {string} sessionId
   * @returns {Promise<any[]>}
   */
  getAuditLogs: async (sessionId) => {
    const { data } = await apiClient.get(`/grading/results/${sessionId}/logs`);
    return data;
  },
};
