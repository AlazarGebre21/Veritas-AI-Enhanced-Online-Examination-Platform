import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Percent, Copy, Trash2, BarChart2 } from "lucide-react";
import {
  useUpdateExam, useDeleteExam,
  usePublishExam, useCloseExam, useCloneExam, useScheduleExam,
} from "../hooks/useExams.js";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui/index.js";
import { Modal } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";

export function ExamOverviewTab({ exam, examId }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [cloneTitle, setCloneTitle] = useState(`${exam.title} (Copy)`);
  const [startTime, setStartTime] = useState(exam.scheduledStart?.slice(0, 16) || "");
  const [endTime, setEndTime] = useState(exam.scheduledEnd?.slice(0, 16) || "");

  const publishExam = usePublishExam();
  const closeExam = useCloseExam();
  const deleteExam = useDeleteExam();
  const cloneExam = useCloneExam();
  const scheduleExam = useScheduleExam();

  const isDraft = exam.status === "Draft";
  const isActive = exam.status === "Active" || exam.status === "Scheduled";

  function handleDelete() {
    if (window.confirm(`Permanently delete "${exam.title}"?`)) {
      deleteExam.mutate(examId, { onSuccess: () => navigate(ROUTES.EXAMS) });
    }
  }

  function handleClone() {
    cloneExam.mutate({ id: examId, title: cloneTitle }, {
      onSuccess: (cloned) => {
        setCloneOpen(false);
        navigate(ROUTES.EXAM_DETAIL.replace(":id", cloned?.id || cloned?.data?.id));
      },
    });
  }

  function handleScheduleSave() {
    scheduleExam.mutate(
      { id: examId, startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString() },
      { onSuccess: () => setScheduleOpen(false) }
    );
  }

  const settings = exam.settings || {};

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        {isDraft && (
          <>
            <Button onClick={() => publishExam.mutate(examId)} disabled={publishExam.isPending}>
              {publishExam.isPending ? "Publishing..." : "🚀 Publish"}
            </Button>
            <Button variant="secondary" onClick={() => setScheduleOpen(true)}>
              📅 Schedule
            </Button>
          </>
        )}
        {isActive && (
          <Button variant="secondary" onClick={() => closeExam.mutate(examId)} disabled={closeExam.isPending}>
            {closeExam.isPending ? "Closing..." : "⛔ Close Exam"}
          </Button>
        )}
        <Button variant="secondary" onClick={() => setCloneOpen(true)}>
          <Copy size={14} className="mr-1.5" /> Clone
        </Button>
        {isDraft && (
          <button onClick={handleDelete}
            className="px-3 py-2 text-[13px] font-medium text-destructive border border-destructive/30 rounded-micro hover:bg-destructive/5 transition-colors flex items-center gap-1.5">
            <Trash2 size={14} /> Delete
          </button>
        )}
        <button
          onClick={() => navigate(ROUTES.EXAM_MONITOR.replace(":id", examId))}
          className="px-3 py-2 text-[13px] font-medium text-warm-gray-500 border border-whisper rounded-micro hover:bg-warm-white transition-colors flex items-center gap-1.5">
          <BarChart2 size={14} /> Live Monitor
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard icon={Clock} label="Duration" value={`${exam.durationMinutes} min`} />
        <StatCard icon={Percent} label="Passing Score" value={`${exam.passingScorePercent}%`} />
        <StatCard icon={Users} label="Max Participants" value={exam.maxParticipants || "Unlimited"} />
      </div>

      {/* Details */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="text-[15px] font-semibold text-notion-black">Details</h3>
          {exam.description && <p className="text-[14px] text-warm-gray-500">{exam.description}</p>}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            <Detail label="Status" value={<Badge variant={{ Draft: "neutral", Scheduled: "info", Active: "success", Closed: "neutral" }[exam.status]}>{exam.status}</Badge>} />
            <Detail label="Negative Marking" value={exam.negativeMarking ? "Yes" : "No"} />
            <Detail label="Created" value={formatDate(exam.createdAt)} />
            {exam.scheduledStart && <Detail label="Scheduled Start" value={formatDate(exam.scheduledStart)} />}
            {exam.scheduledEnd && <Detail label="Scheduled End" value={formatDate(exam.scheduledEnd)} />}
          </dl>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <h3 className="text-[15px] font-semibold text-notion-black">Settings</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
            {[
              ["Randomize Questions", settings.randomizeQuestions],
              ["Randomize Options", settings.randomizeOptions],
              ["Shuffle Per Student", settings.shufflePerStudent],
              ["Show Results Immediately", settings.showResultsImmediately],
              ["Allow Review", settings.allowReview],
              ["Max Attempts", settings.maxAttempts],
              ["Proctoring", settings.proctoring?.enabled ? "Enabled" : "Disabled"],
            ].map(([k, v]) => (
              <Detail key={k} label={k} value={
                typeof v === "boolean"
                  ? <Badge variant={v ? "success" : "neutral"}>{v ? "On" : "Off"}</Badge>
                  : String(v ?? "—")
              } />
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      <Modal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Set Schedule">
        <div className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Start Time</label>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">End Time</label>
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleSave} disabled={scheduleExam.isPending}>
              {scheduleExam.isPending ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clone Modal */}
      <Modal isOpen={cloneOpen} onClose={() => setCloneOpen(false)} title="Clone Exam">
        <div className="space-y-4">
          <Input label="New Exam Title" id="clone-title" value={cloneTitle}
            onChange={(e) => setCloneTitle(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCloneOpen(false)}>Cancel</Button>
            <Button onClick={handleClone} disabled={cloneExam.isPending}>
              {cloneExam.isPending ? "Cloning..." : "Clone Exam"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="w-9 h-9 rounded-lg bg-notion-blue/10 flex items-center justify-center text-notion-blue shrink-0">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-warm-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-[16px] font-bold text-notion-black mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }) {
  return (
    <>
      <dt className="text-warm-gray-500">{label}</dt>
      <dd className="font-medium text-notion-black">{value}</dd>
    </>
  );
}
