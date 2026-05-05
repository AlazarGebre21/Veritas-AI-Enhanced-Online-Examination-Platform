import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches paginated payment history for the authenticated enterprise.
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function usePaymentHistory(params) {
  return useQuery({
    queryKey: queryKeys.payments.history(params),
    queryFn: () => paymentApi.getPaymentHistory(params),
    placeholderData: (prev) => prev,
  });
}
