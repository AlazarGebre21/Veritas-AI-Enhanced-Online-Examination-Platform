import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch audit logs for a given enterprise.
 * @param {string} enterpriseId
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function useAuditLogs(enterpriseId, params = {}) {
  return useQuery({
    queryKey: queryKeys.enterprises.auditLogs(enterpriseId, params),
    queryFn: () => enterpriseApi.getAuditLogs(enterpriseId, params),
    enabled: !!enterpriseId,
  });
}
