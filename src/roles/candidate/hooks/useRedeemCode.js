import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { useExamSessionStore } from "@/stores/examSessionStore.js";

/**
 * Redeem an opaque invitation code to get a session token.
 * On success, stores the token and session context in examSessionStore.
 */
export function useRedeemCode() {
  const startAccess = useExamSessionStore((s) => s.startAccess);

  return useMutation({
    mutationFn: (code) => candidateSessionApi.redeemCode(code),
    onSuccess: (res, code) => {
      const { candidateId, enrollmentId, enterpriseId, examId } = res.data;
      // The raw token is whatever the server returns — store it for candidateClient
      startAccess({
        rawToken: code,
        candidateId,
        enrollmentId,
        enterpriseId,
        examId,
      });
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Invalid or expired invitation code.";
      toast.error(message);
    },
  });
}
