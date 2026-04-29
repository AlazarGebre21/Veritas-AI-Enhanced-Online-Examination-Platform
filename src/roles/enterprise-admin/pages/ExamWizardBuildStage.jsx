import { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react";
import { useAddExamQuestions, useRemoveExamQuestion, useExamQuestions, useEnrollCandidates, useExamEnrollments, useRevokeEnrollment } from "../hooks/useExams.js";
import { useQuestions } from "../hooks/useQuestions.js";
import { useCandidates } from "../hooks/useCandidates.js";
import { Button, Input, Badge } from "@/components/ui/index.js";



export function BuildEnrollStage({ examId, onNext, onBack }) {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="bg-white border border-whisper rounded-comfortable shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-0">
        <h2 className="text-[17px] font-semibold text-notion-black mb-4">Step 2 — Build & Enroll</h2>
        {/* Inner tabs */}
        <div className="flex border-b border-whisper">
          {["questions", "candidates"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[13px] font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab ? "border-notion-blue text-notion-blue" : "border-transparent text-warm-gray-500 hover:text-notion-black"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "questions" ? (
          <QuestionsTab examId={examId} />
        ) : (
          <CandidatesTab examId={examId} />
        )}
      </div>

      <div className="flex justify-between px-6 pb-6">
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft size={15} className="mr-1" /> Back
        </Button>
        <Button onClick={onNext}>
          Continue to Review <ChevronRight size={15} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

// ── Questions Tab ─────────────────────────────────────────────────────────
function QuestionsTab({ examId }) {
  const [view, setView] = useState("attached"); // "attached" | "pick"
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const { data: attachedData, isLoading: loadingAttached } = useExamQuestions(examId);
  const attached = attachedData?.data || [];

  const { data: bankData, isLoading: loadingBank } = useQuestions({ limit: 50, search });
  const bank = bankData?.data || [];

  const addQuestions = useAddExamQuestions(examId);
  const removeQuestion = useRemoveExamQuestion(examId);

  function handleAdd() {
    if (!selected.length) return;
    addQuestions.mutate(
      { questions: selected.map((id) => ({ questionId: id })) },
      { onSuccess: () => { setSelected([]); setView("attached"); } }
    );
  }



  return (
    <div className="space-y-4">
      {/* Sub-nav */}
      <div className="flex gap-2">
        {[["attached", "Attached Questions"], ["pick", "Pick from Bank"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-micro border transition-colors ${
              view === v ? "border-notion-blue bg-notion-blue/5 text-notion-blue" : "border-whisper text-warm-gray-500 hover:border-warm-gray-300"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Attached list */}
      {view === "attached" && (
        <div className="space-y-2">
          {loadingAttached ? <Loader2 className="animate-spin text-warm-gray-300 mx-auto" /> :
            attached.length === 0 ? (
              <p className="text-[13px] text-warm-gray-500 text-center py-6">No questions attached yet. Pick from the bank to get started.</p>
            ) : attached.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-whisper rounded-micro bg-warm-white/30">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-notion-black truncate">{item.question?.title || item.question?.content?.slice(0, 60)}</p>
                  <div className="flex gap-2 mt-0.5">
                    <Badge variant="info">{item.question?.type}</Badge>
                    <Badge variant="neutral">{item.question?.difficulty}</Badge>
                    <span className="text-[11px] text-warm-gray-500">{item.pointsOverride ?? item.question?.points} pts</span>
                  </div>
                </div>
                <button onClick={() => removeQuestion.mutate(item.question?.id)}
                  className="p-1.5 text-warm-gray-300 hover:text-destructive transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          }
        </div>
      )}

      {/* Pick from bank */}
      {view === "pick" && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question bank..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
            {loadingBank ? <Loader2 className="animate-spin text-warm-gray-300 mx-auto mt-4" /> :
              bank.map((q) => {
                const alreadyAdded = attached.some((a) => a.question?.id === q.id);
                const isSelected = selected.includes(q.id);
                return (
                  <label key={q.id} className={`flex items-start gap-2 p-2 rounded-micro cursor-pointer transition-colors ${isSelected ? "bg-notion-blue/5" : "hover:bg-warm-white"} ${alreadyAdded ? "opacity-40 cursor-not-allowed" : ""}`}>
                    <input type="checkbox" disabled={alreadyAdded} checked={isSelected}
                      onChange={() => setSelected((prev) => isSelected ? prev.filter((x) => x !== q.id) : [...prev, q.id])}
                      className="mt-0.5 w-3.5 h-3.5" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-notion-black truncate">{q.title}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="info">{q.type}</Badge>
                        <Badge variant="neutral">{q.difficulty}</Badge>
                      </div>
                    </div>
                  </label>
                );
              })
            }
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setView("attached")}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!selected.length || addQuestions.isPending}>
              {addQuestions.isPending ? "Adding..." : `Add ${selected.length || ""} Question${selected.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}


    </div>
  );
}

// ── Candidates Tab ────────────────────────────────────────────────────────
function CandidatesTab({ examId }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const { data: enrolledData } = useExamEnrollments(examId);
  const enrolled = enrolledData?.data || [];

  const { data: candData, isLoading } = useCandidates({ limit: 100, search });
  const candidates = candData?.data || [];

  const enroll = useEnrollCandidates(examId);
  const revoke = useRevokeEnrollment(examId);

  function handleEnroll() {
    enroll.mutate(
      { candidateIds: selected, maxAttempts: 1, tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() },
      { onSuccess: () => setSelected([]) }
    );
  }

  return (
    <div className="space-y-4">
      {/* Enrolled */}
      {enrolled.length > 0 && (
        <div>
          <p className="text-[12px] font-medium text-warm-gray-500 uppercase tracking-wide mb-2">{enrolled.length} Enrolled</p>
          <div className="space-y-1 max-h-36 overflow-y-auto border border-whisper rounded-micro p-2">
            {enrolled.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-warm-white rounded-micro">
                <p className="text-[13px] text-notion-black">{e.candidate?.firstName} {e.candidate?.lastName}</p>
                <button onClick={() => revoke.mutate(e.id)} className="text-[11px] text-destructive hover:underline">Revoke</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Picker */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..."
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
          {isLoading ? <Loader2 className="animate-spin text-warm-gray-300 mx-auto mt-4" /> :
            candidates.map((c) => {
              const alreadyEnrolled = enrolled.some((e) => e.candidateId === c.id);
              const isSelected = selected.includes(c.id);
              return (
                <label key={c.id} className={`flex items-center gap-2 p-2 rounded-micro cursor-pointer transition-colors ${isSelected ? "bg-notion-blue/5" : "hover:bg-warm-white"} ${alreadyEnrolled ? "opacity-40 cursor-not-allowed" : ""}`}>
                  <input type="checkbox" disabled={alreadyEnrolled} checked={isSelected}
                    onChange={() => setSelected((prev) => isSelected ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                    className="w-3.5 h-3.5" />
                  <span className="text-[13px] text-notion-black">{c.firstName} {c.lastName}</span>
                  {alreadyEnrolled && <Badge variant="success">Enrolled</Badge>}
                </label>
              );
            })
          }
        </div>
        <div className="flex justify-end">
          <Button onClick={handleEnroll} disabled={!selected.length || enroll.isPending}>
            {enroll.isPending ? "Enrolling..." : `Enroll ${selected.length || ""} Candidate${selected.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
