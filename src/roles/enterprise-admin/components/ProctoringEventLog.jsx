import { useProctoringEvents } from "../hooks/useProctoringEvents.js";
import { useCheatingScore } from "../hooks/useCheatingScore.js";
import { Skeleton } from "@/components/ui/index.js";
import {
  Eye, EyeOff, Mouse, Users, UserMinus, Clipboard,
  Minimize2, CheckCircle2, ShieldAlert,
} from "lucide-react";

const EVENT_CONFIG = {
  tab_switch: { icon: EyeOff, label: "Tab Switch", color: "text-warning" },
  mouse_inactive: { icon: Mouse, label: "Mouse Inactive", color: "text-warm-gray-500" },
  face_not_detected: { icon: UserMinus, label: "Face Not Detected", color: "text-destructive" },
  multiple_faces: { icon: Users, label: "Multiple Faces", color: "text-destructive" },
  identity_mismatch: { icon: ShieldAlert, label: "Identity Mismatch", color: "text-destructive" },
  copy_paste_attempt: { icon: Clipboard, label: "Copy/Paste Attempt", color: "text-warning" },
  fullscreen_exit: { icon: Minimize2, label: "Fullscreen Exit", color: "text-warning" },
  periodic_face_ok: { icon: CheckCircle2, label: "Face Verified", color: "text-success" },
};

const SEVERITY_STYLES = {
  low: "bg-warm-white text-warm-gray-500",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive/15 text-destructive font-semibold",
};

/**
 * Timeline view of proctoring events for a session.
 * Shows cheating score header + chronological event list.
 *
 * @param {{ sessionId: string }} props
 */
export default function ProctoringEventLog({ sessionId }) {
  const { data: eventsData, isLoading: eventsLoading } = useProctoringEvents(sessionId);
  const { data: scoreData, isLoading: scoreLoading } = useCheatingScore(sessionId);

  const events = eventsData?.events || [];
  const score = scoreData?.cheating_score;
  const eventCount = scoreData?.event_count ?? events.length;

  if (eventsLoading || scoreLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score header */}
      <div className="flex items-center gap-4 p-4 rounded-comfortable border border-whisper bg-white">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold ${
          score == null ? "bg-warm-white text-warm-gray-400"
            : score < 30 ? "bg-success/10 text-success"
            : score < 60 ? "bg-warning/10 text-warning"
            : "bg-destructive/10 text-destructive"
        }`}>
          {score != null ? Math.round(score) : "—"}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-notion-black">
            Cheating Score
          </p>
          <p className="text-[12px] text-warm-gray-500">
            {eventCount} event{eventCount !== 1 ? "s" : ""} recorded
            {scoreData?.last_computed_at && (
              <> · Last updated {new Date(scoreData.last_computed_at).toLocaleTimeString()}</>
            )}
          </p>
        </div>
      </div>

      {/* Event timeline */}
      {events.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-whisper rounded-comfortable">
          <Eye size={24} className="mx-auto text-warm-gray-300 mb-2" />
          <p className="text-[13px] text-warm-gray-500">No proctoring events recorded.</p>
        </div>
      ) : (
        <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
          {events.map((evt) => {
            const config = EVENT_CONFIG[evt.event_type] || { icon: Eye, label: evt.event_type, color: "text-warm-gray-500" };
            const Icon = config.icon;
            const severityStyle = SEVERITY_STYLES[evt.severity] || SEVERITY_STYLES.low;

            return (
              <div key={evt.id} className="flex items-center gap-3 px-4 py-3 hover:bg-warm-white/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${severityStyle}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium ${config.color}`}>
                    {config.label}
                  </p>
                  <p className="text-[11px] text-warm-gray-400">
                    {new Date(evt.occurred_at).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full ${severityStyle}`}>
                  {evt.severity}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
