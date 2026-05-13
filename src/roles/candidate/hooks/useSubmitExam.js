import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { useExamSessionStore } from "@/stores/examSessionStore.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Submit the exam session.
 * On success, clears the session store and navigates to the results page.
 *
 * @param {string} sessionId
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useSubmitExam(sessionId) {
  const clearSession = useExamSessionStore((s) => s.clearSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      candidateSessionApi.submitExam(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.detail(sessionId),
      });
      toast.success("Exam submitted successfully!");
      // Keep sessionId for result page before clearing
      navigate(`/exam/result/${sessionId}`);
      // Delay clear so navigation completes with sessionId in URL
      setTimeout(() => clearSession(), 100);
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Failed to submit exam.";
      toast.error(message);
    },
  });
}
