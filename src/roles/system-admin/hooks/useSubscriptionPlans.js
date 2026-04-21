import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch all subscription plans (public endpoint).
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: queryKeys.payments.plans,
    queryFn: paymentApi.listPlans,
    staleTime: 5 * 60 * 1000, // Plans rarely change — cache for 5 min
  });
}
