import { useState } from "react";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import {
  useExamQuestions, useAddExamQuestions, useRemoveExamQuestion,
  useAddExamRule, useDeleteExamRule,
} from "../hooks/useExams.js";
import { useQuestions } from "../hooks/useQuestions.js";
import { Badge } from "@/components/ui/index.js";
import { Button } from "@/components/ui/index.js";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TYPES = ["MCQ", "TrueFalse", "ShortAnswer", "Essay"];

export function ExamQuestionsTab({ examId, exam }) {
  const [view, setView] = useState("list"); // "list" | "pick" | "rules"
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [ruleForm, setRuleForm] = useState({ topic: "", difficulty: "Easy", type: "MCQ", count: 5 });

  const { data: attachedData, isLoading } = useExamQuestions(examId);
  const attached = attachedData?.data || [];
  const rules = exam?.randomizationRules || [];

  const { data: bankData, isLoading: bankLoading } = useQuestions({ limit: 50, search });
  const bank = bankData?.data || [];

  const addQuestions = useAddExamQuestions(examId);
  const removeQuestion = useRemoveExamQuestion(examId);
  const addRule = useAddExamRule(examId);
  const deleteRule = useDeleteExamRule(examId);

  function handleAdd() {
    addQuestions.mutate(
      { questions: selected.map((id) => ({ questionId: id })) },
      { onSuccess: () => { setSelected([]); setView("list"); } }
    );
  }

  function handleAddRule() {
    addRule.mutate(
      { topic: ruleForm.topic, difficulty: ruleForm.difficulty, type: ruleForm.type, count: Number(ruleForm.count) },
      { onSuccess: () => setView("list") }
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-nav */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[["list", "Attached"], ["pick", "Pick from Bank"], ["rules", "Rules"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-micro border transition-colors ${view === v ? "border-notion-blue bg-notion-blue/5 text-notion-blue" : "border-whisper text-warm-gray-500 hover:border-warm-gray-300"}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-warm-gray-500">{attached.length} question{attached.length !== 1 ? "s" : ""} · {rules.length} rule{rules.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Attached list */}
      {view === "list" && (
        <div className="space-y-2">
          {isLoading ? <Loader2 className="animate-spin text-warm-gray-300 mx-auto" /> :
            attached.length === 0 && rules.length === 0 ? (
              <p className="text-[13px] text-warm-gray-500 text-center py-8 border border-dashed border-whisper rounded-comfortable">No questions yet. Pick from the bank or add a randomization rule.</p>
            ) : (
              <>
                {attached.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-whisper rounded-micro bg-white hover:bg-warm-white/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-notion-black truncate">{item.question?.title || item.question?.content?.slice(0, 60)}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="info">{item.question?.type}</Badge>
                        <Badge variant="neutral">{item.question?.difficulty}</Badge>
                        <span className="text-[11px] text-warm-gray-500">{item.pointsOverride ?? item.question?.points} pts</span>
                      </div>
                    </div>
                    <button onClick={() => removeQuestion.mutate(item.question?.id)}
                      className="p-1.5 text-warm-gray-300 hover:text-destructive transition-colors shrink-0 ml-3">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {rules.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-semibold text-warm-gray-500 uppercase tracking-wide">Randomization Rules</p>
                    {rules.map((rule, i) => (
                      <div key={rule.id || i} className="flex items-center justify-between p-3 border border-notion-blue/20 bg-notion-blue/5 rounded-micro">
                        <p className="text-[13px] text-notion-black">
                          Pick <strong>{rule.count}</strong> × <strong>{rule.difficulty}</strong> {rule.type && <Badge variant="info">{rule.type}</Badge>} from "<strong>{rule.topic}</strong>"
                        </p>
                        <button onClick={() => deleteRule.mutate(rule.id)}
                          className="p-1.5 text-warm-gray-300 hover:text-destructive transition-colors shrink-0 ml-3">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          }
        </div>
      )}

      {/* Pick from bank */}
      {view === "pick" && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search question bank..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
            {bankLoading ? <Loader2 className="animate-spin text-warm-gray-300 mx-auto mt-4" /> :
              bank.map((q) => {
                const already = attached.some((a) => a.question?.id === q.id);
                const isSel = selected.includes(q.id);
                return (
                  <label key={q.id} className={`flex items-start gap-2 p-2 rounded-micro cursor-pointer transition-colors ${isSel ? "bg-notion-blue/5" : "hover:bg-warm-white"} ${already ? "opacity-40 cursor-not-allowed" : ""}`}>
                    <input type="checkbox" disabled={already} checked={isSel}
                      onChange={() => setSelected((prev) => isSel ? prev.filter((x) => x !== q.id) : [...prev, q.id])}
                      className="mt-0.5 w-3.5 h-3.5 shrink-0" />
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
            <Button variant="secondary" onClick={() => setView("list")}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!selected.length || addQuestions.isPending}>
              {addQuestions.isPending ? "Adding..." : `Add ${selected.length || ""} Question${selected.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}

      {/* Add rule */}
      {view === "rules" && (
        <div className="space-y-3 p-4 border border-whisper rounded-comfortable bg-warm-white/30">
          <h4 className="text-[14px] font-semibold text-notion-black">New Randomization Rule</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">Topic</label>
              <input value={ruleForm.topic} onChange={(e) => setRuleForm((p) => ({ ...p, topic: e.target.value }))}
                placeholder="e.g. Algebra"
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">Count</label>
              <input type="number" min={1} value={ruleForm.count} onChange={(e) => setRuleForm((p) => ({ ...p, count: e.target.value }))}
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">Difficulty</label>
              <select value={ruleForm.difficulty} onChange={(e) => setRuleForm((p) => ({ ...p, difficulty: e.target.value }))}
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue bg-white appearance-none">
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-notion-black mb-1">Type</label>
              <select value={ruleForm.type} onChange={(e) => setRuleForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-micro px-3 py-2 text-[13px] focus:outline-none focus:border-notion-blue bg-white appearance-none">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setView("list")}>Cancel</Button>
            <Button onClick={handleAddRule} disabled={!ruleForm.topic || addRule.isPending}>
              {addRule.isPending ? "Adding..." : "Add Rule"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
