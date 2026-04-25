import { useState } from "react";
import { OctagonX } from "lucide-react";
import { useExamSessions, useTerminateSession } from "../hooks/useExams.js";
import { Badge, Skeleton } from "@/components/ui/index.js";
import { Modal, Button } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

const STATUS_VARIANT = {
  Active: "success", Submitted: "info",
  Expired: "neutral", Terminated: "neutral",
};

export function ExamSessionsTab({ examId }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [terminateTarget, setTerminateTarget] = useState(null);
  const [reason, setReason] = useState("");

  const params = statusFilter !== "All" ? { status: statusFilter } : {};
  const { data, isLoading } = useExamSessions(examId, params);
  const sessions = data?.data || [];

  const terminate = useTerminateSession();

  function handleTerminate() {
    terminate.mutate(
      { id: terminateTarget.id, reason: reason || "Terminated by administrator" },
      { onSuccess: () => { setTerminateTarget(null); setReason(""); } }
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-whisper">
        {["All", "Active", "Submitted", "Expired", "Terminated"].map((tab) => (
          <button key={tab} onClick={() => setStatusFilter(tab)}
            className={`px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
              statusFilter === tab ? "border-notion-blue text-notion-blue" : "border-transparent text-warm-gray-500 hover:text-notion-black"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-[13px] text-warm-gray-500 py-10 border border-dashed border-whisper rounded-comfortable">
          No sessions found{statusFilter !== "All" ? ` with status "${statusFilter}"` : ""}.
        </p>
      ) : (
        <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors">
              <div>
                <p className="text-[14px] font-medium text-notion-black">
                  {s.candidate?.firstName} {s.candidate?.lastName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                  <span>Started: {formatDate(s.startedAt)}</span>
                  {s.monitoringScore != null && (
                    <span className={s.monitoringScore < 60 ? "text-destructive font-medium" : ""}>
                      Monitor: {s.monitoringScore}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <Badge variant={STATUS_VARIANT[s.status] || "neutral"}>{s.status}</Badge>
                {s.status === "Active" && (
                  <button onClick={() => setTerminateTarget(s)} title="Terminate session"
                    className="p-1.5 text-warm-gray-300 hover:text-destructive transition-colors rounded-micro hover:bg-warm-white">
                    <OctagonX size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Terminate Modal */}
      <Modal isOpen={!!terminateTarget} onClose={() => setTerminateTarget(null)} title="Terminate Session">
        <div className="space-y-4">
          <p className="text-[14px] text-warm-gray-500">
            Terminate the session for <strong>{terminateTarget?.candidate?.firstName} {terminateTarget?.candidate?.lastName}</strong>? This cannot be undone.
          </p>
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Reason (optional)</label>
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Suspected cheating..."
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setTerminateTarget(null)}>Cancel</Button>
            <button onClick={handleTerminate} disabled={terminate.isPending}
              className="px-4 py-2 text-[14px] font-medium text-white bg-destructive hover:bg-destructive/90 rounded-micro transition-colors disabled:opacity-50">
              {terminate.isPending ? "Terminating..." : "Terminate Session"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
