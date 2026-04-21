import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch a single enterprise detail.
 * @param {string} id
 */
export function useEnterpriseDetail(id) {
  return useQuery({
    queryKey: queryKeys.enterprises.detail(id),
    queryFn: () => enterpriseApi.getById(id),
    enabled: !!id,
  });
}
