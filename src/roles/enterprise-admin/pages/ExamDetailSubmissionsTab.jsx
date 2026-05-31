import { useState } from "react";
import { useGradingResults, useGradingStatus } from "../hooks/useGrading.js";
import { Badge, Skeleton } from "@/components/ui/index.js";
import { Trophy } from "lucide-react";
import ResultDetailView from "../components/ResultDetailView.jsx";

export function ExamSubmissionsTab({ examId, exam }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  
  const { data, isLoading } = useGradingResults({ exam_id: examId, limit: 30 });
  const submissions = data?.results || [];



  if (selectedSessionId) {
    return <ResultDetailView sessionId={selectedSessionId} passingScore={exam?.passingScorePercent} onBack={() => setSelectedSessionId(null)} />;
  }

  if (isLoading) {
    return <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-whisper rounded-comfortable">
        <Trophy size={28} className="mx-auto text-warm-gray-300 mb-3" />
        <p className="text-[13px] text-warm-gray-500">No submissions yet. Results will appear here after candidates complete the exam.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-warm-gray-500">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
      <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
        {submissions.map((sub) => (
          <SubmissionRow key={sub.id} sub={sub} passingScore={exam?.passingScorePercent} onClick={() => setSelectedSessionId(sub.session_id)} />
        ))}
      </div>
    </div>
  );
}

function SubmissionRow({ sub, passingScore, onClick }) {
  const { data: statusData } = useGradingStatus(sub.session_id);
  const status = statusData?.status || "graded";
  const isPending = status === 'pending';
  const displayPercentage = statusData?.percentage ?? sub.percentage ?? 0;
  const gradedBy = statusData?.graded_by || sub.graded_by;
  const gradedByLabel = gradedBy
    ? typeof gradedBy === 'object'
      ? gradedBy.type || 'System'
      : gradedBy
    : 'System';
  const passed = displayPercentage >= (passingScore || 50);

  return (
    <div onClick={onClick} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors cursor-pointer">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-medium text-notion-black">
            {sub.session?.candidate?.firstName ? `${sub.session.candidate.firstName} ${sub.session.candidate.lastName}` : `Candidate ${sub.candidate_id}`}
          </p>
          <Badge variant={isPending ? 'warning' : 'neutral'} className="text-[10px] capitalize">
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
          <span>Graded By: {gradedByLabel}</span>
          {sub.is_tampered && <Badge variant="destructive">Tampered</Badge>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        {isPending ? (
          <div className="text-right text-warm-gray-400 text-[12px] italic">
            Computing...
          </div>
        ) : (
          <div className="text-right">
            <p className={`text-[16px] font-bold tabular-nums ${passed ? "text-success" : "text-destructive"}`}>
               {displayPercentage?.toFixed(1)}%
            </p>
            <Badge variant={passed ? "success" : "destructive"}>{passed ? "Passed" : "Failed"}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
