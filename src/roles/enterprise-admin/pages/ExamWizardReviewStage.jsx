import { useState } from "react";
import { ChevronLeft, CalendarDays, ClipboardList, Users, Settings2, CheckCircle2 } from "lucide-react";
import { useExam, usePublishExam, useScheduleExam } from "../hooks/useExams.js";
import { Button, Badge, Skeleton } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

const STATUS_VARIANT = { Draft: "neutral", Scheduled: "info", Active: "success", Closed: "neutral" };

export function ReviewPublishStage({ examId, onPublished, onBack, onSaveDraft }) {
  const { data: exam, isLoading } = useExam(examId);
  const publishExam = usePublishExam();
  const scheduleExam = useScheduleExam();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  async function handleSchedule() {
    if (!startTime || !endTime) { setScheduleError("Both start and end times are required."); return; }
    setScheduleError("");
    setScheduling(true);
    try {
      await scheduleExam.mutateAsync({ id: examId, startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString() });
    } catch (e) {
      setScheduleError(e?.response?.data?.error || "Failed to schedule.");
    } finally { setScheduling(false); }
  }

  function handlePublish() {
    publishExam.mutate(examId, { onSuccess: onPublished });
  }

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  const questionCount = exam?.questions?.length || 0;
  const ruleCount = exam?.randomizationRules?.length || 0;
  const settings = exam?.settings || {};

  return (
    <div className="bg-white border border-whisper rounded-comfortable shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-whisper">
        <h2 className="text-[17px] font-semibold text-notion-black">Step 3 — Review & Publish</h2>
        <p className="text-[14px] text-warm-gray-500 mt-1">Review all settings before publishing your exam.</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Exam Details */}
        <Section icon={ClipboardList} title="Exam Details">
          <Row label="Title" value={exam?.title} />
          <Row label="Subject" value={exam?.settings?.topic || "—"} />
          <Row label="Description" value={exam?.description || "—"} />
          <Row label="Duration" value={`${exam?.durationMinutes} minutes`} />
          <Row label="Passing Score" value={`${exam?.passingScorePercent}%`} />
          <Row label="Max Participants" value={exam?.maxParticipants || "Unlimited"} />
          <Row label="Negative Marking" value={exam?.negativeMarking ? "Enabled" : "Disabled"} />
          <Row label="Status" value={<Badge variant={STATUS_VARIANT[exam?.status]}>{exam?.status}</Badge>} />
        </Section>

        {/* Questions */}
        <Section icon={ClipboardList} title="Questions">
          <Row label="Manually Attached" value={`${questionCount} question${questionCount !== 1 ? "s" : ""}`} />
          <Row label="Randomization Rules" value={`${ruleCount} rule${ruleCount !== 1 ? "s" : ""}`} />
          {ruleCount > 0 && exam?.randomizationRules?.map((r, i) => (
            <Row key={r.id || i} label={`Rule ${i + 1}`}
              value={`Pick ${r.count} × ${r.difficulty} ${r.type || ""} from "${r.topic}"`} />
          ))}
        </Section>

        {/* Settings */}
        <Section icon={Settings2} title="Settings">
          {[
            ["Randomize Questions", settings.randomizeQuestions],
            ["Randomize Options", settings.randomizeOptions],
            ["Shuffle Per Student", settings.shufflePerStudent],
            ["Show Results Immediately", settings.showResultsImmediately],
            ["Allow Review", settings.allowReview],
            ["Max Attempts", settings.maxAttempts],
            ["Proctoring", settings.proctoring?.enabled ? "Enabled" : "Disabled"],
          ].map(([k, v]) => (
            <Row key={k} label={k} value={
              typeof v === "boolean"
                ? <Badge variant={v ? "success" : "neutral"}>{v ? "On" : "Off"}</Badge>
                : String(v ?? "—")
            } />
          ))}
        </Section>

        {/* Schedule (optional) */}
        <Section icon={CalendarDays} title="Schedule (Optional)">
          <p className="text-[13px] text-warm-gray-500 mb-3">
            Leave blank to publish without a fixed window — the exam will be available immediately until you close it.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">End Time</label>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
            </div>
          </div>
          {scheduleError && <p className="text-destructive text-[12px] mt-1">{scheduleError}</p>}
          {(startTime || endTime) && (
            <div className="flex justify-end mt-3">
              <Button variant="secondary" onClick={handleSchedule} disabled={scheduling}>
                {scheduling ? "Scheduling..." : "Set Schedule"}
              </Button>
            </div>
          )}
          {exam?.scheduledStart && (
            <div className="mt-2 p-2.5 bg-success/5 border border-success/20 rounded-micro flex items-center gap-2">
              <CheckCircle2 size={14} className="text-success shrink-0" />
              <p className="text-[12px] text-success">
                Scheduled: {formatDate(exam.scheduledStart)} → {formatDate(exam.scheduledEnd)}
              </p>
            </div>
          )}
        </Section>

        {/* Publish error */}
        {publishExam.isError && (
          <p className="text-destructive text-[13px]">
            {publishExam.error?.response?.data?.error || "Failed to publish exam."}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-6 pb-6">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            <ChevronLeft size={15} className="mr-1" /> Back
          </Button>
          <button onClick={onSaveDraft}
            className="px-3 py-2 text-[13px] font-medium text-warm-gray-500 hover:text-notion-black transition-colors">
            Save as Draft
          </button>
        </div>
        <Button onClick={handlePublish} disabled={publishExam.isPending}>
          {publishExam.isPending ? "Publishing..." : "🚀 Publish Exam"}
        </Button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  return (
    <div className="border border-whisper rounded-comfortable overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-warm-white/50 border-b border-whisper">
        <Icon size={15} className="text-warm-gray-500" />
        <h4 className="text-[13px] font-semibold text-notion-black uppercase tracking-wide">{title}</h4>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <span className="text-warm-gray-500 shrink-0 min-w-[160px]">{label}</span>
      <span className="text-notion-black text-right font-medium">{value}</span>
    </div>
  );
}
