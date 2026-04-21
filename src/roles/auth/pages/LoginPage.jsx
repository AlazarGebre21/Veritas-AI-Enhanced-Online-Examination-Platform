import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore.js";
import { authApi } from "@/lib/api/auth.api.js";
import { USER_ROLES } from "@/config/constants.js";
import { ROUTES } from "@/config/routes.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";
import { Button, Input } from "@/components/ui/index.js";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    try {
      const { accessToken, refreshToken } = await authApi.login(values);
      setTokens(accessToken, refreshToken);

      // Redirect based on role decoded from JWT
      const { user } = useAuthStore.getState();
      if (user?.role === USER_ROLES.SYSTEM_ADMIN) navigate(ROUTES.ADMIN, { replace: true });
      else if (user?.role === USER_ROLES.ENTERPRISE_ADMIN) navigate(ROUTES.DASHBOARD, { replace: true });
      else if (user?.role === USER_ROLES.ENTERPRISE_STAFF) navigate(ROUTES.STAFF_PORTAL, { replace: true });
      else navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(normalizeError(err, "Login failed"));
    }
  }

  return (
    <div className="w-full">
      {/* Mobile-only logo (hidden on desktop since right panel handles it) */}
      <div className="flex lg:hidden items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded bg-notion-blue flex items-center justify-center text-white font-bold text-sm">
          V
        </div>
        <span className="font-bold text-notion-black text-lg">Veritas</span>
      </div>

      <h1 className="text-[28px] font-bold text-notion-black mb-2">Sign in</h1>
      <p className="text-warm-gray-500 text-[15px] mb-8">Welcome back — sign in to your workspace.</p>

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

        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full mt-2"
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-[14px] text-warm-gray-500 mt-8">
        New enterprise?{" "}
        <Link to={ROUTES.REGISTER} className="text-notion-blue hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
}
