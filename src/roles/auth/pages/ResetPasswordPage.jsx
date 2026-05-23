import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/config/routes.js";
import { Button, Input } from "@/components/ui/index.js";
import { useResetPassword } from "../hooks/useResetPassword.js";

const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values) {
    if (!token) return;
    await mutation.mutateAsync(
      { token, new_password: values.new_password },
      {
        onSuccess: () => navigate(ROUTES.LOGIN),
      }
    );
  }

  if (!token) {
    return (
      <div className="w-full text-center">
        <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-notion-blue flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <span className="font-bold text-notion-black text-lg">Veritas</span>
        </div>
        <h1 className="text-[28px] font-bold text-notion-black mb-3">Invalid Link</h1>
        <p className="text-warm-gray-500 text-[15px] mb-8">
          The password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link to={ROUTES.FORGOT_PASSWORD}>
          <Button variant="secondary" className="w-full" size="lg">
            Request new link
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile-only logo */}
      <div className="flex lg:hidden items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded bg-notion-blue flex items-center justify-center text-white font-bold text-sm">
          V
        </div>
        <span className="font-bold text-notion-black text-lg">Veritas</span>
      </div>

      <h1 className="text-[28px] font-bold text-notion-black mb-2">Create new password</h1>
      <p className="text-warm-gray-500 text-[15px] mb-8">
        Your new password must be at least 8 characters.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          id="new_password"
          type="password"
          label="New password"
          placeholder="••••••••"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <Input
          id="confirm_password"
          type="password"
          label="Confirm new password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
          className="w-full mt-2"
          size="lg"
        >
          Reset password
        </Button>
      </form>

      <p className="text-center text-[14px] text-warm-gray-500 mt-8">
        <Link to={ROUTES.LOGIN} className="text-notion-blue hover:underline font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
