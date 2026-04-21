import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to update an enterprise status (Active, Suspended, etc).
 */
export function useUpdateEnterpriseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enterpriseApi.updateStatus,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific detail query
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enterprises.detail(variables.id) });
    },
  });
}
