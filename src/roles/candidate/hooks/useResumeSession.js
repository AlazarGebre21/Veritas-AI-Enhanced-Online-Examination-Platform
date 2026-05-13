import { useQuery } from "@tanstack/react-query";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { useExamSessionStore } from "@/stores/examSessionStore.js";

/**
 * Check if the authenticated candidate has an active session to resume.
 * Only enabled when rawToken exists but sessionId is not yet set.
 *
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export function useResumeSession() {
  const rawToken = useExamSessionStore((s) => s.rawToken);
  const sessionId = useExamSessionStore((s) => s.sessionId);

  return useQuery({
    queryKey: queryKeys.sessions.active,
    queryFn: () => candidateSessionApi.getActiveSession(),
    enabled: !!rawToken && !sessionId,
    retry: false,
  });
}
