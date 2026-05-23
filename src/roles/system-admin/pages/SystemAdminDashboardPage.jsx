import { Building2, CreditCard, Activity, AlertCircle, Loader2, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEnterprises } from "../hooks/useEnterprises.js";
import { useSystemHealth } from "@/hooks/useSystemHealth.js";
import { useSystemAnalytics } from "../hooks/useSystemAnalytics.js";
import { Card, CardContent, Skeleton } from "@/components/ui/index.js";
import { DonutChart, AreaChartCard } from "@/components/charts/index.js";
import { ROUTES } from "@/config/routes.js";

export default function SystemAdminDashboardPage() {
  const { data: enterprisesData, isLoading: entLoading } = useEnterprises({ limit: 1 });
  const { isHealthy, isLoading: healthLoading, isError: healthError } = useSystemHealth();
  const { isLoading: analyticsLoading, analytics, CHART_COLORS } = useSystemAnalytics();

  const totalEnterprises = enterprisesData?.metadata?.total_elements || 0;

  // Derived display values for the health card
  const healthColor = healthLoading
    ? "text-warm-gray-400"
    : isHealthy
    ? "text-success"
    : "text-destructive";

  const healthDotColor = healthLoading
    ? "bg-warm-gray-300"
    : isHealthy
    ? "bg-success animate-pulse"
    : "bg-destructive";

  const healthLabel = healthLoading ? "Checking…" : isHealthy ? "Healthy" : "Degraded";
  const HealthIcon = healthError ? AlertCircle : healthLoading ? Loader2 : Activity;

  const isLoading = entLoading || analyticsLoading;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-whisper pb-6">
        <h1 className="text-2xl font-bold text-notion-black">System Overview</h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          Monitor enterprise tenants, subscriptions, and system health.
        </p>
      </div>

      {/* ── Top Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-transparent border-warm-gray-300">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-notion-blue/10 flex items-center justify-center text-notion-blue mr-4 shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">Total Tenants</p>
              {entLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-notion-black mt-1">
                  {totalEnterprises}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-warm-gray-300 shadow-none">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mr-4 shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">Active Tenants</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-notion-black mt-1">
                  {analytics?.activeCount || 0}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-warm-gray-300 shadow-none">
          <CardContent className="flex items-center p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 bg-[#d9730d]/10 text-[#d9730d]`}>
              <Users size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">Pending</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h3 className="text-3xl font-bold text-notion-black mt-1">
                  {analytics?.pendingCount || 0}
                </h3>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-warm-gray-300 shadow-none">
          <CardContent className="flex items-center p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${isHealthy ? "bg-success/10 text-success" : healthError ? "bg-destructive/10 text-destructive" : "bg-warm-gray-100 text-warm-gray-400"}`}>
              <HealthIcon size={24} className={healthLoading ? "animate-spin" : ""} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">System Health</p>
              <h3 className={`text-2xl font-bold mt-1.5 flex items-center gap-2 ${healthColor}`}>
                <span className={`w-2 h-2 rounded-full ${healthDotColor}`} />
                {healthLabel}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── System Analytics ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 rounded-full bg-[#6940a5]" />
          <h2 className="text-lg font-semibold text-notion-black">Platform Analytics</h2>
        </div>

        {/* Analytics Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <Card key={i} className="bg-transparent border-warm-gray-300 shadow-none">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-52 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Enterprise Registrations Over Time */}
            <AreaChartCard
              data={analytics?.timeline ?? []}
              title="Tenant Registrations (All Time)"
              dataKey="count"
              xKey="month"
              color={CHART_COLORS.purple}
              height={260}
              className="bg-transparent border-warm-gray-300 shadow-none border"
            />

            {/* Subscription Distribution */}
            <DonutChart
               data={analytics?.subscriptionData ?? []}
               title="Subscription Plans Status"
               centerValue={analytics?.total ?? 0}
               centerLabel="Subscriptions"
               height={260}
               className="bg-transparent border-warm-gray-300 shadow-none border"
             />
          </div>
        )}
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-notion-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to={ROUTES.SYSTEM_ENTERPRISES}
            className="group flex items-start gap-4 p-5 rounded-comfortable border border-warm-gray-300 bg-transparent hover:border-notion-blue/50 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-notion-blue/10 flex items-center justify-center text-notion-blue shrink-0 group-hover:scale-110 transition-transform">
              <Building2 size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-notion-black group-hover:text-notion-blue transition-colors">
                Manage Tenants
              </h3>
              <p className="text-[13px] text-warm-gray-500 mt-0.5 line-clamp-1">Review new registrations and oversee tenant workspaces.</p>
            </div>
            <ArrowRight size={16} className="text-warm-gray-300 group-hover:text-notion-blue group-hover:translate-x-0.5 transition-all mt-0.5 ml-auto shrink-0" />
          </Link>

          <Link
            to={ROUTES.SYSTEM_PLANS}
            className="group flex items-start gap-4 p-5 rounded-comfortable border border-warm-gray-300 bg-transparent hover:border-[#2a9d99]/50 transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#2a9d99]/10 flex items-center justify-center text-[#2a9d99] shrink-0 group-hover:scale-110 transition-transform">
              <CreditCard size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-notion-black group-hover:text-[#2a9d99] transition-colors">
                Subscription Plans
              </h3>
              <p className="text-[13px] text-warm-gray-500 mt-0.5 line-clamp-1">Create and manage pricing tiers and features.</p>
            </div>
            <ArrowRight size={16} className="text-warm-gray-300 group-hover:text-[#2a9d99] group-hover:translate-x-0.5 transition-all mt-0.5 ml-auto shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
