import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, OctagonX, Activity, Clock, Users, AlertTriangle, X } from "lucide-react";
import { useExam, useExamSessions, useTerminateSession } from "../hooks/useExams.js";
import { useCheatingScore } from "../hooks/useCheatingScore.js";
import ProctoringEventLog from "../components/ProctoringEventLog.jsx";
import { Badge, Button, Skeleton } from "@/components/ui/index.js";
import { Modal } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";

function useCountdown(startedAt, durationMinutes) {
  if (!startedAt || !durationMinutes) return null;
  const endMs = new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
  const remaining = Math.max(0, Math.round((endMs - Date.now()) / 1000));
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return remaining > 0 ? `${m}:${String(s).padStart(2, "0")}` : "Time up";
}

export default function ExamMonitoringPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(null);

  const { data: exam } = useExam(id);

  // Poll every 10 seconds
  const { data, isLoading } = useExamSessions(id, { status: "Active" }, {
    refetchInterval: 10_000,
  });
  const sessions = data?.data || [];

  const terminate = useTerminateSession();

  function handleTerminate(session) {
    if (window.confirm(`Terminate session for ${session.candidate?.firstName} ${session.candidate?.lastName}?`)) {
      terminate.mutate({ id: session.id, reason: "Terminated by administrator" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-whisper pb-5">
        <div>
          <button onClick={() => navigate(ROUTES.EXAM_DETAIL.replace(":id", id))}
            className="flex items-center gap-1.5 text-[13px] text-warm-gray-500 hover:text-notion-black transition-colors mb-2">
            <ArrowLeft size={14} /> Back to Exam
          </button>
          <h1 className="text-2xl font-bold text-notion-black">Live Monitor</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">{exam?.title || "Loading..."}</p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-success font-medium bg-success/10 px-3 py-1.5 rounded-full">
          <Activity size={12} className="animate-pulse" />
          Refreshing every 10s
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard icon={Users} label="Active Sessions" value={isLoading ? "..." : sessions.length} color="notion-blue" />
        <SummaryCard icon={Clock} label="Duration" value={exam ? `${exam.durationMinutes}m` : "..."} color="[#d9730d]" />
        <SummaryCard icon={AlertTriangle} label="High Risk"
          value={isLoading ? "..." : "—"}
          color="destructive" note="Click a session to view" />
      </div>

      {/* Session cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-comfortable" />)}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-whisper rounded-comfortable">
          <Activity size={28} className="mx-auto text-warm-gray-300 mb-3" />
          <p className="text-[14px] text-warm-gray-500">No active sessions right now.</p>
          <p className="text-[12px] text-warm-gray-300 mt-1">This page will auto-refresh when sessions begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              durationMinutes={exam?.durationMinutes}
              onTerminate={handleTerminate}
              onViewProctoring={() => setSelectedSession(s)}
            />
          ))}
        </div>
      )}

      {/* Proctoring detail modal */}
      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={`Proctoring — ${selectedSession?.candidate?.firstName || ""} ${selectedSession?.candidate?.lastName || ""}`}
      >
        {selectedSession && (
          <div className="max-h-[60vh] overflow-y-auto">
            <ProctoringEventLog sessionId={selectedSession.id} />
          </div>
        )}
      </Modal>
    </div>
  );
}

function SessionCard({ session, durationMinutes, onTerminate, onViewProctoring }) {
  const { data: scoreData } = useCheatingScore(session.id);
  const score = scoreData?.cheating_score;
  const isHighRisk = score != null && score >= 60;
  const countdown = useCountdown(session.startedAt, durationMinutes);

  return (
    <div
      className={`border rounded-comfortable p-4 space-y-3 transition-colors cursor-pointer ${
        isHighRisk
          ? "border-destructive/40 bg-destructive/5"
          : "border-whisper bg-white hover:shadow-card"
      }`}
      onClick={onViewProctoring}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-notion-black truncate">
            {session.candidate?.firstName} {session.candidate?.lastName}
          </p>
          <p className="text-[11px] text-warm-gray-500 mt-0.5">
            Started {formatDate(session.startedAt)}
          </p>
        </div>
        {isHighRisk && <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Time Left" value={countdown || "—"} highlight={countdown === "Time up"} />
        <Stat
          label="Cheating Score"
          value={score != null ? Math.round(score) : "—"}
          highlight={isHighRisk}
        />
      </div>

      {/* Terminate */}
      <button
        onClick={(e) => { e.stopPropagation(); onTerminate(session); }}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-destructive border border-destructive/30 rounded-micro hover:bg-destructive/5 transition-colors"
      >
        <OctagonX size={13} /> Terminate
      </button>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div className="bg-warm-white/60 rounded-micro px-2.5 py-1.5">
      <p className="text-[10px] text-warm-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-[14px] font-bold mt-0.5 ${highlight ? "text-destructive" : "text-notion-black"}`}>{value}</p>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, note }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-whisper rounded-comfortable bg-white">
      <div className={`w-9 h-9 rounded-lg bg-${color}/10 flex items-center justify-center text-${color} shrink-0`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] text-warm-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-[18px] font-bold text-notion-black">{value}</p>
        {note && <p className="text-[10px] text-warm-gray-300">{note}</p>}
      </div>
    </div>
  );
}
