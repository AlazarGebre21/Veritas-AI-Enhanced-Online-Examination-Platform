import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch detailed enterprise lifecycle status.
 */
export function useEnterpriseStatus(id) {
  return useQuery({
    queryKey: queryKeys.enterprises.status(id),
    queryFn: () => enterpriseApi.getStatus(id),
    enabled: !!id,
  });
}
