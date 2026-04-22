import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to suspend an enterprise's subscription due to payment issues.
 */
export function useSuspendPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => enterpriseApi.suspendPayment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.subscription(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.status(id) });
    },
  });
}
