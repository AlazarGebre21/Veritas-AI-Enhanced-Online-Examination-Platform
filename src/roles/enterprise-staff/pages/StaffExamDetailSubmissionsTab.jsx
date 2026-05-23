import { useState } from "react";
import { useGradingResults } from "../../enterprise-admin/hooks/useGrading.js"; // Reuse same hook
import { Badge, Skeleton } from "@/components/ui/index.js";
import { Trophy } from "lucide-react";
import ResultDetailView from "../../enterprise-admin/components/ResultDetailView.jsx"; // Reuse same component

export function StaffExamSubmissionsTab({ examId }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  const { data, isLoading } = useGradingResults({ exam_id: examId, limit: 100 });
  const submissions = data?.results || [];

  if (selectedSessionId) {
    return <ResultDetailView sessionId={selectedSessionId} onBack={() => setSelectedSessionId(null)} isStaff={true} />;
  }

  if (isLoading) {
    return <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-whisper rounded-comfortable">
        <Trophy size={28} className="mx-auto text-warm-gray-300 mb-3" />
        <p className="text-[13px] text-warm-gray-500">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[13px] text-warm-gray-500">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
      <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
        {submissions.map((sub) => {
          const passed = sub.percentage >= 60; 
          return (
            <div key={sub.id} onClick={() => setSelectedSessionId(sub.session_id)} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors cursor-pointer">
              <div>
                <p className="text-[14px] font-medium text-notion-black">
                  {sub.session?.candidate?.firstName ? `${sub.session.candidate.firstName} ${sub.session.candidate.lastName}` : `Candidate ${sub.candidate_id}`}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                  <span>Graded By: {sub.graded_by || 'System'}</span>
                  {sub.is_tampered && <Badge variant="destructive">Tampered</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <p className={`text-[16px] font-bold tabular-nums ${passed ? "text-success" : "text-destructive"}`}>
                     {sub.percentage?.toFixed(1)}%
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
