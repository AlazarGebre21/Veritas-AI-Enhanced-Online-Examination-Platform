import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches enterprise subscription details.
 * Uses the new /subscriptions/{enterpriseId} endpoint.
 * Returns null (not an error) when the enterprise has no subscription yet (404).
 * @param {string} enterpriseId
 */
export function useEnterpriseSubscription(enterpriseId) {
  return useQuery({
    queryKey: queryKeys.payments.subscription(enterpriseId),
    queryFn: async () => {
      try {
        return await paymentApi.getSubscription(enterpriseId);
      } catch (err) {
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: !!enterpriseId,
    staleTime: 60 * 1000,
  });
}
