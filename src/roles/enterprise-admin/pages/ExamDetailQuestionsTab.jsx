import { useState, useMemo } from "react";
import { Trash2, Search, Loader2 } from "lucide-react";
import {
  useExamQuestions, useAddExamQuestions, useRemoveExamQuestion,
} from "../hooks/useExams.js";
import { useQuestions } from "../hooks/useQuestions.js";
import { Badge, Button } from "@/components/ui/index.js";



export function ExamQuestionsTab({ examId, exam }) {
  const [view, setView] = useState("list"); // "list" | "pick"
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  // Fetch attached questions
  const { data: attachedData, isLoading } = useExamQuestions(examId);
  const attached = attachedData?.data || [];

  // Fetch ALL bank questions once — client-side search filtering
  const { data: bankData, isLoading: bankLoading } = useQuestions({ limit: 1000 });
  const allBank = bankData?.data || [];

  // Client-side filter
  const filteredBank = useMemo(() => {
    if (!search.trim()) return allBank;
    const q = search.toLowerCase();
    return allBank.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.topic?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q) ||
        item.difficulty?.toLowerCase().includes(q)
    );
  }, [allBank, search]);

  const addQuestions = useAddExamQuestions(examId);
  const removeQuestion = useRemoveExamQuestion(examId);
  const [removingId, setRemovingId] = useState(null);


  function handleAdd() {
    addQuestions.mutate(
      { questions: selected.map((id) => ({ questionId: id })) },
      { onSuccess: () => { setSelected([]); setView("list"); } }
    );
  }



  return (
    <div className="space-y-4">
      {/* Sub-nav */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[["list", "Attached"], ["pick", "Pick from Bank"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-micro border transition-colors ${
                view === v ? "border-notion-blue bg-notion-blue/5 text-notion-blue" : "border-whisper text-warm-gray-500 hover:border-warm-gray-300"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-warm-gray-500">
          {attached.length} question{attached.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Attached list ─────────────────────────────────────────────── */}
      {view === "list" && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-warm-gray-300" size={24} /></div>
          ) : attached.length === 0 ? (
            <p className="text-[13px] text-warm-gray-500 text-center py-8 border border-dashed border-whisper rounded-comfortable">
              No questions yet. Pick from the bank to get started.
            </p>
          ) : (
            <>
              {attached.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-whisper rounded-micro bg-white hover:bg-warm-white/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-notion-black truncate">
                      {item.question?.title || item.question?.content?.slice(0, 80)}
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      <Badge variant="info">{item.question?.type}</Badge>
                      <Badge variant="neutral">{item.question?.difficulty}</Badge>
                      <span className="text-[11px] text-warm-gray-500">{item.pointsOverride ?? item.question?.points} pts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const qId = item.questionId ?? item.question?.id;
                      if (!qId) return;
                      setRemovingId(qId);
                      removeQuestion.mutate(qId, {
                        onSettled: () => setRemovingId(null),
                      });
                    }}
                    disabled={removingId === (item.questionId ?? item.question?.id)}
                    className="p-2 text-warm-gray-300 hover:text-destructive transition-colors shrink-0 ml-3 rounded-micro hover:bg-destructive/5 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Remove question"
                  >
                    {removingId === (item.questionId ?? item.question?.id)
                      ? <Loader2 size={18} className="animate-spin" />
                      : <Trash2 size={18} />}
                  </button>
                </div>
              ))}

            </>
          )}
        </div>
      )}

      {/* ── Pick from bank ────────────────────────────────────────────── */}
      {view === "pick" && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, topic, type, or difficulty..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20"
            />
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
            {bankLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-warm-gray-300" size={20} /></div>
            ) : filteredBank.length === 0 ? (
              <p className="text-center text-[13px] text-warm-gray-500 py-6">No questions match your search.</p>
            ) : (
              filteredBank.map((q) => {
                const already = attached.some((a) => (a.questionId || a.question?.id) === q.id);
                const isSel = selected.includes(q.id);
                return (
                  <label key={q.id} className={`flex items-start gap-2.5 p-2.5 rounded-micro cursor-pointer transition-colors ${isSel ? "bg-notion-blue/5" : "hover:bg-warm-white"} ${already ? "opacity-40 cursor-not-allowed" : ""}`}>
                    <input type="checkbox" disabled={already} checked={isSel}
                      onChange={() => setSelected((prev) => isSel ? prev.filter((x) => x !== q.id) : [...prev, q.id])}
                      className="mt-0.5 w-3.5 h-3.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-notion-black truncate">{q.title}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="info">{q.type}</Badge>
                        <Badge variant="neutral">{q.difficulty}</Badge>
                        {q.topic && <span className="text-[11px] text-warm-gray-500">{q.topic}</span>}
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-warm-gray-500">{selected.length} selected</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setView("list"); setSelected([]); }}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!selected.length || addQuestions.isPending}>
                {addQuestions.isPending ? "Adding..." : `Add ${selected.length} Question${selected.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
