import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building2, UserCircle, Calendar, Hash, Phone, MapPin, Globe, CheckCircle, RefreshCw, Trash2, ShieldAlert, History, ExternalLink, Activity } from "lucide-react";
import { toast } from "sonner";
import { useEnterpriseDetail } from "../hooks/useEnterpriseDetail.js";
import { useApproveEnterprise } from "../hooks/useApproveEnterprise.js";
import { useReactivateEnterprise } from "../hooks/useReactivateEnterprise.js";
import { useSoftDeleteEnterprise } from "../hooks/useSoftDeleteEnterprise.js";
import { useHardDeleteEnterprise } from "../hooks/useHardDeleteEnterprise.js";
import { useRestoreEnterprise } from "../hooks/useRestoreEnterprise.js";
import { useEnterpriseStatus } from "../hooks/useEnterpriseStatus.js";
import { useEnterpriseSubscription } from "../hooks/useEnterpriseSubscription.js";
import { useCancelSubscription } from "../hooks/useCancelSubscription.js";
import { useRenewSubscription } from "../hooks/useRenewSubscription.js";
import { useSuspendPayment } from "../hooks/useSuspendPayment.js";
import { useUpdateSubscription } from "../hooks/useUpdateSubscription.js";
import { Card, CardContent, Button, Badge, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { ENTERPRISE_STATUS } from "@/config/constants.js";
import { formatDate } from "@/lib/utils/date.js";
import { normalizeError } from "@/lib/utils/errorNormalizer.js";

export default function EnterpriseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: enterprise, isLoading } = useEnterpriseDetail(id);
  const { data: detailedStatus } = useEnterpriseStatus(id);
  const { data: subscriptionInfo } = useEnterpriseSubscription(id);

  const approveMutation = useApproveEnterprise();
  const reactivateMutation = useReactivateEnterprise();
  const softDeleteMutation = useSoftDeleteEnterprise();
  const hardDeleteMutation = useHardDeleteEnterprise();
  const restoreMutation = useRestoreEnterprise();
  const cancelSubMutation = useCancelSubscription();
  const renewSubMutation = useRenewSubscription();
  const suspendPaymentMutation = useSuspendPayment();
  const updateSubMutation = useUpdateSubscription();

  async function handleAction(mutation, label, confirmMessage) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    
    try {
      await mutation.mutateAsync(id);
      toast.success(`${label} successful`);
    } catch (err) {
      toast.error(normalizeError(err, `Failed to ${label.toLowerCase()}`));
    }
  }

  if (isLoading) {
    return <div className="p-6 space-y-4"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!enterprise) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-notion-black mb-2">Enterprise not found</h2>
        <Button  onClick={() => navigate(ROUTES.ADMIN_ENTERPRISES)} variant="secondary">Go Back</Button>
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
        {enterprise.logoURL && (
          <div className="w-12 h-12 rounded-standard overflow-hidden border border-whisper bg-white flex-shrink-0">
            <img src={enterprise.logoURL} alt={enterprise.displayName} className="w-full h-full object-contain" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-notion-black">{enterprise.displayName}</h1>
            <Badge variant={badgeVariant}>{enterprise.status}</Badge>
          </div>
          <p className="text-warm-gray-500 text-[14px] mt-1">{enterprise.slug}.veritas.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Details (Left/Center) */}
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
                  <MapPin size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Location</p>
                    <p className="text-[14px] text-warm-gray-500">
                      {[enterprise.addressLine1, enterprise.city].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Custom Domain</p>
                    <p className="text-[14px] text-warm-gray-500">{enterprise.customDomain || "None"}</p>
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
                  <Phone size={18} className="text-warm-gray-300 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-medium text-notion-black">Contact Phone</p>
                    <p className="text-[14px] text-warm-gray-500">{enterprise.contactPhone || "—"}</p>
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

        {/* Sidebar Actions / Subscription Status (Middle) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Administration</h2>
              
              <div className="space-y-2">
                {enterprise.status === ENTERPRISE_STATUS.PENDING_APPROVAL && (
                  <Button 
                    className="w-full justify-start gap-2" 
                    onClick={() => handleAction(approveMutation, "Approval")}
                    isLoading={approveMutation.isPending}
                  >
                    <CheckCircle size={16} />
                    Approve Workspace
                  </Button>
                )}

                {enterprise.status === ENTERPRISE_STATUS.SUSPENDED && (
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start gap-2" 
                    onClick={() => handleAction(reactivateMutation, "Reactivation")}
                    isLoading={reactivateMutation.isPending}
                  >
                    <RefreshCw size={16} />
                    Reactivate Workspace
                  </Button>
                )}

                {enterprise.status === ENTERPRISE_STATUS.DELETED && (
                  <Button 
                    variant="secondary" 
                    className="w-full justify-start gap-2" 
                    onClick={() => handleAction(restoreMutation, "Restoration")}
                    isLoading={restoreMutation.isPending}
                  >
                    <History size={16} />
                    Restore Workspace
                  </Button>
                )}

                {enterprise.status === ENTERPRISE_STATUS.ACTIVE && (
                  <p className="text-xs text-warm-gray-400 italic px-1">
                    Workspace is active.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Subscription</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-warm-gray-300 font-medium uppercase">Status</p>
                  <p className="text-[14px] font-medium text-notion-black flex items-center gap-2">
                    {subscriptionInfo?.subscription_status  || "N/A"}
                    {subscriptionInfo?.subscription_status === "Trial" && (
                      <Badge variant="warning" className="text-[10px] py-0 px-1.5 h-4">Trial</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-warm-gray-300 font-medium uppercase">Plan</p>
                  <p className="text-[14px] text-warm-gray-500 font-mono text-xs">
                    {subscriptionInfo?.subscription_plan_id || "Free"}
                  </p>
                </div>
                {subscriptionInfo?.current_period_end && (
                  <div>
                    <p className="text-xs text-warm-gray-300 font-medium uppercase">Current Period Ends</p>
                    <p className="text-[14px] text-warm-gray-500">
                      {formatDate(subscriptionInfo.current_period_end)}
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2 border-t border-whisper">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleAction(renewSubMutation, "Renewal")}
                    isLoading={renewSubMutation.isPending}
                  >
                    <RefreshCw size={14} />
                    Renew Period
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleAction(suspendPaymentMutation, "Payment Suspension")}
                    isLoading={suspendPaymentMutation.isPending}
                  >
                    <ShieldAlert size={14} />
                    Suspend Payment
                  </Button>

                  <Button 
                    className="w-full justify-start gap-2 bg-white border border-destructive/20 text-warm-gray-500 hover:text-destructive hover:bg-destructive-bg hover:border-destructive/40 transition-all whitespace-nowrap text-[13px]"
                    onClick={() => handleAction(cancelSubMutation, "Cancellation", "Are you sure you want to cancel this subscription?")}
                    isLoading={cancelSubMutation.isPending}
                  >
                    <Trash2 size={14} />
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Status (Lifecycle) */}
          <Card>
            <CardContent>
              <h2 className="text-[15px] font-semibold text-notion-black mb-4 uppercase tracking-wide">Lifecycle</h2>
              <div className="space-y-3">
                {detailedStatus?.approved_at && (
                  <div>
                    <p className="text-xs text-warm-gray-300 font-medium uppercase">Approved At</p>
                    <p className="text-[13px] text-warm-gray-500">{formatDate(detailedStatus.approved_at)}</p>
                  </div>
                )}
                {detailedStatus?.suspended_at && (
                  <div>
                    <p className="text-xs text-warm-gray-300 font-medium uppercase">Suspended At</p>
                    <p className="text-[13px] text-destructive">{formatDate(detailedStatus.suspended_at)}</p>
                  </div>
                )}
                {detailedStatus?.deleted_at && (
                  <div>
                    <p className="text-xs text-warm-gray-300 font-medium uppercase">Soft Deleted At</p>
                    <p className="text-[13px] text-destructive">{formatDate(detailedStatus.deleted_at)}</p>
                  </div>
                )}
                {detailedStatus?.retention_until && (
                  <div>
                    <p className="text-xs text-warm-gray-300 font-medium uppercase">Retention Until</p>
                    <p className="text-[13px] font-medium text-warning">{formatDate(detailedStatus.retention_until)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone Column (Right) */}
        <div className="lg:col-span-1">
          <Card className="border-destructive/20 bg-destructive-bg/30 h-full">
            <CardContent>
              <h2 className="text-[15px] font-semibold text-destructive mb-4 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert size={16} />
                Danger Zone
              </h2>
              
              <div className="space-y-3">
                {enterprise.status !== ENTERPRISE_STATUS.DELETED && (
                  <Button 
                    className="w-full justify-start gap-2 bg-white border border-destructive/20 text-warm-gray-500 hover:text-destructive hover:bg-destructive-bg hover:border-destructive/40 transition-all whitespace-nowrap text-[13px]" 
                    onClick={() => handleAction(softDeleteMutation, "Soft Delete", "Are you sure you want to soft delete this enterprise? It will be archived for the retention period.")}
                    isLoading={softDeleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                    Soft Delete
                  </Button>
                )}

                <Button 
                  className="w-full justify-start gap-2 bg-destructive text-white border-0 hover:bg-red-500" 
                  onClick={() => handleAction(hardDeleteMutation, "Permanent Delete", "WARNING: This action is irreversible. All enterprise data will be permanently deleted. Are you absolutely sure?")}
                  isLoading={hardDeleteMutation.isPending}
                >
                  <Trash2 size={16} />
                  Permanent Delete
                </Button>

                <p className="text-[11px] text-warm-gray-400 mt-4 leading-relaxed">
                  Actions in this column are high-risk. Soft deletion preserves data for recovery, while permanent deletion wipes all workspace data immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
