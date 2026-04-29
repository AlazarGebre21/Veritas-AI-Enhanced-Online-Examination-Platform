import { useState } from "react";
import { ChevronLeft, CalendarDays, ClipboardList, Settings2, CheckCircle2, AlertCircle } from "lucide-react";
import { useExam, usePublishExam, useScheduleExam } from "../hooks/useExams.js";
import { Button, Badge, Skeleton } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

const STATUS_VARIANT = { Draft: "neutral", Scheduled: "info", Active: "success", Closed: "neutral" };

export function ReviewPublishStage({ examId, onPublished, onBack, onSaveDraft }) {
  const { data: exam, isLoading } = useExam(examId);
  const publishExam = usePublishExam();
  const scheduleExam = useScheduleExam();

  // Schedule is REQUIRED before publish (backend enforces 409 without it)
  const [startTime, setStartTime] = useState(exam?.scheduledStart?.slice(0, 16) || "");
  const [endTime, setEndTime] = useState(exam?.scheduledEnd?.slice(0, 16) || "");
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSaved, setScheduleSaved] = useState(!!exam?.scheduledStart);

  async function handleSaveSchedule() {
    if (!startTime || !endTime) {
      setScheduleError("Both start and end times are required before you can publish.");
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setScheduleError("End time must be after start time.");
      return;
    }
    setScheduleError("");
    try {
      await scheduleExam.mutateAsync({
        id: examId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      setScheduleSaved(true);
    } catch (e) {
      setScheduleError(e?.response?.data?.error || "Failed to save schedule.");
    }
  }

  function handlePublish() {
    if (!scheduleSaved && !exam?.scheduledStart) {
      setScheduleError("You must set a schedule before publishing.");
      return;
    }
    publishExam.mutate(examId, { onSuccess: onPublished });
  }

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  const questionCount = exam?.questions?.length || 0;
  const settings = exam?.settings || {};
  const isScheduled = scheduleSaved || !!exam?.scheduledStart;

  return (
    <div className="bg-white border border-whisper rounded-comfortable shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-whisper">
        <h2 className="text-[17px] font-semibold text-notion-black">Step 3 — Review & Publish</h2>
        <p className="text-[14px] text-warm-gray-500 mt-1">
          Set the exam access window, then publish to make it live.
        </p>
      </div>

      <div className="p-6 space-y-5">
       
        <div className={`border rounded-comfortable overflow-hidden ${isScheduled ? "border-success/40" : "border-notion-blue/40"}`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isScheduled ? "border-success/20 bg-success/5" : "border-notion-blue/20 bg-notion-blue/5"}`}>
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className={isScheduled ? "text-success" : "text-notion-blue"} />
              <h4 className="text-[13px] font-semibold text-notion-black uppercase tracking-wide">
                Exam Access Window
              </h4>
            </div>
            {isScheduled && (
              <div className="flex items-center gap-1 text-[12px] text-success font-medium">
                <CheckCircle2 size={13} /> Saved
              </div>
            )}
          </div>

          <div className="px-4 py-4 space-y-4">
            <p className="text-[13px] text-warm-gray-500">
              Candidates can only start the exam within this window. The exam becomes <strong>Active</strong> the moment you publish, but candidates can only access it between these times.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-notion-black mb-1.5">
                  Access Opens
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => { setStartTime(e.target.value); setScheduleSaved(false); }}
                  className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-notion-black mb-1.5">
                  Access Closes
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => { setEndTime(e.target.value); setScheduleSaved(false); }}
                  className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20"
                />
              </div>
            </div>

            {scheduleError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-micro">
                <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-[12px] text-destructive">{scheduleError}</p>
              </div>
            )}

            {isScheduled && exam?.scheduledStart && (
              <div className="flex items-center gap-2 p-2.5 bg-success/5 border border-success/20 rounded-micro">
                <CheckCircle2 size={13} className="text-success shrink-0" />
                <p className="text-[12px] text-success">
                  Window: {formatDate(exam.scheduledStart)} → {formatDate(exam.scheduledEnd)}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleSaveSchedule}
                disabled={scheduleExam.isPending || !startTime || !endTime}
              >
                {scheduleExam.isPending ? "Saving..." : isScheduled ? "Update Schedule" : "Save Schedule"}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Exam Summary ──────────────────────────────────────────────── */}
        <Section icon={ClipboardList} title="Exam Summary">
          <Row label="Title" value={exam?.title} />
          <Row label="Subject" value={exam?.settings?.topic || "—"} />
          <Row label="Duration" value={`${exam?.durationMinutes} minutes`} />
          <Row label="Passing Score" value={`${exam?.passingScorePercent}%`} />
          <Row label="Max Participants" value={exam?.maxParticipants || "Unlimited"} />
          <Row label="Negative Marking" value={exam?.negativeMarking ? "Yes" : "No"} />
          <Row label="Questions" value={questionCount} />
        </Section>

        {/* ── Settings ─────────────────────────────────────────────────── */}
        <Section icon={Settings2} title="Settings">
          {[
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

        {/* Publish error */}
        {publishExam.isError && (
          <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-micro">
            <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-[13px] text-destructive">
              {publishExam.error?.response?.data?.error || "Failed to publish exam."}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-6 pb-6">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            <ChevronLeft size={15} className="mr-1" /> Back
          </Button>
          <button
            onClick={onSaveDraft}
            className="px-3 py-2 text-[13px] font-medium text-warm-gray-500 hover:text-notion-black transition-colors"
          >
            Save as Draft
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePublish}
            disabled={publishExam.isPending || !isScheduled}
            className={!isScheduled ? "opacity-50 cursor-not-allowed" : ""}
          >
            {publishExam.isPending ? "Publishing..." : "🚀 Publish Exam"}
          </Button>
        </div>
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
