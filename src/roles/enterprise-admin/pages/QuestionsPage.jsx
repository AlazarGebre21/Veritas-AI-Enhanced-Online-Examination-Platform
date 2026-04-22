import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
} from "lucide-react";
import { useQuestions, useDeleteQuestion } from "../hooks/useQuestions.js";
import { DataTable } from "@/components/shared/DataTable.jsx";
import { Button, Badge } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { formatDate } from "@/lib/utils/date.js";

/** Maps question type to a short display label. */
const TYPE_LABELS = { MCQ: "MCQ", TrueFalse: "True/False", ShortAnswer: "Short", Essay: "Essay" };
/** Maps difficulty to badge variant. */
const DIFF_VARIANT = { Easy: "success", Medium: "warning", Hard: "destructive" };

// ── Columns ─────────────────────────────────────────────────────────────
const buildColumns = (onDelete) => [
  {
    header: "Title",
    accessor: (row) => (
      <div className="max-w-[280px]">
        <p className="font-medium text-notion-black text-[14px] truncate">{row.title}</p>
        {row.topic && (
          <p className="text-[11px] text-warm-gray-300 mt-0.5 truncate">{row.topic}</p>
        )}
      </div>
    ),
  },
  {
    header: "Type",
    accessor: (row) => (
      <Badge variant="info">{TYPE_LABELS[row.type] || row.type}</Badge>
    ),
  },
  {
    header: "Difficulty",
    accessor: (row) => (
      <Badge variant={DIFF_VARIANT[row.difficulty] || "neutral"}>{row.difficulty}</Badge>
    ),
  },
  {
    header: "Points",
    accessor: (row) => (
      <span className="text-[13px] text-notion-black font-medium tabular-nums">{row.points}</span>
    ),
    className: "text-right",
  },
  {
    header: "Active",
    accessor: (row) => (
      <span className={`inline-block w-2 h-2 rounded-full ${row.isActive ? "bg-success" : "bg-warm-gray-300"}`} />
    ),
    className: "text-center",
  },
  {
    header: "Created",
    accessor: (row) => (
      <span className="text-[13px] text-warm-gray-500 whitespace-nowrap">{formatDate(row.createdAt)}</span>
    ),
  },
  {
    header: "",
    className: "w-10",
    accessor: (row) => (
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(row); }}
        className="p-1.5 rounded-micro text-warm-gray-300 hover:text-destructive hover:bg-destructive/5 transition-colors"
        title="Delete question"
      >
        <Trash2 size={14} />
      </button>
    ),
  },
];

export default function QuestionsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data, isLoading } = useQuestions({
    page,
    limit: LIMIT,
    sort: "created_at",
    sort_dir: "desc",
    with_correct_answer: false,
  });
  const questions = data?.data || [];
  const meta = data?.metadata;

  const deleteQuestion = useDeleteQuestion();

  function handleDelete(question) {
    if (window.confirm(`Delete "${question.title}"? This cannot be undone.`)) {
      deleteQuestion.mutate(question.id);
    }
  }

  const columns = buildColumns(handleDelete);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Question Bank</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">
            Create and organize questions for your exams.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.QUESTION_DETAIL.replace(":id", "new"))}>
          <Plus size={16} className="mr-2" />
          Create Question
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={questions}
        isLoading={isLoading}
        emptyMessage="No questions yet. Create your first question to get started."
        onRowClick={(row) => navigate(ROUTES.QUESTION_DETAIL.replace(":id", row.id))}
      />

      {/* Pagination */}
      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[13px] text-warm-gray-500">
            Page {meta.current_page} of {meta.total_pages} &middot; {meta.total_elements} total
          </p>
          <div className="flex gap-2">
            <button
              disabled={!meta.has_previous}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={!meta.has_next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-[13px] font-medium rounded-micro border border-whisper text-notion-black hover:bg-warm-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
