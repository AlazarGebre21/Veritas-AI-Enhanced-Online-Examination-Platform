import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { toast } from "sonner";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook for enterprise admin to cancel their own subscription.
 */
export function useCancelSubscription(enterpriseId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cancelAtPeriodEnd = true } = {}) =>
      paymentApi.cancelSubscription(enterpriseId, { cancel_at_period_end: cancelAtPeriodEnd }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.subscription(enterpriseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.billingSummary });
      toast.success("Subscription cancellation scheduled");
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to cancel subscription"));
    },
  });
}
