import { useQuery } from "@tanstack/react-query";
import { adminProctoringApi } from "@/lib/api/proctoring.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetch the cheating probability score for a session (admin view).
 * Handles 404 gracefully (no events recorded yet).
 *
 * @param {string} sessionId
 * @param {object} [options]
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useCheatingScore(sessionId, options = {}) {
  return useQuery({
    queryKey: queryKeys.proctoring.score(sessionId),
    queryFn: () => adminProctoringApi.getScore(sessionId),
    enabled: !!sessionId,
    retry: (failureCount, error) => {
      // Don't retry on 404 (no events yet)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    ...options,
  });
}
