import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to restore a soft-deleted enterprise.
 */
export function useRestoreEnterprise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => enterpriseApi.restore(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.status(id) });
    },
  });
}
