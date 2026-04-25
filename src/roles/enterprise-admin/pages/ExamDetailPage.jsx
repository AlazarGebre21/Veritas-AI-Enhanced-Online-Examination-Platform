import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExam } from "../hooks/useExams.js";
import { Badge, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { ExamOverviewTab } from "./ExamDetailOverviewTab.jsx";
import { ExamQuestionsTab } from "./ExamDetailQuestionsTab.jsx";
import { ExamEnrollmentsTab } from "./ExamDetailEnrollmentsTab.jsx";
import { ExamSessionsTab } from "./ExamDetailSessionsTab.jsx";
import { ExamSubmissionsTab } from "./ExamDetailSubmissionsTab.jsx";

const TABS = ["Overview", "Questions", "Enrollments", "Sessions", "Submissions"];

const STATUS_VARIANT = {
  Draft: "neutral", Scheduled: "info", Active: "success",
  Closed: "neutral", Archived: "neutral",
};

export default function ExamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const { data: exam, isLoading } = useExam(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-16">
        <p className="text-warm-gray-500">Exam not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Back */}
      <button
        onClick={() => navigate(ROUTES.EXAMS)}
        className="flex items-center gap-1.5 text-[14px] text-warm-gray-500 hover:text-notion-black transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Back to Exams
      </button>

      {/* Header */}
      <div className="border-b border-whisper pb-5 mb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-notion-black truncate">{exam.title}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge variant={STATUS_VARIANT[exam.status]}>{exam.status}</Badge>
              {exam.settings?.topic && (
                <span className="text-[13px] text-warm-gray-500">{exam.settings.topic}</span>
              )}
              <span className="text-[13px] text-warm-gray-500">{exam.durationMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-5 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-notion-blue text-notion-blue"
                  : "border-transparent text-warm-gray-500 hover:text-notion-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === "Overview" && <ExamOverviewTab exam={exam} examId={id} />}
        {activeTab === "Questions" && <ExamQuestionsTab examId={id} exam={exam} />}
        {activeTab === "Enrollments" && <ExamEnrollmentsTab examId={id} />}
        {activeTab === "Sessions" && <ExamSessionsTab examId={id} />}
        {activeTab === "Submissions" && <ExamSubmissionsTab examId={id} />}
      </div>
    </div>
  );
}
