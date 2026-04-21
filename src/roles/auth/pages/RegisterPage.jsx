import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { enterpriseApi } from "@/lib/api/enterprises.api.js";
import { ROUTES } from "@/config/routes.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";
import { Button, Input } from "@/components/ui/index.js";

const registerSchema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  displayName: z.string().min(2, "Display name is required"),
  slug: z
    .string()
    .min(2, "Workspace slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  contactEmail: z.string().email("Valid contact email is required"),
  ownerEmail: z.string().email("Valid owner email is required"),
  ownerPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: enterpriseApi.register,
    onSuccess: () => {
      toast.success("Enterprise registered successfully. Please sign in.");
      navigate(ROUTES.LOGIN);
    },
    onError: (err) => {
      toast.error(normalizeError(err, "Registration failed"));
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
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

      <h1 className="text-[28px] font-bold text-notion-black mb-2">Register enterprise</h1>
      <p className="text-warm-gray-500 text-[15px] mb-8">Create a Veritas workspace for your organization.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="legalName"
            label="Legal Name"
            placeholder="Acme Corporation"
            error={errors.legalName?.message}
            {...register("legalName")}
          />
          <Input
            id="displayName"
            label="Display Name"
            placeholder="Acme"
            error={errors.displayName?.message}
            {...register("displayName")}
          />
        </div>

        <Input
          id="slug"
          label="Workspace URL Slug"
          placeholder="acme-corp"
          error={errors.slug?.message}
          {...register("slug")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="contactEmail"
            type="email"
            label="Contact Email"
            placeholder="info@acme.com"
            error={errors.contactEmail?.message}
            {...register("contactEmail")}
          />
          <Input
            id="ownerEmail"
            type="email"
            label="Admin Email (Login)"
            placeholder="admin@acme.com"
            error={errors.ownerEmail?.message}
            {...register("ownerEmail")}
          />
        </div>

        <Input
          id="ownerPassword"
          type="password"
          label="Admin Password"
          placeholder="••••••••"
          error={errors.ownerPassword?.message}
          {...register("ownerPassword")}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          isLoading={mutation.isPending}
          className="w-full mt-4"
          size="lg"
        >
          Create Workspace
        </Button>
      </form>

      <p className="text-center text-[14px] text-warm-gray-500 mt-8">
        Already registered?{" "}
        <Link to={ROUTES.LOGIN} className="text-notion-blue hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
