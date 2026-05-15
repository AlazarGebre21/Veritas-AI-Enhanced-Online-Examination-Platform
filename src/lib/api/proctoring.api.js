import { candidateClient } from "./candidateClient.js";
import { apiClient } from "./client.js";

/**
 * @typedef {Object} FaceVerifyResponse
 * @property {string} session_id
 * @property {boolean} is_match
 * @property {number} confidence
 * @property {number} face_count
 */

/**
 * @typedef {Object} ProctoringEvent
 * @property {string} id
 * @property {string} session_id
 * @property {string} candidate_id
 * @property {string} enterprise_id
 * @property {string} event_type
 * @property {'low'|'medium'|'high'|'critical'} severity
 * @property {object} metadata
 * @property {string} occurred_at
 * @property {string} created_at
 */

// ── Candidate-side (candidateClient — token auth) ────────────────────────────

export const candidateProctoringApi = {
  /**
   * Periodic face verification during exam.
   * @param {string} sessionId
   * @param {string} imageB64 - Base64 encoded face image
   * @returns {Promise<FaceVerifyResponse>}
   */
  verifyFace: async (sessionId, imageB64) => {
    const { data } = await candidateClient.post("/face/verify", {
      session_id: sessionId,
      image_b64: imageB64,
    });
    return data;
  },

  /**
   * Ingest a single behavioral event from the candidate's browser.
   * @param {string} sessionId
   * @param {string} eventType
   * @param {object} [metadata={}]
   * @returns {Promise<string>}
   */
  ingestEvent: async (sessionId, eventType, metadata = {}) => {
    const { data } = await candidateClient.post("/proctoring/events", {
      session_id: sessionId,
      event_type: eventType,
      occurred_at: new Date().toISOString(),
      metadata,
    });
    return data;
  },
};

// ── Admin-side (apiClient — JWT auth) ────────────────────────────────────────

export const adminProctoringApi = {
  /**
   * List all proctoring events for a session (admin view).
   * @param {string} sessionId
   * @returns {Promise<{ session_id: string, events: ProctoringEvent[], total: number }>}
   */
  listEvents: async (sessionId) => {
    const { data } = await apiClient.get(
      `/proctoring/sessions/${sessionId}/events`
    );
    return data;
  },

  /**
   * Get the current cheating probability score for a session.
   * Returns 404 if no events have been recorded yet.
   * @param {string} sessionId
   * @returns {Promise<{ session_id: string, cheating_score: number, event_count: number, last_computed_at: string }>}
   */
  getScore: async (sessionId) => {
    const { data } = await apiClient.get(
      `/proctoring/sessions/${sessionId}/score`
    );
    return data;
  },
};
