import { useState } from "react";
import {
  CreditCard, Receipt, Clock, DollarSign, CalendarDays,
  ArrowUpRight, FileText, RefreshCw, XCircle, ChevronLeft, ChevronRight,
  ExternalLink, Download, Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { useBillingSummary } from "../hooks/useBillingSummary.js";
import { useInvoices } from "../hooks/useInvoices.js";
import { usePaymentHistory } from "../hooks/usePaymentHistory.js";
import { useEnterpriseSubscription } from "../hooks/useEnterpriseSubscription.js";
import { useCancelSubscription } from "../hooks/useCancelSubscription.js";
import { useReactivateSubscription } from "../hooks/useReactivateSubscription.js";
import { Card, CardContent, Badge, Skeleton, Button } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

/** Formats ETB price nicely. */
function formatPrice(amount, currency = "ETB") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ET", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

/** Status → badge variant mapping. */
function statusVariant(status) {
  const map = {
    Active: "success",
    Paid: "success",
    Succeeded: "success",
    Trial: "warning",
    PastDue: "warning",
    Pending: "warning",
    Draft: "neutral",
    Open: "neutral",
    Cancelled: "neutral",
    Expired: "neutral",
    Failed: "neutral",
    Void: "neutral",
  };
  return map[status] || "neutral";
}

export default function BillingPage() {
  const enterpriseId = useAuthStore((s) => s.user?.enterpriseId);

  const { data: summary, isLoading: summaryLoading } = useBillingSummary();
  const { data: subscription, isLoading: subLoading } = useEnterpriseSubscription(enterpriseId);

  const cancelMutation = useCancelSubscription(enterpriseId);
  const reactivateMutation = useReactivateSubscription(enterpriseId);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-whisper pb-6">
        <h1 className="text-2xl font-bold text-notion-black">Billing & Subscription</h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          Manage your subscription plan, view invoices, and track payment history.
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} isLoading={summaryLoading} />

      {/* Current Subscription */}
      <SubscriptionSection
        subscription={subscription}
        summary={summary}
        isLoading={subLoading}
        onCancel={() => {
          if (window.confirm("Cancel your subscription at the end of the current period?")) {
            cancelMutation.mutate({ cancelAtPeriodEnd: true });
          }
        }}
        onReactivate={() => reactivateMutation.mutate()}
        isCancelling={cancelMutation.isPending}
        isReactivating={reactivateMutation.isPending}
      />

      {/* Invoices Table */}
      <InvoicesSection />

      {/* Payment History Table */}
      <PaymentHistorySection />
    </div>
  );
}

/* ─── Summary Cards ──────────────────────────────────────────────────────────── */

function SummaryCards({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-comfortable" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Active Plan",
      value: summary?.active_plan_name || "None",
      icon: CreditCard,
      color: "text-notion-blue",
      bg: "bg-notion-blue/10",
    },
    {
      label: "Subscription Status",
      value: summary?.subscription_status || "—",
      icon: Clock,
      color: summary?.subscription_status === "Active" ? "text-success" : "text-warning",
      bg: summary?.subscription_status === "Active" ? "bg-success/10" : "bg-warning/10",
      badge: true,
    },
    {
      label: "Outstanding Balance",
      value: formatPrice(summary?.outstanding_balance),
      icon: DollarSign,
      color: summary?.outstanding_balance > 0 ? "text-destructive" : "text-success",
      bg: summary?.outstanding_balance > 0 ? "bg-destructive/10" : "bg-success/10",
    },
    {
      label: "Paid This Year",
      value: formatPrice(summary?.total_paid_ytd),
      icon: ArrowUpRight,
      color: "text-notion-blue",
      bg: "bg-notion-blue/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center p-5">
            <div className={`w-11 h-11 rounded-full ${card.bg} flex items-center justify-center ${card.color} mr-4 shrink-0`}>
              <card.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-warm-gray-500 uppercase tracking-wide">{card.label}</p>
              {card.badge ? (
                <Badge variant={statusVariant(summary?.subscription_status)} className="mt-1">
                  {card.value}
                </Badge>
              ) : (
                <p className="text-xl font-bold text-notion-black mt-0.5 truncate">{card.value}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Subscription Section ───────────────────────────────────────────────────── */

function SubscriptionSection({ subscription, summary, isLoading, onCancel, onReactivate, isCancelling, isReactivating }) {
  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-comfortable" />;
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-warm-gray-500">
          No active subscription found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-notion-black uppercase tracking-wide">Current Subscription</h2>
          <Badge variant={statusVariant(subscription.status)}>{subscription.status}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-xs text-warm-gray-300 font-medium uppercase mb-1">Plan</p>
            <p className="text-[15px] font-medium text-notion-black">{summary?.active_plan_name || subscription.plan_id || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-warm-gray-300 font-medium uppercase mb-1">Current Period</p>
            <p className="text-[14px] text-warm-gray-500">
              {subscription.current_period_start ? formatDate(subscription.current_period_start) : "—"}
              {" — "}
              {subscription.current_period_end ? formatDate(subscription.current_period_end) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-gray-300 font-medium uppercase mb-1">Next Billing</p>
            <p className="text-[14px] text-warm-gray-500 flex items-center gap-1.5">
              <CalendarDays size={14} className="text-warm-gray-300" />
              {summary?.next_billing_date ? formatDate(summary.next_billing_date) : "—"}
            </p>
          </div>
        </div>

        {/* Cancellation banner */}
        {subscription.cancel_at_period_end && (
          <div className="bg-warning/5 border border-warning/20 rounded-micro px-4 py-3 mb-4 flex items-center justify-between">
            <p className="text-[13px] text-notion-black">
              <span className="font-medium">Scheduled for cancellation</span> at the end of the current period.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={onReactivate}
              isLoading={isReactivating}
              className="gap-1.5 shrink-0"
            >
              <RefreshCw size={13} />
              Reactivate
            </Button>
          </div>
        )}

        {/* Actions */}
        {!subscription.cancel_at_period_end && subscription.status !== "Cancelled" && (
          <div className="pt-4 border-t border-whisper">
            <Button
              className="gap-2 bg-white border border-destructive/20 text-warm-gray-500 hover:text-destructive hover:bg-destructive-bg hover:border-destructive/40 transition-all text-[13px]"
              onClick={onCancel}
              isLoading={isCancelling}
            >
              <XCircle size={14} />
              Cancel Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Invoices Table ─────────────────────────────────────────────────────────── */

function InvoicesSection() {
  const [params, setParams] = useState({ page: 1, limit: 10, sort: "created_at", sort_dir: "desc" });
  const { data, isLoading } = useInvoices(params);

  const invoices = data?.data ?? [];
  const meta = data?.metadata;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-notion-black uppercase tracking-wide flex items-center gap-2">
            <Receipt size={16} className="text-warm-gray-300" />
            Invoices
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-micro" />)}
          </div>
        ) : invoices.length === 0 ? (
          <p className="text-center text-warm-gray-500 py-8 text-[14px]">No invoices yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-whisper text-left">
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Number</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Amount Due</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Paid</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Remaining</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Due Date</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-whisper/50 hover:bg-warm-white/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-notion-black">{inv.number || "—"}</td>
                      <td className="py-3 px-3 text-notion-black">{formatPrice(inv.amount_due, inv.currency)}</td>
                      <td className="py-3 px-3 text-success">{formatPrice(inv.amount_paid, inv.currency)}</td>
                      <td className="py-3 px-3 text-warm-gray-500">{formatPrice(inv.amount_remaining, inv.currency)}</td>
                      <td className="py-3 px-3">
                        <Badge variant={statusVariant(inv.status)}>{inv.status}</Badge>
                      </td>
                      <td className="py-3 px-3 text-warm-gray-500">{inv.due_date ? formatDate(inv.due_date) : "—"}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {inv.hosted_invoice_url && (
                            <a
                              href={inv.hosted_invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-micro text-warm-gray-300 hover:text-notion-blue hover:bg-notion-blue/5 transition-colors"
                              title="View online"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {inv.invoice_pdf_url && (
                            <a
                              href={inv.invoice_pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-micro text-warm-gray-300 hover:text-notion-blue hover:bg-notion-blue/5 transition-colors"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.total_pages > 1 && (
              <PaginationControls meta={meta} onPageChange={(page) => setParams((p) => ({ ...p, page }))} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Payment History Table ──────────────────────────────────────────────────── */

function PaymentHistorySection() {
  const [params, setParams] = useState({ page: 1, limit: 10, sort: "created_at", sort_dir: "desc" });
  const { data, isLoading } = usePaymentHistory(params);

  const payments = data?.data ?? [];
  const meta = data?.metadata;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-notion-black uppercase tracking-wide flex items-center gap-2">
            <FileText size={16} className="text-warm-gray-300" />
            Payment History
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-micro" />)}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center text-warm-gray-500 py-8 text-[14px]">No payment records yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-whisper text-left">
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Amount</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Status</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Method</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Provider</th>
                    <th className="py-2.5 px-3 font-semibold text-warm-gray-500 uppercase text-[11px] tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-whisper/50 hover:bg-warm-white/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-notion-black">{formatPrice(p.amount, p.currency)}</td>
                      <td className="py-3 px-3">
                        <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                      </td>
                      <td className="py-3 px-3 text-warm-gray-500">{p.payment_method_type || "—"}</td>
                      <td className="py-3 px-3 text-warm-gray-500">{p.provider || "—"}</td>
                      <td className="py-3 px-3 text-warm-gray-500">{p.created_at ? formatDate(p.created_at) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.total_pages > 1 && (
              <PaginationControls meta={meta} onPageChange={(page) => setParams((p) => ({ ...p, page }))} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Pagination Controls ────────────────────────────────────────────────────── */

function PaginationControls({ meta, onPageChange }) {
  return (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-whisper">
      <p className="text-[12px] text-warm-gray-300">
        Page {meta.current_page} of {meta.total_pages} · {meta.total_elements} total
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!meta.has_previous}
          className="p-1.5 rounded-micro text-warm-gray-500 hover:text-notion-black hover:bg-warm-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!meta.has_next}
          className="p-1.5 rounded-micro text-warm-gray-500 hover:text-notion-black hover:bg-warm-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
