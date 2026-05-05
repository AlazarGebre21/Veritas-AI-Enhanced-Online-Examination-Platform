import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { toast } from "sonner";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook to start a free trial subscription for an enterprise (admin only).
 */
export function useStartTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enterpriseId, data }) => paymentApi.startTrial(enterpriseId, data),
    onSuccess: (_, { enterpriseId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.subscription(enterpriseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.detail(enterpriseId) });
      toast.success("Trial started successfully");
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to start trial"));
    },
  });
}
