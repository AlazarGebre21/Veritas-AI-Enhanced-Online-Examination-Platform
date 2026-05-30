import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch all active subscription plans (public endpoint).
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function usePlans(params) {
  return useQuery({
    queryKey: params ? [...queryKeys.payments.plans, params] : queryKeys.payments.plans,
    queryFn: () => paymentApi.listPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
