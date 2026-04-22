import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch enterprise subscription details.
 */
export function useEnterpriseSubscription(id) {
  return useQuery({
    queryKey: queryKeys.enterprises.subscription(id),
    queryFn: () => enterpriseApi.getSubscription(id),
    enabled: !!id,
  });
}
