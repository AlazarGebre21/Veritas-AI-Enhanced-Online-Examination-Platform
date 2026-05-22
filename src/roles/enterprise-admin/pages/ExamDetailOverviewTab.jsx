import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Percent, Copy, Trash2, BarChart2, Calendar, AlertCircle, Ban, Edit3 } from "lucide-react";
import {
  useUpdateExam, useDeleteExam, useCloseExam, useCloneExam, useScheduleExam,
} from "../hooks/useExams.js";
import { Button, Badge, Card, CardContent, Input } from "@/components/ui/index.js";
import { Modal } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";
import { toast } from "sonner";

export function ExamOverviewTab({ exam, examId }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [cloneTitle, setCloneTitle] = useState(`${exam.title} (Copy)`);
  const [startTime, setStartTime] = useState(exam.scheduledStart?.slice(0, 16) || "");
  const [endTime, setEndTime] = useState(exam.scheduledEnd?.slice(0, 16) || "");
  const [scheduleError, setScheduleError] = useState("");
  const [editData, setEditData] = useState({
    title: exam.title || "",
    description: exam.description || "",
    durationMinutes: exam.durationMinutes || 60,
    passingScorePercent: exam.passingScorePercent || 50,
    maxParticipants: exam.maxParticipants || "",
  });

  const updateExam = useUpdateExam();


  const closeExam = useCloseExam();
  const deleteExam = useDeleteExam();
  const cloneExam = useCloneExam();
  const scheduleExam = useScheduleExam();

  const isDraft = exam.status === "Draft";
  const isActive = exam.status === "Active";
  const isScheduled = exam.status === "Scheduled";
  const isClosed = exam.status === "Closed";

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
    setScheduleError("");
    if (!startTime || !endTime) {
      setScheduleError("Both start and end times are required.");
      return;
    }
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start <= now) {
      setScheduleError("Start time must be in the future.");
      return;
    }
    if (end <= start) {
      setScheduleError("End time must be after the start time.");
      return;
    }
    const fmt = (v) => new Date(v).toISOString().replace(/\.\d{3}Z$/, "Z");
    scheduleExam.mutate(
      { id: examId, startTime: fmt(startTime), endTime: fmt(endTime) },
      { onSuccess: () => { setScheduleOpen(false); setScheduleError(""); } }
    );
  }

  function handleUpdate() {
    updateExam.mutate(
      {
        id: examId,
        payload: {
          ...editData,
          settings: exam.settings, // keep existing settings
        },
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("Exam details updated");
        },
      }
    );
  }

  const hasSchedule = !!(exam.scheduledStart && exam.scheduledEnd);

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {(isDraft || isScheduled) && (
          <>
            <Button variant="secondary" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5">
              <Edit3 size={14} /> Edit Exam
            </Button>
            <Button variant="secondary" onClick={() => setScheduleOpen(true)} className="flex items-center gap-1.5">
              <Calendar size={14} />
              {hasSchedule ? "Edit Schedule" : (
                <span className="flex items-center gap-1.5">
                  Set Access Window <AlertCircle size={14} className="text-amber-500" />
                </span>
              )}
            </Button>
          </>
        )}
        {isActive && (
          <Button variant="secondary" onClick={() => closeExam.mutate(examId)} disabled={closeExam.isPending} className="flex items-center gap-1.5">
            {closeExam.isPending ? "Closing..." : (
              <>
                <Ban size={14} /> Close Exam
              </>
            )}          </Button>
        )}
        <Button variant="secondary" onClick={() => setCloneOpen(true)}>
          <Copy size={14} className="mr-1.5" /> Clone
        </Button>
        <button
          onClick={() => navigate(ROUTES.EXAM_MONITOR.replace(":id", examId))}
          className="px-3 py-2 text-[13px] font-medium text-warm-gray-500 border border-whisper rounded-micro hover:bg-black/5 hover:text-notion-black transition-colors flex items-center gap-1.5">
          <BarChart2 size={14} /> Live Monitor
        </button>
        {(isDraft || isClosed) && <button onClick={handleDelete}
          className="px-3 py-2 text-[13px] font-medium text-destructive border border-destructive/30 rounded-micro hover:bg-destructive/5 transition-colors flex items-center gap-1.5">
          <Trash2 size={14} /> Delete
        </button>}
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

      {/* Schedule Modal */}
      <Modal isOpen={scheduleOpen} onClose={() => { setScheduleOpen(false); setScheduleError(""); }} title="Set Schedule">
        <div className="space-y-4">
          {scheduleError && (
            <p className="text-[13px] text-destructive bg-destructive/5 border border-destructive/20 rounded-micro px-3 py-2">
              {scheduleError}
            </p>
          )}
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Start Time</label>
            <input type="datetime-local" value={startTime} onChange={(e) => { setStartTime(e.target.value); setScheduleError(""); }}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">End Time</label>
            <input type="datetime-local" value={endTime} onChange={(e) => { setEndTime(e.target.value); setScheduleError(""); }}
              min={startTime || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setScheduleOpen(false); setScheduleError(""); }}>Cancel</Button>
            <Button onClick={handleScheduleSave} disabled={scheduleExam.isPending}>
              {scheduleExam.isPending ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Exam">
        <div className="space-y-4">
          <Input 
            label="Exam Title" 
            value={editData.title} 
            onChange={(e) => setEditData({ ...editData, title: e.target.value })} 
          />
          <div>
            <label className="block text-[14px] font-medium text-notion-black mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[14px]"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Duration (min)" 
              type="number" 
              value={editData.durationMinutes} 
              onChange={(e) => setEditData({ ...editData, durationMinutes: Number(e.target.value) })} 
            />
            <Input 
              label="Passing Score (%)" 
              type="number" 
              value={editData.passingScorePercent} 
              onChange={(e) => setEditData({ ...editData, passingScorePercent: Number(e.target.value) })} 
            />
            <Input 
              label="Max Participants" 
              type="number" 
              placeholder="Unlimited"
              value={editData.maxParticipants} 
              onChange={(e) => setEditData({ ...editData, maxParticipants: e.target.value ? Number(e.target.value) : "" })} 
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateExam.isPending || !editData.title}>
              {updateExam.isPending ? "Saving..." : "Save Changes"}
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
