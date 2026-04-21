/**
 * @fileoverview Query key factory for all domains.
 * Use these everywhere — never hardcode query key arrays.
 *
 * @example
 * queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
 * useQuery({ queryKey: queryKeys.exams.detail(id), ... });
 */

export const queryKeys = {
  enterprises: {
    all: ["enterprises"],
    list: (params) => ["enterprises", "list", params],
    detail: (id) => ["enterprises", id],
    status: (id) => ["enterprises", id, "status"],
    summary: (id) => ["enterprises", id, "summary"],
    subscription: (id) => ["enterprises", id, "subscription"],
    auditLogs: (id, params) => ["enterprises", id, "audit-logs", params],
    users: (id, params) => ["enterprises", id, "users", params],
  },

  exams: {
    all: ["exams"],
    list: (params) => ["exams", "list", params],
    detail: (id) => ["exams", id],
    questions: (examId, params) => ["exams", examId, "questions", params],
    sessions: (examId, params) => ["exams", examId, "sessions", params],
    submissions: (examId, params) => ["exams", examId, "submissions", params],
    enrollments: (examId, params) => ["exams", examId, "enrollments", params],
  },

  questions: {
    all: ["questions"],
    list: (params) => ["questions", "list", params],
    detail: (id) => ["questions", id],
  },

  candidates: {
    all: ["candidates"],
    list: (params) => ["candidates", "list", params],
    detail: (id) => ["candidates", id],
  },

  enrollments: {
    all: ["enrollments"],
    detail: (id) => ["enrollments", id],
  },

  sessions: {
    active: ["sessions", "me", "active"],
    detail: (id) => ["sessions", id],
    questions: (id) => ["sessions", id, "questions"],
    answers: (id) => ["sessions", id, "answers"],
    result: (id) => ["sessions", id, "result"],
    summary: (id) => ["sessions", id, "summary"],
  },

  payments: {
    plans: ["subscriptions", "plans"],
    history: (enterpriseId) => ["payments", "history", enterpriseId],
    invoice: (id) => ["invoices", id],
  },
};
