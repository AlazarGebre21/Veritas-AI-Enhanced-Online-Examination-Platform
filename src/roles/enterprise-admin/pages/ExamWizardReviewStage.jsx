import { useState } from "react";
import { ChevronLeft, CalendarDays, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { useExam } from "../hooks/useExams.js";
import { Button, Skeleton } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

export function ReviewPublishStage({ examId, onSave, onBack, onSaveDraft }) {
  const { data: exam, isLoading } = useExam(examId);

  function handleSave() {
    onSave();
  }

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;

  const questionCount = exam?.questions?.length || 0;
  const isScheduled = !!exam?.scheduledStart;

  return (
    <div className="bg-white border border-whisper rounded-comfortable shadow-sm">
      <div className="px-6 pt-6 pb-4 border-b border-whisper">
        <h2 className="text-[17px] font-semibold text-notion-black">Step 3 — Review & Save</h2>
        <p className="text-[14px] text-warm-gray-500 mt-1">
          Review your exam settings before finalizing setup.
        </p>
      </div>

      <div className="p-6 space-y-5">
       
        <div className={`border rounded-comfortable overflow-hidden ${isScheduled ? "border-success/40" : "border-destructive/40"}`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${isScheduled ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}>
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className={isScheduled ? "text-success" : "text-destructive"} />
              <h4 className="text-[13px] font-semibold text-notion-black uppercase tracking-wide">
                Exam Access Window
              </h4>
            </div>
            {isScheduled ? (
              <div className="flex items-center gap-1 text-[12px] text-success font-medium">
                <CheckCircle2 size={13} /> Scheduled
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[12px] text-destructive font-medium">
                <AlertCircle size={13} /> Missing Schedule
              </div>
            )}
          </div>

          <div className="px-4 py-4">
            {isScheduled ? (
              <div className="space-y-3">
                <p className="text-[13px] text-warm-gray-500">
                  Candidates can only start the exam within this window.
                </p>
                <div className="flex items-center gap-2 p-2.5 bg-success/5 border border-success/20 rounded-micro">
                  <CheckCircle2 size={13} className="text-success shrink-0" />
                  <p className="text-[12px] text-success">
                    Window: {formatDate(exam.scheduledStart)} → {formatDate(exam.scheduledEnd)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[13px] text-warm-gray-500">
                  You must configure an access window before this exam can be saved.
                </p>
                <Button variant="secondary" onClick={onBack}>
                  <ChevronLeft size={14} className="mr-1 mt-0.5" /> Go back to set Schedule
                </Button>
              </div>
            )}
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
            onClick={handleSave}
            disabled={!isScheduled}
            className={!isScheduled ? "opacity-50 cursor-not-allowed" : ""}
          >
            Complete & Save
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
