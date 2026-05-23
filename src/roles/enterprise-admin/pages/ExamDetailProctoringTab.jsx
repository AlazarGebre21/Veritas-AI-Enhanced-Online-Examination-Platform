import { useState } from "react";
import { Eye } from "lucide-react";
import { useExamSessions } from "../hooks/useExams.js";
import { Skeleton, Modal, Badge } from "@/components/ui/index.js";
import ProctoringEventLog from "../components/ProctoringEventLog.jsx";
import { formatDate } from "@/lib/utils/date.js";

const STATUS_VARIANT = {
  Active: "success", Submitted: "info",
  Expired: "neutral", Terminated: "neutral",
};

export function ExamProctoringTab({ examId }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  const { data, isLoading } = useExamSessions(examId);
  const sessions = data?.data || [];
  
  const relevantSessions = sessions.filter(s => s.status !== "Draft" && s.status !== "Scheduled");
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : relevantSessions.length === 0 ? (
        <p className="text-center text-[13px] text-warm-gray-500 py-10 border border-dashed border-whisper rounded-comfortable">
          No active or completed sessions found for proctoring.
        </p>
      ) : (
        <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
          {relevantSessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors">
              <div>
                <p className="text-[14px] font-medium text-notion-black">
                  {s?.candidate?.firstName} {s?.candidate?.lastName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                  <span>Started: {formatDate(s.startedAt)}</span>
                  {s.monitoringScore != null && (
                    <span className={s.monitoringScore < 60 ? "text-destructive font-medium" : ""}>
                      Monitor Score: {s.monitoringScore}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <Badge variant={STATUS_VARIANT[s.status] || "neutral"}>{s.status}</Badge>
                <button 
                  onClick={() => setSelectedSessionId(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-notion-blue bg-notion-blue/10 hover:bg-notion-blue/20 rounded-micro transition-colors"
                >
                  <Eye size={14} /> View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!selectedSessionId} 
        onClose={() => setSelectedSessionId(null)} 
        title="Proctoring Event Logs"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {selectedSessionId && <ProctoringEventLog sessionId={selectedSessionId} />}
        </div>
      </Modal>
    </div>
  );
}
