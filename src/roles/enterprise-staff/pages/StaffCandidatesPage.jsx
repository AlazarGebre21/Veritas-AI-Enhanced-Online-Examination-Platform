import { useState } from "react";
import { Users } from "lucide-react";
import { useCandidates } from "../hooks/useStaffData.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import { Badge } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

// ── Columns (read-only — no action menu) ────────────────────────────────
const columns = [
  {
    header: "Name",
    accessor: (row) => (
      <div>
        <p className="font-medium text-notion-black text-[14px]">
          {row.firstName} {row.lastName}
        </p>
        {row.externalId && (
          <p className="text-[11px] text-warm-gray-300 font-mono mt-0.5">
            ID: {row.externalId}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Email",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500">
        {row.email || "—"}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (row) => (
      <Badge variant={row.isActive ? "success" : "neutral"}>
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "Added",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
];

// ── Main page ───────────────────────────────────────────────────────────
export default function StaffCandidatesPage() {
  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const { data, isLoading } = useCandidates({ page, limit: LIMIT, sort: "created_at", sort_dir: "desc" });
  const candidates = data?.data || [];
  const meta = data?.metadata;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Candidates</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">
            View the candidate pool for your enterprise.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-warm-gray-400 bg-warm-white px-3 py-1.5 rounded-full">
          <Users size={14} />
          Read-only
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={candidates}
        isLoading={isLoading}
        emptyMessage="No candidates found. Candidates are managed by your enterprise administrator."
      />

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[13px] text-warm-gray-500">
            Page {meta.current_page} of {meta.total_pages} &middot; {meta.total_elements} total
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
    </div>
  );
}
