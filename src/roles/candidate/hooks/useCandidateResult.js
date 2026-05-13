import { useQuery } from "@tanstack/react-query";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetch session details to extract the submission result.
 * The submission object contains: autoSubmitted, createdAt, id, sessionId, submittedAt.
 * (No totalScore or gradingStatus — those fields were removed.)
 *
 * @param {string} sessionId
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCandidateResult(sessionId) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(sessionId),
    queryFn: () => candidateSessionApi.getSessionById(sessionId),
    enabled: !!sessionId,
  });
}
