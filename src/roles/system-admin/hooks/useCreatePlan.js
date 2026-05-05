import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";
import { toast } from "sonner";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

/**
 * Hook to create a new subscription plan.
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => paymentApi.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      toast.success("Plan created successfully");
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Failed to create plan"));
    },
  });
}
