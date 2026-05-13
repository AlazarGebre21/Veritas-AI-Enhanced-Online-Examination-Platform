import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Save or update one question answer in a session.
 * Silent — no toast notifications (auto-save behavior).
 *
 * @param {string} sessionId
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useSaveAnswer(sessionId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => candidateSessionApi.saveAnswer(sessionId, payload),
    onSuccess: () => {
      // Silently invalidate the answers cache so navigation panel stays current
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.answers(sessionId),
      });
    },
    // No toast on error — answers are queued offline if save fails
  });
}
