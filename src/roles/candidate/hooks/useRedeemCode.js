import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { useExamSessionStore } from "@/stores/examSessionStore.js";

/**
 * Redeem an opaque invitation code to get a session JWT.
 * On success, stores the JWT in examSessionStore so candidateClient
 * can use it as the Bearer token for subsequent requests.
 */
export function useRedeemCode() {
  const startAccess = useExamSessionStore((s) => s.startAccess);

  return useMutation({
    mutationFn: (code) => candidateSessionApi.redeemCode(code),
    onSuccess: (res) => {
      startAccess({
        rawToken: res.token,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Invalid or expired invitation code.";
      toast.error(message);
    },
  });
}
