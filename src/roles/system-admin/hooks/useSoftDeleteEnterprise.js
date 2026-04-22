import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to soft-delete an enterprise.
 */
export function useSoftDeleteEnterprise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => enterpriseApi.deleteEnterprise(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.status(id) });
    },
  });
}
