/**
 * @fileoverview All application route paths defined in one place.
 * Never hardcode path strings in components — always use ROUTES.*
 */

export const ROUTES = {
  // Public
  LOGIN: "/login",
  REGISTER: "/register",

  // Candidate exam (token auth, no JWT)
  EXAM_ACCESS: "/exam",
  EXAM_SESSION: "/exam/session/:id",
  EXAM_RESULT: "/exam/result/:sessionId",

  // SystemAdmin
  ADMIN: "/admin",
  ADMIN_ENTERPRISES: "/admin/enterprises",
  ADMIN_ENTERPRISE_DETAIL: "/admin/enterprises/:id",
  ADMIN_SUBSCRIPTIONS: "/admin/subscriptions",
  ADMIN_AUDIT_LOG: "/admin/audit-log",

  // EnterpriseAdmin
  DASHBOARD: "/dashboard",
  STAFF: "/staff",
  CANDIDATES: "/candidates",
  QUESTIONS: "/questions",
  QUESTIONS_SUBJECT: "/questions/subject/:subjectName",
  QUESTION_DETAIL: "/questions/:id",
  EXAMS: "/exams",
  EXAM_NEW: "/exams/new",
  EXAM_DETAIL: "/exams/:id",
  EXAM_MONITOR: "/exams/:id/monitor",
  RESULTS: "/results",
  BILLING: "/billing",
  SETTINGS: "/settings",

  // EnterpriseStaff
  STAFF_PORTAL: "/staff-portal",
  STAFF_EXAMS: "/staff-portal/exams",
  STAFF_EXAM_DETAIL: "/staff-portal/exams/:id",
  STAFF_QUESTIONS: "/staff-portal/questions",
  STAFF_MONITOR: "/staff-portal/monitor",
  STAFF_RESULTS: "/staff-portal/results",
};
