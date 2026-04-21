import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/lib/api/health.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * General-purpose hook to check backend service health via GET /health.
 *
 * @param {object} [options] Optional React Query overrides.
 * @param {number} [options.refetchInterval] Polling interval in ms (default: 30 000).
 * @param {boolean} [options.enabled]        Disable the query if false.
 *
 * @returns {{ isHealthy: boolean, isLoading: boolean, isError: boolean, data: Record<string, string> | undefined }}
 *
 * @example
 * const { isHealthy, isLoading } = useSystemHealth();
 */
export function useSystemHealth({ refetchInterval = 30_000, enabled = true } = {}) {
  const query = useQuery({
    queryKey: queryKeys.health.status,
    queryFn: healthApi.check,
    refetchInterval,
    enabled,
    // Treat any successful response as "healthy"; a network/HTTP error means unhealthy.
    retry: 1,
  });

  return {
    /** true only when the last fetch succeeded */
    isHealthy: query.isSuccess,
    isLoading: query.isLoading,
    isError: query.isError,
    data: query.data,
  };
}
