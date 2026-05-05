import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { toast } from "sonner";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook to deactivate a subscription plan (sets is_active = false).
 */
export function useDeactivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId) => paymentApi.deactivatePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      toast.success("Plan deactivated");
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to deactivate plan"));
    },
  });
}
