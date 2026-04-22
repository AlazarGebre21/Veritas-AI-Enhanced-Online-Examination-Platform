import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches enterprise subscription details.
 * Returns: subscription_plan_id, subscription_status, current_period_start/end.
 * @param {string} enterpriseId
 */
export function useEnterpriseSubscription(enterpriseId) {
  return useQuery({
    queryKey: queryKeys.enterprises.subscription(enterpriseId),
    queryFn: () => enterpriseApi.getSubscription(enterpriseId),
    enabled: !!enterpriseId,
    staleTime: 60 * 1000,
  });
}
