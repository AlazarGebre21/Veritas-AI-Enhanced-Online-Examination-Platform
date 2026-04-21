import { Building2, CreditCard, Activity } from "lucide-react";
import { useEnterprises } from "../hooks/useEnterprises.js";
import { Card, CardContent } from "@/components/ui/index.js";

export default function SystemAdminDashboardPage() {
  // Fetch with limit: 1 just to quickly get total_elements from metadata
  const { data: enterprisesData, isLoading } = useEnterprises({ limit: 1 });

  const totalEnterprises = enterprisesData?.metadata?.total_elements || 0;

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
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning mr-4 shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-warm-gray-500 uppercase tracking-wide">System Health</p>
              <h3 className="text-2xl font-bold text-success mt-1.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                Healthy
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
