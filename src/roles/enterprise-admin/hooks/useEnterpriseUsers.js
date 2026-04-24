import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches paginated users for an enterprise.
 * @param {string} enterpriseId
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function useEnterpriseUsers(enterpriseId, params = {}) {
  return useQuery({
    queryKey: queryKeys.enterprises.users(enterpriseId, params),
    queryFn: () => enterpriseApi.listUsers(enterpriseId, params),
    enabled: !!enterpriseId,
  });
}