import { useState } from "react";
import { useAuditLogs } from "../hooks/useAuditLogs.js";
import { useEnterprises } from "../hooks/useEnterprises.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import { Input } from "@/components/ui/index.js";
import { formatDate, formatDateTime } from "@/lib/utils/date.js";
import { Search, ShieldAlert } from "lucide-react";

/** Maps an event string to a readable label + colour. */
function EventBadge({ event }) {
  const isCreate = event?.includes(".created");
  const isDelete = event?.includes(".deleted");
  const isUpdate = event?.includes(".updated");

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
    className: "max-w-[160px]",
    accessor: (row) => (
      <span className="text-[12px] font-mono text-warm-gray-500 truncate block">{row.actor_id || "—"}</span>
    ),
  },
  {
    header: "Date",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">{formatDateTime(row.created_at)}</span>
    ),
  },
];

export default function SystemAuditLogPage() {
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Load enterprise list for the selector dropdown
  const { data: enterprisesData } = useEnterprises({ limit: 100 });
  const enterprises = enterprisesData?.data || [];

  const { data, isLoading } = useAuditLogs(selectedEnterpriseId, {
    page,
    limit: LIMIT,
    sort: "created_at",
    sort_dir: "desc",
  });

  const logs = data?.data || [];
  const meta = data?.metadata;

  return (
    <div className="space-y-6">
      <div className="border-b border-whisper pb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert size={22} className="text-notion-blue" />
          <div>
            <h1 className="text-2xl font-bold text-notion-black">Audit Logs</h1>
            <p className="text-warm-gray-500 text-[15px] mt-0.5">
              Track enterprise-level actions across all tenants.
            </p>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full max-w-xs">
          <label className="block text-[13px] font-medium text-warm-gray-500 mb-1.5">Enterprise</label>
          <select
            value={selectedEnterpriseId}
            onChange={(e) => { setSelectedEnterpriseId(e.target.value); setPage(1); }}
            className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] text-notion-black appearance-none focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white"
          >
            <option value="">— Select enterprise —</option>
            {enterprises.map((e) => (
              <option key={e.id} value={e.id}>{e.displayName}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedEnterpriseId ? (
        <div className="text-center py-20 text-warm-gray-300">
          <ShieldAlert size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-[15px]">Select an enterprise to view its audit trail.</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={AUDIT_COLUMNS}
            data={logs}
            isLoading={isLoading}
            emptyMessage="No audit events found for this enterprise."
          />

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-[13px] text-warm-gray-500">
                Page {meta.current_page} of {meta.total_pages} &middot; {meta.total_elements} total events
              </p>
              <div className="flex gap-2">
                <button
                  disabled={!meta.has_previous}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={!meta.has_next}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
