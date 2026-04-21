import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building2, UserCircle, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
import { useEnterpriseDetail } from "../hooks/useEnterpriseDetail.js";
import { useUpdateEnterpriseStatus } from "../hooks/useUpdateEnterpriseStatus.js";
import { Card, CardContent, Button, Badge, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { ENTERPRISE_STATUS } from "@/config/constants.js";
import { formatDate } from "@/lib/utils/date.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

export default function EnterpriseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: enterprise, isLoading } = useEnterpriseDetail(id);
  const statusMutation = useUpdateEnterpriseStatus();

  async function handleStatusChange(newStatus) {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    
    try {
      await statusMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Enterprise status updated to ${newStatus}`);
    } catch (err) {
      toast.error(normalizeError(err, "Failed to update status"));
    }
  }

  if (isLoading) {
    return <div className="p-6 space-y-4"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!enterprise) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-notion-black mb-2">Enterprise not found</h2>
        <Button onClick={() => navigate(ROUTES.ADMIN_ENTERPRISES)} variant="secondary">Go Back</Button>
      </div>
    );
  }

  let badgeVariant = "neutral";
  if (enterprise.status === ENTERPRISE_STATUS.ACTIVE) badgeVariant = "success";
  if (enterprise.status === ENTERPRISE_STATUS.PENDING_APPROVAL) badgeVariant = "warning";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 border-b border-whisper pb-6">
        <button 
          onClick={() => navigate(ROUTES.ADMIN_ENTERPRISES)}
          className="p-1.5 rounded-micro bg-warm-white hover:bg-whisper transition-colors text-warm-gray-500 hover:text-notion-black"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-notion-black">{enterprise.displayName}</h1>
            <Badge variant={badgeVariant}>{enterprise.status}</Badge>
          </div>
          <p className="text-warm-gray-500 text-[14px] mt-1">{enterprise.slug}.veritas.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Workspace Info</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Legal Name</p>
                    <p className="text-[14px] text-warm-gray-500">{enterprise.legalName || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Enterprise ID</p>
                    <p className="text-[14px] text-warm-gray-500 font-mono text-xs">{enterprise.id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Registered On</p>
                    <p className="text-[14px] text-warm-gray-500">{formatDate(enterprise.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Contact Email</p>
                    <p className="text-[14px] text-warm-gray-500">{enterprise.contactEmail || "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCircle size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Owner Account ID</p>
                    <p className="text-[14px] text-warm-gray-500 font-mono text-xs">{enterprise.ownerAccountID || "Pending"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions / Subscription Status */}
        <div className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Administration</h2>
              
              <div className="space-y-2">
                {enterprise.status === ENTERPRISE_STATUS.PENDING_APPROVAL && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusChange(ENTERPRISE_STATUS.ACTIVE)}
                    isLoading={statusMutation.isPending}
                  >
                    Approve Workspace
                  </Button>
                )}

                {enterprise.status === ENTERPRISE_STATUS.ACTIVE && (
                  <Button 
                    variant="danger" 
                    className="w-full bg-warning hover:bg-warning/90 text-white border-0" 
                    onClick={() => handleStatusChange(ENTERPRISE_STATUS.SUSPENDED)}
                    isLoading={statusMutation.isPending}
                  >
                    Suspend Workspace
                  </Button>
                )}

                {enterprise.status === ENTERPRISE_STATUS.SUSPENDED && (
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    onClick={() => handleStatusChange(ENTERPRISE_STATUS.ACTIVE)}
                    isLoading={statusMutation.isPending}
                  >
                    Restore Workspace
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Subscription</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-warm-gray-300 font-medium">STATUS</p>
                  <p className="text-[14px] font-medium text-notion-black">{enterprise.subscriptionStatus || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-warm-gray-300 font-medium">PLAN ID</p>
                  <p className="text-[14px] text-warm-gray-500 font-mono text-xs">{enterprise.subscriptionPlanID || "Free Trial"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
