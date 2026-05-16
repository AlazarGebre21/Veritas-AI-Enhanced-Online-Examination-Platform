import { candidateClient } from "./candidateClient.js";

/**
 * @typedef {Object} RedeemResponse
 * @property {{ candidateId: string, enrollmentId: string, enterpriseId: string, examId: string }} data
 */

/**
 * @typedef {Object} SessionQuestion
 * @property {string} id
 * @property {number} negativePoints
 * @property {number} orderIndex
 * @property {number} points
 * @property {string} questionId
 * @property {number[]} questionSnapshot - Byte array; decode via TextDecoder
 * @property {string} sessionId
 */

/**
 * @typedef {Object} SessionAnswer
 * @property {number[]} answerData
 * @property {string} id
 * @property {boolean} isFinal
 * @property {string} savedAt
 * @property {string} sessionId
 * @property {string} sessionQuestionId
 */

/**
 * @typedef {Object} ExamSubmission
 * @property {boolean} autoSubmitted
 * @property {string} createdAt
 * @property {string} id
 * @property {string} sessionId
 * @property {string} submittedAt
 */

/**
 * @typedef {Object} ExamSession
 * @property {SessionAnswer[]} answers
 * @property {string} candidateId
 * @property {string} clientIp
 * @property {string} createdAt
 * @property {string} enrollmentId
 * @property {string} enterpriseId
 * @property {string} examId
 * @property {string} expiresAt
 * @property {string} faceRegisteredUrl
 * @property {string} id
 * @property {SessionQuestion[]} questions
 * @property {string} startedAt
 * @property {'Active'|'Submitted'|'Terminated'|'Expired'} status
 * @property {ExamSubmission} submission
 * @property {string} submittedAt
 * @property {string} terminatedAt
 * @property {string} terminationReason
 * @property {string} userAgent
 */

/**
 * Candidate-facing API service.
 * Uses candidateClient (Bearer token from POST /access/redeem).
 *
 * CORS constraint: only Authorization, Content-Type, X-Request-ID headers allowed.
 * Identity (enrollmentId, enterpriseId) is derived server-side from the Bearer token.
 */
export const candidateSessionApi = {
  /**
   * Redeem an opaque invitation code to get a session JWT.
   * The response contains only { token: "..." }.
   * @param {string} code - Opaque invitation code
   * @returns {Promise<{ token: string }>}
   */
  redeemCode: async (code) => {
    const { data } = await candidateClient.post("/access/redeem", { code });
    return data;
  },

  /**
   * Start a new exam session with mandatory face registration.
   * Sends multipart/form-data with face_image only; identity from Bearer token.
   * @param {File|Blob} faceImageFile - Face photo (JPEG/PNG/WEBP, <5MB)
   * @returns {Promise<{ data: ExamSession }>}
   */
  startSession: async (faceImageFile) => {
    const formData = new FormData();
    formData.append("face_image", faceImageFile);
    const { data } = await candidateClient.post("/sessions/start", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Return the active session for the authenticated candidate.
   * @returns {Promise<{ data: ExamSession }>}
   */
  getActiveSession: async () => {
    const { data } = await candidateClient.get("/sessions/me/active");
    return data;
  },

  /**
   * Get session details by ID.
   * @param {string} sessionId
   * @returns {Promise<{ data: ExamSession }>}
   */
  getSessionById: async (sessionId) => {
    const { data } = await candidateClient.get(`/sessions/${sessionId}`);
    return data;
  },

  /**
   * Get question snapshots for a session.
   * @param {string} sessionId
   * @returns {Promise<{ data: SessionQuestion[] }>}
   */
  getSessionQuestions: async (sessionId) => {
    const { data } = await candidateClient.get(
      `/sessions/${sessionId}/questions`
    );
    return data;
  },

  /**
   * Get answers saved by the candidate for a session.
   * @param {string} sessionId
   * @returns {Promise<{ data: SessionAnswer[] }>}
   */
  getSessionAnswers: async (sessionId) => {
    const { data } = await candidateClient.get(
      `/sessions/${sessionId}/answers`
    );
    return data;
  },

  /**
   * Save or update one question answer in a session.
   * One of selectedOptionIds or text must be non-null (not both).
   * @param {string} sessionId
   * @param {{ sessionQuestionId: string, answerData: { selectedOptionIds?: string[], text?: string } }} payload
   * @returns {Promise<{ data: SessionAnswer }>}
   */
  saveAnswer: async (sessionId, payload) => {
    const { data } = await candidateClient.patch(
      `/sessions/${sessionId}/answers`,
      payload
    );
    return data;
  },

  /**
   * Submit the exam session.
   * @param {string} sessionId
   * @param {{ autoSubmitted: boolean }} payload
   * @returns {Promise<{ data: ExamSubmission, message: string }>}
   */
  submitExam: async (sessionId, payload) => {
    const { data } = await candidateClient.post(
      `/sessions/${sessionId}/submit`,
      payload
    );
    return data;
  },
};
