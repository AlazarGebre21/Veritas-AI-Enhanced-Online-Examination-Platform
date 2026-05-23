import { ShieldAlert } from "lucide-react";
import { useEnterpriseAuditLogs } from "../hooks/useEnterpriseAuditLogs.js";
import { formatDateTime } from "@/lib/utils/date.js";
import { DataTable } from "@/components/shared/DataTable.jsx";

function EventBadge({ event }) {
  const isCreate = event?.includes(".created") || event?.includes("create");
  const isDelete = event?.includes(".deleted") || event?.includes("delete") || event?.includes("suspend");
  const isUpdate = event?.includes(".updated") || event?.includes("update") || event?.includes("approve");

  let cls = "bg-badge-bg text-badge-text";
  if (isCreate) cls = "bg-[#ebf5ed] text-success";
  if (isDelete) cls = "bg-[#fde8e8] text-warning";
  if (isUpdate) cls = "bg-[#fff0e6] text-[#d9730d]";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium font-mono ${cls}`}>
      {event}
    </span>
  );
}

const AUDIT_COLUMNS = [
  {
    header: "Event",
    className: "min-w-[180px]",
    accessor: (row) => <EventBadge event={row.event} />,
  },
  {
    header: "Actor Role",
    accessor: (row) => (
      <span className="text-[13px] text-notion-black font-medium">{row.actor_role || "—"}</span>
    ),
  },
  {
    header: "Actor ID",
    accessor: (row) => (
      <span className="text-[12px] font-mono text-warm-gray-500 block break-all">{row.actor_id || "—"}</span>
    ),
  },
  {
    header: "Date",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">{formatDateTime(row.created_at)}</span>
    ),
  },
];

const MAX_LOGS = 50;

export default function AuditLogsPage() {
  const { data, isLoading } = useEnterpriseAuditLogs({ limit: MAX_LOGS });
  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-whisper pb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert size={22} className="text-notion-blue" />
          <div>
            <h1 className="text-2xl font-bold text-notion-black">Audit Logs</h1>
            <p className="text-warm-gray-500 text-[15px] mt-0.5">
              Review and track enterprise activity audit trail.
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={AUDIT_COLUMNS}
        data={logs}
        isLoading={isLoading}
        emptyMessage="No enterprise audit logs found."
      />
    </div>
  );
}
