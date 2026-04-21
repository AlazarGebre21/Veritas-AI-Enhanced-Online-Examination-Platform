import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Hook to fetch enterprises list.
 * @param {Object} params Filter, search, and pagination parameters.
 */
export function useEnterprises(params = {}) {
  return useQuery({
    queryKey: queryKeys.enterprises.list(params),
    queryFn: () => enterpriseApi.list(params),
  });
}
