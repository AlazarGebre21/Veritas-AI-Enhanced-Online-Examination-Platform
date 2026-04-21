import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Exam session store for the candidate flow.
 * Persisted to sessionStorage (cleared when the tab closes).
 *
 * Holds the raw enrollment token and active session identity.
 * The candidateClient Axios instance reads rawToken from here.
 *
 * Server data (session details, questions, answers) stays in React Query.
 */
export const useExamSessionStore = create()(
  persist(
    (set) => ({
      /** @type {string|null} Raw enrollment token from the access page */
      rawToken: null,

      /** @type {string|null} */
      sessionId: null,

      /** @type {string|null} */
      examId: null,

      /** @type {string|null} */
      enrollmentId: null,

      /** @type {string|null} */
      enterpriseId: null,

      /** @type {string|null} */
      candidateId: null,

      /** @type {number} */
      currentQuestionIndex: 0,

      /**
       * Called after POST /access/validate succeeds.
       * @param {{ rawToken: string, enrollmentId: string, enterpriseId: string, examId: string, candidateId: string }} payload
       */
      startAccess: (payload) => set({ ...payload }),

      /**
       * Called after POST /sessions/start succeeds.
       * @param {string} sessionId
       */
      setSessionId: (sessionId) => set({ sessionId }),

      /** @param {number} index */
      setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),

      /** Clear everything — called on exam submit or expiry */
      clearSession: () =>
        set({
          rawToken: null,
          sessionId: null,
          examId: null,
          enrollmentId: null,
          enterpriseId: null,
          candidateId: null,
          currentQuestionIndex: 0,
        }),
    }),
    {
      name: "veritas-exam-session",
      storage: {
        getItem: (key) => sessionStorage.getItem(key),
        setItem: (key, val) => sessionStorage.setItem(key, val),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);
