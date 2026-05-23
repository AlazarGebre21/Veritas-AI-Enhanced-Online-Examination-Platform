import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/config/routes.js";
import { Button, Input } from "@/components/ui/index.js";
import { useForgotPassword } from "../hooks/useForgotPassword.js";
import { CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values) {
    await mutation.mutateAsync(values);
  }

  if (mutation.isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-notion-blue flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <span className="font-bold text-notion-black text-lg">Veritas</span>
        </div>
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-success" size={32} />
        </div>
        <h1 className="text-[28px] font-bold text-notion-black mb-3">Check your email</h1>
        <p className="text-warm-gray-500 text-[15px] mb-8 max-w-sm mx-auto">
          We sent a password reset link to your email address. It may take a couple of minutes to arrive.
        </p>
        <Link to={ROUTES.LOGIN}>
          <Button variant="secondary" className="w-full" size="lg">
            Return to sign in
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

      <h1 className="text-[28px] font-bold text-notion-black mb-2">Reset password</h1>
      <p className="text-warm-gray-500 text-[15px] mb-8">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
          className="w-full mt-2"
          size="lg"
        >
          Send reset link
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
