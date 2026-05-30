import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook to create a checkout session for upgrading a subscription.
 * @param {string} enterpriseId 
 */
export function useUpgradeSubscription(enterpriseId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId) => paymentApi.upgradeSubscription(enterpriseId, planId),
    onSuccess: (data) => {
      if (data && (data.checkout_url || data.url)) {
        window.location.href = data.checkout_url || data.url;
      } else {
        toast.success("Upgrade process initiated successfully.");
        // If it doesn't return a checkout session (e.g. mock mode or test), just invalidate.
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.subscription(enterpriseId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.billingSummary,
        });
      }
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to initiate upgrade"));
    },
  });
}
