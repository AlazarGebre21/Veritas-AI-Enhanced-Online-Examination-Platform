import { Building2, CreditCard, Activity, AlertCircle, Loader2 } from "lucide-react";
import { useEnterprises } from "../hooks/useEnterprises.js";
import { useSystemHealth } from "@/hooks/useSystemHealth.js";
import { Card, CardContent } from "@/components/ui/index.js";

export default function SystemAdminDashboardPage() {
  // Fetch with limit: 1 just to quickly get total_elements from metadata
  const { data: enterprisesData, isLoading } = useEnterprises({ limit: 1 });
  const { isHealthy, isLoading: healthLoading, isError: healthError } = useSystemHealth();

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-notion-black">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-notion-blue/10 flex items-center justify-center text-notion-blue mr-4 shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">Total Tenants</p>
              <h3 className="text-3xl font-bold text-notion-black mt-1">
                {isLoading ? "..." : totalEnterprises}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mr-4 shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-warm-gray-300 mt-1.5 line-clamp-1">—</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${isHealthy ? "bg-success/10 text-success" : healthError ? "bg-destructive/10 text-destructive" : "bg-warm-gray-100 text-warm-gray-400"}`}>
              <HealthIcon size={24} className={healthLoading ? "animate-spin" : ""} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">System Health</p>
              <h3 className={`text-2xl font-bold mt-1.5 flex items-center gap-2 ${healthColor}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${healthDotColor}`} />
                {healthLabel}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-notion-black mb-4">Quick Actions</h2>
        <div className="bg-warm-white p-6 rounded-standard border border-whisper">
          <p className="text-[15px] text-warm-gray-500">
            Navigate to the <strong>Enterprises</strong> tab in the sidebar to review new tenant registrations and manage existing workspaces.
          </p>
        </div>
      </div>
    </div>
  );
}

