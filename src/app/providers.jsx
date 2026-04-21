import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance — configure global defaults here.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,         // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
