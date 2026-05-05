import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { toast } from "sonner";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook for enterprise admin to reactivate a subscription scheduled for cancellation.
 */
export function useReactivateSubscription(enterpriseId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => paymentApi.reactivateSubscription(enterpriseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.subscription(enterpriseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.billingSummary });
      toast.success("Subscription reactivated");
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to reactivate subscription"));
    },
  });
}
