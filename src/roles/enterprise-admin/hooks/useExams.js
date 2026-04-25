import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "@/lib/api/exams.api.js";
import { enrollmentApi } from "@/lib/api/enrollments.api.js";
import { sessionApi } from "@/lib/api/sessions.api.js";
import { submissionApi } from "@/lib/api/submissions.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

// ── Exam CRUD ─────────────────────────────────────────────────────────────

export function useExams(params = {}) {
  return useQuery({
    queryKey: queryKeys.exams.list(params),
    queryFn: () => examApi.list(params),
  });
}

export function useExam(id) {
  return useQuery({
    queryKey: queryKeys.exams.detail(id),
    queryFn: () => examApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => examApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.all }),
  });
}

export function useUpdateExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => examApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.exams.all });
      qc.invalidateQueries({ queryKey: queryKeys.exams.detail(id) });
    },
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => examApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.all }),
  });
}

// ── Lifecycle ─────────────────────────────────────────────────────────────

export function useCloneExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }) => examApi.clone(id, { title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.all }),
  });
}

export function usePublishExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => examApi.publish(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(id) }),
  });
}

export function useCloseExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => examApi.close(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(id) }),
  });
}

export function useScheduleExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, startTime, endTime }) => examApi.schedule(id, { startTime, endTime }),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(id) }),
  });
}

// ── Exam Questions ────────────────────────────────────────────────────────

export function useExamQuestions(examId, params = {}) {
  return useQuery({
    queryKey: queryKeys.exams.questions(examId, params),
    queryFn: () => examApi.getQuestions(examId, params),
    enabled: !!examId,
  });
}

export function useAddExamQuestions(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => examApi.addQuestions(examId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.questions(examId) }),
  });
}

export function useRemoveExamQuestion(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId) => examApi.removeQuestion(examId, questionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.questions(examId) }),
  });
}

export function useUpdateExamQuestionMapping(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, payload }) => examApi.updateQuestionMapping(examId, questionId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.questions(examId) }),
  });
}

// ── Randomization Rules ───────────────────────────────────────────────────

export function useAddExamRule(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => examApi.addRule(examId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(examId) }),
  });
}

export function useDeleteExamRule(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ruleId) => examApi.deleteRule(examId, ruleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(examId) }),
  });
}

export function useUpdateExamRule(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, payload }) => examApi.updateRule(examId, ruleId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.detail(examId) }),
  });
}

// ── Enrollments ───────────────────────────────────────────────────────────

export function useExamEnrollments(examId, params = {}) {
  return useQuery({
    queryKey: queryKeys.exams.enrollments(examId, params),
    queryFn: () => enrollmentApi.listByExam(examId, params),
    enabled: !!examId,
  });
}

export function useEnrollCandidates(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => enrollmentApi.enrollCandidates(examId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.enrollments(examId) }),
  });
}

export function useRegenerateToken() {
  return useMutation({ mutationFn: (id) => enrollmentApi.regenerateToken(id) });
}

export function useResetAttempts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => enrollmentApi.resetAttempts(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.enrollments.all }),
  });
}

export function useRevokeEnrollment(examId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => enrollmentApi.revoke(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.enrollments(examId) }),
  });
}

// ── Sessions ──────────────────────────────────────────────────────────────

export function useExamSessions(examId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.exams.sessions(examId, params),
    queryFn: () => sessionApi.listByExam(examId, params),
    enabled: !!examId,
    ...options,
  });
}

export function useTerminateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => sessionApi.terminate(id, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.all }),
  });
}

export function useExpireSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => sessionApi.expire(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.exams.all }),
  });
}

// ── Submissions ───────────────────────────────────────────────────────────

export function useExamSubmissions(examId, params = {}) {
  return useQuery({
    queryKey: queryKeys.exams.submissions(examId, params),
    queryFn: () => submissionApi.listByExam(examId, params),
    enabled: !!examId,
  });
}
