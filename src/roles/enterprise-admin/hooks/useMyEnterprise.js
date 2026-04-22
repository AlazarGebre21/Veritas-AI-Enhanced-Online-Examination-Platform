import { useQuery } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { queryKeys } from "@/lib/api/queryKeys.js";

/**
 * Fetches the enterprise for the currently authenticated user.
 * Uses GET /enterprises/me (identity derived from JWT).
 */
export function useMyEnterprise() {
  return useQuery({
    queryKey: ["enterprises", "me"],
    queryFn: enterpriseApi.getMe,
    staleTime: 5 * 60 * 1000, // Enterprise profile rarely changes
  });
}
