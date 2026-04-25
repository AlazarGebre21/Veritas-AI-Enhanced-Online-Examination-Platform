import { useExamSubmissions } from "../hooks/useExams.js";
import { Badge, Skeleton } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";
import { Trophy } from "lucide-react";

export function ExamSubmissionsTab({ examId }) {
  const { data, isLoading } = useExamSubmissions(examId);
  const submissions = data?.data || [];

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
        {submissions.map((sub) => {
          const passed = sub.scorePercent >= (sub.passingScorePercent ?? 60);
          return (
            <div key={sub.id} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors">
              <div>
                <p className="text-[14px] font-medium text-notion-black">
                  {sub.session?.candidate?.firstName} {sub.session?.candidate?.lastName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                  <span>Submitted: {formatDate(sub.submittedAt)}</span>
                  {sub.isAutoSubmitted && <Badge variant="neutral">Auto-submitted</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <p className={`text-[16px] font-bold tabular-nums ${passed ? "text-success" : "text-destructive"}`}>
                    {sub.scorePercent?.toFixed(1)}%
                  </p>
                  <Badge variant={passed ? "success" : "destructive"}>{passed ? "Passed" : "Failed"}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
