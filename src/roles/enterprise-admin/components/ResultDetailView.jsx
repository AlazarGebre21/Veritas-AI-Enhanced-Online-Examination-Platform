import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useGradingDetail, useGradingLogs } from "../hooks/useGrading.js";
import { Badge, Skeleton, Button, Card, CardContent } from "@/components/ui/index.js";
import { formatDateTime } from "@/lib/utils/date.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import OverrideGradeModal from "./OverrideGradeModal.jsx";

export default function ResultDetailView({ sessionId, onBack, isStaff }) {
  const { data: detail, isLoading, isError } = useGradingDetail(sessionId);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("result");
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium">Failed to load grading details for this session.</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const passed = detail.percentage >= 60; // Or whatever is the passing score

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] text-warm-gray-500 hover:text-notion-black transition-colors"
        >
          <ArrowLeft size={16} /> Back to Submissions
        </button>

        {!isStaff && (
          <Button variant="secondary" onClick={() => setOverrideModalOpen(true)}>
            Override Grade
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-whisper">
        {["result", "audit"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? "border-notion-blue text-notion-blue"
                : "border-transparent text-warm-gray-500 hover:text-notion-black"
            }`}
          >
            {tab === "result" ? "Grade & Results" : "Grading Audit Log"}
          </button>
        ))}
      </div>

      {activeTab === "result" ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-notion-black">Candidate Grade Overview</h2>
                <div className="flex items-center gap-3 mt-2 text-[13px] text-warm-gray-500">
                  <span className="font-semibold tabular-nums text-notion-black">
                    {detail.total_awarded_points} / {detail.total_max_points} points
                  </span>
                  <span>•</span>
                  <span>Graded By: {detail.graded_by || 'System'}</span>
                  {detail.is_tampered && <Badge variant="destructive">Tampered</Badge>}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-bold tabular-nums ${passed ? "text-success" : "text-destructive"}`}>
                  {detail.percentage?.toFixed(1)}%
                </p>
                <Badge variant={passed ? "success" : "destructive"} className="mt-2 text-[13px]">
                  {passed ? "Passed" : "Failed"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Questions Scrollable List */}
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-notion-black pt-2">Question Breakdown</h3>
            {(detail.question_results || []).map((qr, idx) => {
              const isCorrect = qr.awarded_points > 0 && qr.awarded_points === qr.max_points;
              const isPartial = qr.awarded_points > 0 && qr.awarded_points < qr.max_points;
              return (
                <div key={qr.session_question_id || idx} className="border border-whisper rounded-comfortable overflow-hidden bg-white shadow-sm">
                  <div className="bg-warm-white px-5 py-3 border-b border-whisper flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-medium text-notion-black">Question {idx + 1}</span>
                      <Badge variant="neutral">{qr.question_type}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-medium tabular-nums text-warm-gray-500">
                        {qr.awarded_points} / {qr.max_points} pts
                      </span>
                      {isCorrect ? (
                        <CheckCircle className="text-success" size={20} />
                      ) : isPartial ? (
                        <Badge variant="info">Partial</Badge>
                      ) : (
                        <XCircle className="text-destructive" size={20} />
                      )}
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[15px] text-notion-black leading-relaxed">
                      {qr.title || "Question Content"}
                    </p>
                    <div className="mt-4 p-3 bg-warm-white/50 rounded-md border border-whisper">
                      <p className="text-[13px] text-warm-gray-500 font-medium mb-1">Status / Feedback</p>
                      <p className="text-[14px] text-notion-black">{qr.status || "Graded"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!detail.question_results || detail.question_results.length === 0) && (
              <p className="text-center text-warm-gray-500 py-10 border border-whisper rounded-comfortable border-dashed">
                No question breakdown available.
              </p>
            )}
          </div>
        </div>
      ) : (
        <GradingLogsSection sessionId={sessionId} />
      )}

      <OverrideGradeModal 
        isOpen={overrideModalOpen} 
        onClose={() => setOverrideModalOpen(false)} 
        sessionId={sessionId}
        currentScore={detail.total_awarded_points}
      />
    </div>
  );
}

function EventBadge({ event }) {
  const isCreate = event?.includes(".created") || event?.includes("create");
  const isDelete = event?.includes(".deleted") || event?.includes("delete");
  const isUpdate = event?.includes(".updated") || event?.includes("update") || event?.toLowerCase().includes("override");

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

const GRADING_AUDIT_COLUMNS = [
  {
    header: "Action",
    className: "min-w-[140px]",
    accessor: (row) => <EventBadge event={row.action || "Override"} />,
  },
  {
    header: "Actor",
    accessor: (row) => (
      <div>
        <span className="text-[13px] text-notion-black font-medium block">{row.actor_role || "—"}</span>
        {row.actor_id && <span className="text-[11px] text-warm-gray-500 font-mono block mt-0.5">{row.actor_id}</span>}
      </div>
    ),
  },
  {
    header: "IP Address",
    accessor: (row) => (
      <span className="text-[12px] font-mono text-warm-gray-500 block break-all">{row.ip_address || "—"}</span>
    ),
  },
  {
    header: "Reason",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 truncate block max-w-[200px]" title={row.reason}>{row.reason || "—"}</span>
    ),
  },
  {
    header: "Date",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">{formatDateTime(row.created_at)}</span>
    ),
  },
];

function GradingLogsSection({ sessionId }) {
  const { data: logs, isLoading } = useGradingLogs(sessionId);

  return (
    <div className="space-y-4">
      <DataTable
        columns={GRADING_AUDIT_COLUMNS}
        data={logs || []}
        isLoading={isLoading}
        emptyMessage="No grading audit history for this session."
      />
    </div>
  );
}

