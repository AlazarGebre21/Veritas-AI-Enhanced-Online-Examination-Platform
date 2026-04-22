import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to permanently delete an enterprise.
 */
export function useHardDeleteEnterprise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => enterpriseApi.hardDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.all });
    },
  });
}
