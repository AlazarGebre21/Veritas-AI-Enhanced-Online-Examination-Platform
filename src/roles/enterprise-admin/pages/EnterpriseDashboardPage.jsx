import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  FileText,
  Activity,
  CreditCard,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { useMyEnterprise } from "../hooks/useMyEnterprise.js";
import { useEnterpriseSummary } from "../hooks/useEnterpriseSummary.js";
import { useEnterpriseSubscription } from "../hooks/useEnterpriseSubscription.js";
import { Card, CardContent, Badge, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";
import { SUBSCRIPTION_STATUS } from "@/config/constants.js";

/** Maps subscription status to badge variant. */
function subBadgeVariant(status) {
  if (status === SUBSCRIPTION_STATUS.ACTIVE) return "success";
  if (status === SUBSCRIPTION_STATUS.TRIAL) return "info";
  if (status === SUBSCRIPTION_STATUS.PAST_DUE) return "warning";
  return "neutral";
}

export default function EnterpriseDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const enterpriseId = user?.enterpriseId;

  const { data: enterprise, isLoading: entLoading } = useMyEnterprise();
  const { data: summary, isLoading: sumLoading } = useEnterpriseSummary(enterpriseId);
  const { data: subscription, isLoading: subLoading } = useEnterpriseSubscription(enterpriseId);

  const isLoading = entLoading || sumLoading;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-whisper pb-6">
        <h1 className="text-2xl font-bold text-notion-black">
          {entLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            <>Welcome back, {user?.firstName} 👋</>
          )}
        </h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          {entLoading ? (
            <Skeleton className="h-4 w-48 mt-2" />
          ) : (
            <>{enterprise?.displayName} — Enterprise Dashboard</>
          )}
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={ClipboardList}
          label="Active Exams"
          value={summary?.active_exam_count}
          color="notion-blue"
          isLoading={isLoading}
        />
        <StatCard
          icon={Activity}
          label="Live Sessions"
          value={summary?.active_session_count}
          color="success"
          isLoading={isLoading}
        />
        <StatCard
          icon={Users}
          label="Staff Users"
          value={summary?.user_count}
          color="[#d9730d]"
          isLoading={isLoading}
        />
        <StatCard
          icon={CreditCard}
          label="Subscription"
          value={summary?.subscription_status || subscription?.subscription_status || "—"}
          isStatus
          statusVariant={subBadgeVariant(summary?.subscription_status || subscription?.subscription_status)}
          color="[#9333ea]"
          isLoading={isLoading || subLoading}
        />
      </div>

      {/* ── Subscription Info Banner ────────────────────────────────────── */}
      {!subLoading && subscription && (
        <Card className="border-l-4 border-l-notion-blue">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-notion-blue shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-notion-black">
                  Subscription Plan
                </p>
                <p className="text-[13px] text-warm-gray-500 mt-0.5">
                  Status: <Badge variant={subBadgeVariant(subscription.subscription_status)} className="ml-1">{subscription.subscription_status}</Badge>
                  {subscription.current_period_end && (
                    <span className="ml-3">
                      Renews {formatDate(subscription.current_period_end)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link
              to={ROUTES.BILLING}
              className="text-[13px] font-medium text-notion-blue hover:underline flex items-center gap-1 shrink-0"
            >
              Manage billing <ArrowRight size={14} />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-notion-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            to={ROUTES.EXAMS}
            icon={ClipboardList}
            title="Manage Exams"
            description="Create, schedule, and monitor exams"
            color="notion-blue"
          />
          <QuickAction
            to={ROUTES.QUESTIONS}
            icon={FileText}
            title="Question Bank"
            description="Build and organize your questions"
            color="[#d9730d]"
          />
          <QuickAction
            to={ROUTES.CANDIDATES}
            icon={UserCheck}
            title="Candidates"
            description="Add candidates and manage enrollments"
            color="success"
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, isLoading, isStatus, statusVariant }) {
  return (
    <Card className="hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
      <CardContent className="flex items-center p-5">
        <div
          className={`w-11 h-11 rounded-full bg-${color}/10 flex items-center justify-center text-${color} mr-4 shrink-0`}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-warm-gray-500 uppercase tracking-wide truncate">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mt-1" />
          ) : isStatus ? (
            <Badge variant={statusVariant} className="mt-1.5">{value}</Badge>
          ) : (
            <h3 className="text-2xl font-bold text-notion-black mt-0.5">{value ?? "—"}</h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ to, icon: Icon, title, description, color }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-5 rounded-comfortable border border-whisper bg-white hover:shadow-card hover:border-notion-blue/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center text-${color} shrink-0 group-hover:scale-110 transition-transform`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-notion-black group-hover:text-notion-blue transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-warm-gray-500 mt-0.5 line-clamp-1">{description}</p>
      </div>
      <ArrowRight
        size={16}
        className="text-warm-gray-300 group-hover:text-notion-blue group-hover:translate-x-0.5 transition-all mt-0.5 ml-auto shrink-0"
      />
    </Link>
  );
}
