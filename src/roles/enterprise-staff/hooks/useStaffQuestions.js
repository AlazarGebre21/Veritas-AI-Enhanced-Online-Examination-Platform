/**
 * @fileoverview Re-exports question hooks for Enterprise Staff.
 * Staff has full CRUD + media upload on questions.
 */

export {
  useQuestions,
  useQuestion,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useUploadQuestionMedia,
} from "@/roles/enterprise-admin/hooks/useQuestions.js";
