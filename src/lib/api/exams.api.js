import { apiClient } from "./client.js";

/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} enterpriseId
 * @property {string} title
 * @property {string} description
 * @property {number} durationMinutes
 * @property {number} maxParticipants
 * @property {number} passingScorePercent
 * @property {boolean} negativeMarking
 * @property {'Draft'|'Scheduled'|'Active'|'Closed'|'Archived'} status
 * @property {string} scheduledStart
 * @property {string} scheduledEnd
 * @property {string} templateSourceId
 * @property {Record<string, any>} settings
 * @property {any[]} questions
 * @property {any[]} randomizationRules
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 */

/**
 * @typedef {Object} CreateExamPayload
 * @property {string} title
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {number} [maxParticipants]
 * @property {number} [passingScorePercent]
 * @property {boolean} [negativeMarking]
 * @property {Record<string, any>} [settings]
 * @property {string} [templateSourceId]
 */

export const examApi = {
  // ── CRUD ──────────────────────────────────────────────────────────────────

  /**
   * List exams for the caller enterprise.
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
   * @returns {Promise<{ data: Exam[], metadata: any }>}
   */
  list: async (params = {}) => {
    const { data } = await apiClient.get("/exams", { params });
    return data;
  },

  /**
   * Create an exam.
   * @param {CreateExamPayload} payload
   * @returns {Promise<Exam>}
   */
  create: async (payload) => {
    const { data } = await apiClient.post("/exams", payload);
    return data;
  },

  /**
   * Get an exam by ID (includes questions and rules).
   * @param {string} id
   * @returns {Promise<Exam>}
   */
  getById: async (id) => {
    const { data } = await apiClient.get(`/exams/${id}`);
    return data;
  },

  /**
   * Update exam fields.
   * @param {string} id
   * @param {Partial<CreateExamPayload>} payload
   * @returns {Promise<void>}
   */
  update: async (id, payload) => {
    await apiClient.patch(`/exams/${id}`, payload);
  },

  /**
   * Delete an exam.
   * @param {string} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(`/exams/${id}`);
  },

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Clone an exam into a new exam with a new title.
   * @param {string} id - Source exam ID
   * @param {{ title: string }} payload
   * @returns {Promise<Exam>}
   */
  clone: async (id, payload) => {
    const { data } = await apiClient.post(`/exams/${id}/clone`, payload);
    return data;
  },

  /**
   * Publish an exam after validation checks.
   * @param {string} id
   * @returns {Promise<void>}
   */
  publish: async (id) => {
    await apiClient.post(`/exams/${id}/publish`);
  },

  /**
   * Close an active exam.
   * @param {string} id
   * @returns {Promise<void>}
   */
  close: async (id) => {
    await apiClient.post(`/exams/${id}/close`);
  },

  /**
   * Set start and end times for an exam.
   * @param {string} id
   * @param {{ startTime: string, endTime: string }} payload - ISO 8601 strings
   * @returns {Promise<void>}
   */
  schedule: async (id, payload) => {
    await apiClient.post(`/exams/${id}/schedule`, payload);
  },

  // ── Exam Questions ────────────────────────────────────────────────────────

  /**
   * Get question mappings for an exam (paginated).
   * @param {string} examId
   * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string, with_correct_answer?: boolean }} [params]
   * @returns {Promise<{ data: any[], metadata: any }>}
   */
  getQuestions: async (examId, params = {}) => {
    const { data } = await apiClient.get(`/exams/${examId}/questions`, { params });
    return data;
  },

  /**
   * Attach questions to an exam (batch).
   * @param {string} examId
   * @param {{ questions: { questionId: string, orderIndex?: number, pointsOverride?: number }[] }} payload
   * @returns {Promise<any[]>}
   */
  addQuestions: async (examId, payload) => {
    const { data } = await apiClient.post(`/exams/${examId}/questions`, payload);
    return data;
  },

  /**
   * Remove a question mapping from an exam.
   * @param {string} examId
   * @param {string} questionId
   * @returns {Promise<void>}
   */
  removeQuestion: async (examId, questionId) => {
    await apiClient.delete(`/exams/${examId}/questions/${questionId}`);
  },

  /**
   * Update points override or order index for an exam question mapping.
   * @param {string} examId
   * @param {string} questionId
   * @param {{ orderIndex?: number, pointsOverride?: number }} payload
   * @returns {Promise<void>}
   */
  updateQuestionMapping: async (examId, questionId, payload) => {
    await apiClient.patch(`/exams/${examId}/questions/${questionId}`, payload);
  },

  // ── Randomization Rules ───────────────────────────────────────────────────

  /**
   * Add a randomization rule to an exam.
   * @param {string} examId
   * @param {{ topic: string, difficulty: string, questionCount: number }} payload
   * @returns {Promise<any>}
   */
  addRule: async (examId, payload) => {
    const { data } = await apiClient.post(`/exams/${examId}/rules`, payload);
    return data;
  },

  /**
   * Delete a randomization rule from an exam.
   * @param {string} examId
   * @param {string} ruleId
   * @returns {Promise<void>}
   */
  deleteRule: async (examId, ruleId) => {
    await apiClient.delete(`/exams/${examId}/rules/${ruleId}`);
  },

  /**
   * Update a randomization rule.
   * @param {string} examId
   * @param {string} ruleId
   * @param {{ topic?: string, difficulty?: string, questionCount?: number }} payload
   * @returns {Promise<void>}
   */
  updateRule: async (examId, ruleId, payload) => {
    await apiClient.patch(`/exams/${examId}/rules/${ruleId}`, payload);
  },
};
