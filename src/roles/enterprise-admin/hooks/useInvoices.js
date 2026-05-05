import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches paginated invoices for the authenticated enterprise.
 * @param {{ page?: number, limit?: number, sort?: string, sort_dir?: string }} [params]
 */
export function useInvoices(params) {
  return useQuery({
    queryKey: queryKeys.payments.invoices(params),
    queryFn: () => paymentApi.listInvoices(params),
    placeholderData: (prev) => prev,
  });
}
