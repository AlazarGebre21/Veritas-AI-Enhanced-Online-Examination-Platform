import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth.api.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

export function useResetPassword() {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully. You can now log in.");
    },
    onError: (err) => {
      const error = normalizeError(err);
      toast.error(error.message || "Failed to reset password.");
    },
  });
}
