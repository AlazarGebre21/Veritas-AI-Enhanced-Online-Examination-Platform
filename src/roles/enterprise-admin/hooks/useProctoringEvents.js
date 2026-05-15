import { useQuery } from "@tanstack/react-query";
import { adminProctoringApi } from "@/lib/api/proctoring.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetch proctoring events for a session (admin view).
 * Polls every 10s to match the monitoring page refresh rate.
 *
 * @param {string} sessionId
 * @param {object} [options]
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useProctoringEvents(sessionId, options = {}) {
  return useQuery({
    queryKey: queryKeys.proctoring.events(sessionId),
    queryFn: () => adminProctoringApi.listEvents(sessionId),
    enabled: !!sessionId,
    refetchInterval: 10_000,
    ...options,
  });
}
