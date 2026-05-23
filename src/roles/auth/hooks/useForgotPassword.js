import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth.api.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset link sent! Please check your email.");
    },
    onError: (err) => {
      const error = normalizeError(err);
      toast.error(error.message || "Failed to send password reset email.");
    },
  });
}
