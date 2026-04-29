import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Clock,
  Users,
  CalendarDays,
} from "lucide-react";
import { useExams } from "../hooks/useExams.js";
import { Button, Badge, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "Draft", "Scheduled", "Active", "Closed"];

const STATUS_VARIANT = {
  Draft: "neutral",
  Scheduled: "info",
  Active: "success",
  Closed: "neutral",
};

const STATUS_DOT = {
  Draft: "bg-warm-gray-300",
  Scheduled: "bg-notion-blue",
  Active: "bg-success animate-pulse",
  Closed: "bg-warm-gray-300",
};

export default function ExamsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedTopics, setExpandedTopics] = useState({});

  const { data, isLoading } = useExams({ limit: 100, sort: "created_at", sort_dir: "desc" });
  const allExams = data?.data || [];

  // Filter by status
  const filtered = useMemo(
    () => statusFilter === "All" ? allExams : allExams.filter((e) => e.status === statusFilter),
    [allExams, statusFilter]
  );

  // Group by topic (fallback to "General" if no topic)
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((exam) => {
      const topic = exam.topic || exam.settings?.topic || "General";
      if (!map[topic]) map[topic] = [];
      map[topic].push(exam);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  function toggleTopic(topic) {
    setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  }

  function goCreate(topic = null) {
    const path = ROUTES.EXAM_NEW + (topic ? `?topic=${encodeURIComponent(topic)}` : "");
    navigate(path);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Exams</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">
            Manage exams grouped by subject. Click a subject card to view its exams.
          </p>
        </div>
        <Button onClick={() => goCreate()}>
          <Plus size={16} className="mr-2" />
          Create Exam
        </Button>
      </div>

      {/* ── Status Filter Tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-whisper mb-4 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === tab
                ? "border-notion-blue text-notion-blue"
                : "border-transparent text-warm-gray-500 hover:text-notion-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-comfortable" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState onCreateClick={() => goCreate()} />
      ) : (
        <div className="space-y-4">
          {grouped.map(([topic, exams]) => (
            <SubjectCard
              key={topic}
              topic={topic}
              exams={exams}
              isExpanded={expandedTopics[topic] !== false} // default open
              onToggle={() => toggleTopic(topic)}
              onCreateInTopic={() => goCreate(topic)}
              onExamClick={(exam) => navigate(ROUTES.EXAM_DETAIL.replace(":id", exam.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── SubjectCard ──────────────────────────────────────────────────────────
function SubjectCard({ topic, exams, isExpanded, onToggle, onCreateInTopic, onExamClick }) {
  const activeCount = exams.filter((e) => e.status === "Active").length;

  return (
    <div className="border border-whisper rounded-comfortable bg-white overflow-hidden shadow-sm hover:shadow-card transition-shadow">
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-warm-white/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-notion-blue/10 flex items-center justify-center text-notion-blue shrink-0">
            <ClipboardList size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-notion-black truncate">{topic}</h3>
            <p className="text-[12px] text-warm-gray-500 mt-0.5">
              {exams.length} exam{exams.length !== 1 ? "s" : ""}
              {activeCount > 0 && (
                <span className="ml-2 text-success font-medium">· {activeCount} active</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Add exam to this subject */}
          <button
            onClick={(e) => { e.stopPropagation(); onCreateInTopic(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-notion-blue border border-notion-blue/30 rounded-micro hover:bg-notion-blue/5 transition-colors"
          >
            <Plus size={12} /> Add Exam
          </button>
          {isExpanded ? (
            <ChevronDown size={18} className="text-warm-gray-300" />
          ) : (
            <ChevronRight size={18} className="text-warm-gray-300" />
          )}
        </div>
      </div>

      {/* Exam List */}
      {isExpanded && (
        <div className="border-t border-whisper divide-y divide-whisper">
          {exams.map((exam) => (
            <ExamRow key={exam.id} exam={exam} onClick={() => onExamClick(exam)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── ExamRow ──────────────────────────────────────────────────────────────
function ExamRow({ exam, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-5 py-3.5 hover:bg-warm-white/60 cursor-pointer transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[exam.status] || "bg-warm-gray-300"}`}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-notion-black group-hover:text-notion-blue transition-colors truncate">
            {exam.title}
          </p>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {exam.durationMinutes}m
            </span>
            {exam.maxParticipants && (
              <span className="flex items-center gap-1">
                <Users size={11} /> {exam.maxParticipants} max
              </span>
            )}
            {exam.scheduledStart && (
              <span className="flex items-center gap-1">
                <CalendarDays size={11} /> {formatDate(exam.scheduledStart)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <Badge variant={STATUS_VARIANT[exam.status] || "neutral"}>{exam.status}</Badge>
        <span className="text-[11px] text-warm-gray-300">{formatDate(exam.createdAt)}</span>
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────
function EmptyState({ onCreateClick }) {
  return (
    <div className="text-center py-16 border border-dashed border-whisper rounded-comfortable bg-warm-white/30">
      <div className="w-14 h-14 rounded-full bg-notion-blue/10 flex items-center justify-center text-notion-blue mx-auto mb-4">
        <ClipboardList size={24} />
      </div>
      <h3 className="text-[16px] font-semibold text-notion-black">No exams yet</h3>
      <p className="text-warm-gray-500 text-[14px] mt-1 mb-5">
        Create your first exam to get started.
      </p>
      <Button onClick={onCreateClick}>
        <Plus size={16} className="mr-2" /> Create Exam
      </Button>
    </div>
  );
}
