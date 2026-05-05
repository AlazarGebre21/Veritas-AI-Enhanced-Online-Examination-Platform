import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches aggregated billing summary for the authenticated enterprise.
 */
export function useBillingSummary() {
  return useQuery({
    queryKey: queryKeys.payments.billingSummary,
    queryFn: () => paymentApi.getBillingSummary(),
    staleTime: 60 * 1000,
  });
}
