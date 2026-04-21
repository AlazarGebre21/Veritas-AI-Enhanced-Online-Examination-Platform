import { CheckCircle2, Zap, Building2 } from "lucide-react";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans.js";
import { Badge, Skeleton } from "@/components/ui/index.js";

/** Formats ETB price nicely. */
function formatPrice(price, currency = "ETB") {
  return new Intl.NumberFormat("en-ET", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

export default function SubscriptionPlansPage() {
  const { data: plans, isLoading } = useSubscriptionPlans();

  return (
    <div className="space-y-6">
      <div className="border-b border-whisper pb-6">
        <h1 className="text-2xl font-bold text-notion-black">Subscription Plans</h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          Review available plans. Enterprises self-enroll via the upgrade flow.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-comfortable" />
          ))}
        </div>
      ) : !plans || plans.length === 0 ? (
        <div className="text-center py-20 text-warm-gray-500">No subscription plans found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan }) {
  const features = plan.features ? Object.values(plan.features).filter(Boolean) : [];

  return (
    <div className="bg-white rounded-comfortable border border-whisper shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Card header accent */}
      <div className="h-1 w-full bg-notion-blue" />

      <div className="p-6 flex flex-col flex-1">
        {/* Name + status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-notion-blue" />
              <h2 className="font-bold text-notion-black text-[17px]">{plan.name}</h2>
            </div>
            <p className="text-warm-gray-500 text-[13px] leading-snug">{plan.description || "—"}</p>
          </div>
          <Badge variant={plan.is_active ? "success" : "neutral"}>
            {plan.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Price */}
        <div className="mb-5">
          <span className="text-3xl font-bold text-notion-black">{formatPrice(plan.price, plan.currency)}</span>
          <span className="text-warm-gray-500 text-sm ml-1">/ {plan.billing_cycle}</span>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-2 flex-1">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[14px] text-notion-black">
                <CheckCircle2 size={15} className="text-success shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
        )}

        {/* Footer meta */}
        <div className="mt-6 pt-4 border-t border-whisper flex items-center gap-2 text-[12px] text-warm-gray-300 font-medium">
          <Building2 size={13} />
          <span className="font-mono">{plan.slug}</span>
        </div>
      </div>
    </div>
  );
}
