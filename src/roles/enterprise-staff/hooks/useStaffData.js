/**
 * @fileoverview Re-exports shared hooks that Enterprise Staff needs.
 * Keeps staff imports clean and decoupled from the admin module path.
 *
 * NOTE: Enterprise endpoints (GET /enterprises/me, GET /enterprises/{id}/summary)
 * are admin-only and return 403 for staff users. Do NOT re-export them here.
 */

// Candidates (read-only for staff)
export { useCandidates, useCandidate } from "@/roles/enterprise-admin/hooks/useCandidates.js";

// Enrollments (staff can list, create, notify, get link)
export {
  useExamEnrollments,
  useEnrollCandidates,
  useNotifyEnrollment,
  useNotifyAllEnrollments,
  useEnrollmentLink,
} from "@/roles/enterprise-admin/hooks/useExams.js";
