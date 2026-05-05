import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches enterprise subscription details.
 * Uses the new /subscriptions/{enterpriseId} endpoint.
 * @param {string} enterpriseId
 */
export function useEnterpriseSubscription(enterpriseId) {
  return useQuery({
    queryKey: queryKeys.payments.subscription(enterpriseId),
    queryFn: () => paymentApi.getSubscription(enterpriseId),
    enabled: !!enterpriseId,
    staleTime: 60 * 1000,
  });
}
