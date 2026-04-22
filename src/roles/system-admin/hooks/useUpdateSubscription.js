import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to update an enterprise's subscription plan and period.
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => enterpriseApi.updateSubscription(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.subscription(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.detail(id) });
    },
  });
}
