import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches the compact operational summary for an enterprise.
 * Returns: active_exam_count, active_session_count, user_count, subscription info.
 * @param {string} enterpriseId
 */
export function useEnterpriseSummary(enterpriseId) {
  return useQuery({
    queryKey: queryKeys.enterprises.summary(enterpriseId),
    queryFn: () => enterpriseApi.getSummary(enterpriseId),
    enabled: !!enterpriseId,
    staleTime: 30 * 1000, // Refresh every 30s — dashboard data
  });
}
