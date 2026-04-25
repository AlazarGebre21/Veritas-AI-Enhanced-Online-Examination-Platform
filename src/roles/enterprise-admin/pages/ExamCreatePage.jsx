import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useCreateExam } from "../hooks/useExams.js";
import { Button, Input } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";
import { BuildEnrollStage } from "./ExamWizardBuildStage.jsx";
import { ReviewPublishStage } from "./ExamWizardReviewStage.jsx";

// ── Wizard draft key (localStorage) ──────────────────────────────────────
const DRAFT_KEY = "veritas_exam_wizard_draft";

const STEPS = ["Setup Details", "Build & Enroll", "Review & Publish"];

const DEFAULT_SETTINGS = {
  randomizeQuestions: true,
  randomizeOptions: true,
  shufflePerStudent: true,
  showResultsImmediately: false,
  allowReview: true,
  maxAttempts: 1,
  proctoring: { enabled: false },
};

const setupSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topic: z.string().min(1, "Subject/topic is required"),
  description: z.string().optional().default(""),
  durationMinutes: z.coerce.number().min(1, "Must be at least 1 minute"),
  maxParticipants: z.coerce.number().min(1).optional(),
  passingScorePercent: z.coerce.number().min(0).max(100).optional().default(60),
  negativeMarking: z.boolean().optional().default(false),
  // Settings toggles
  randomizeQuestions: z.boolean().default(true),
  randomizeOptions: z.boolean().default(true),
  shufflePerStudent: z.boolean().default(true),
  showResultsImmediately: z.boolean().default(false),
  allowReview: z.boolean().default(true),
  maxAttempts: z.coerce.number().min(1).default(1),
  proctoringEnabled: z.boolean().default(false),
});

// ── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-colors ${
                  done
                    ? "bg-success text-white"
                    : active
                    ? "bg-notion-blue text-white"
                    : "bg-warm-white border-2 border-whisper text-warm-gray-300"
                }`}
              >
                {done ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-medium mt-1 whitespace-nowrap ${
                  active ? "text-notion-blue" : done ? "text-success" : "text-warm-gray-300"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-5 mx-2 transition-colors ${done ? "bg-success" : "bg-whisper"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Stage 1: Setup Details ────────────────────────────────────────────────
function Stage1({ onNext, initialData }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(setupSchema),
    defaultValues: initialData || {
      title: "", topic: "", description: "",
      durationMinutes: 60, passingScorePercent: 60, negativeMarking: false, maxAttempts: 1,
      randomizeQuestions: true, randomizeOptions: true, shufflePerStudent: true,
      showResultsImmediately: false, allowReview: true, proctoringEnabled: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Exam Title" id="wiz-title" placeholder="e.g. Midterm Algebra Test"
          error={errors.title?.message} {...register("title")} />
        <Input label="Subject / Topic" id="wiz-topic" placeholder="e.g. Mathematics"
          error={errors.topic?.message} {...register("topic")} />
      </div>

      <div>
        <label className="block text-[14px] font-medium text-notion-black mb-1.5">Description (optional)</label>
        <textarea rows={3} placeholder="Describe what this exam covers..."
          className="w-full border border-[#ddd] rounded-micro px-3.5 py-2.5 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all resize-none placeholder:text-warm-gray-300"
          {...register("description")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Duration (minutes)" id="wiz-duration" type="number" min={1}
          error={errors.durationMinutes?.message} {...register("durationMinutes")} />
        <Input label="Max Participants" id="wiz-max" type="number" min={1} placeholder="Unlimited"
          {...register("maxParticipants")} />
        <Input label="Passing Score %" id="wiz-pass" type="number" min={0} max={100}
          {...register("passingScorePercent")} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register("negativeMarking")}
          className="w-4 h-4 rounded border-[#ddd] text-notion-blue focus:ring-notion-blue/20" />
        <span className="text-[14px] text-notion-black">Enable negative marking</span>
      </label>

      {/* Advanced Settings */}
      <div className="border border-whisper rounded-comfortable overflow-hidden">
        <button type="button" onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-[14px] font-medium text-notion-black hover:bg-warm-white/50 transition-colors">
          Advanced Settings
          <ChevronRight size={16} className={`text-warm-gray-300 transition-transform ${advancedOpen ? "rotate-90" : ""}`} />
        </button>
        {advancedOpen && (
          <div className="px-4 py-4 border-t border-whisper space-y-3 bg-warm-white/30">
            {[
              { name: "randomizeQuestions", label: "Randomize question order" },
              { name: "randomizeOptions", label: "Randomize MCQ option order" },
              { name: "shufflePerStudent", label: "Unique shuffle per student" },
              { name: "showResultsImmediately", label: "Show results immediately after submission" },
              { name: "allowReview", label: "Allow answer review before submit" },
              { name: "proctoringEnabled", label: "Enable AI proctoring" },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(name)}
                  className="w-4 h-4 rounded border-[#ddd] text-notion-blue focus:ring-notion-blue/20" />
                <span className="text-[13px] text-notion-black">{label}</span>
              </label>
            ))}
            <Input label="Max Attempts" id="wiz-attempts" type="number" min={1} {...register("maxAttempts")} />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit">Continue <ChevronRight size={15} className="ml-1" /></Button>
      </div>
    </form>
  );
}

// ── Main Wizard Shell ─────────────────────────────────────────────────────
export default function ExamCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillTopic = searchParams.get("topic") || "";

  const [step, setStep] = useState(0);
  const [examId, setExamId] = useState(null);
  const [stage1Data, setStage1Data] = useState(null);

  const createExam = useCreateExam();

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.examId) { setExamId(draft.examId); setStep(draft.step || 1); }
        if (draft.stage1Data) setStage1Data(draft.stage1Data);
      }
    } catch { /* ignore */ }
  }, []);

  function saveDraft(update) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(update)); } catch { /* ignore */ }
  }

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }

  function handleStage1Submit(values) {
    const settings = {
      randomizeQuestions: values.randomizeQuestions,
      randomizeOptions: values.randomizeOptions,
      shufflePerStudent: values.shufflePerStudent,
      showResultsImmediately: values.showResultsImmediately,
      allowReview: values.allowReview,
      maxAttempts: values.maxAttempts,
      proctoring: { enabled: values.proctoringEnabled },
      topic: values.topic,
    };
    const payload = {
      title: values.title,
      description: values.description,
      durationMinutes: values.durationMinutes,
      maxParticipants: values.maxParticipants,
      passingScorePercent: values.passingScorePercent,
      negativeMarking: values.negativeMarking,
      settings,
    };
    createExam.mutate(payload, {
      onSuccess: (exam) => {
        const id = exam?.id || exam?.data?.id;
        setExamId(id);
        setStage1Data(values);
        const draft = { examId: id, step: 1, stage1Data: values };
        saveDraft(draft);
        setStep(1);
      },
    });
  }

  function handleCancel() {
    clearDraft();
    navigate(ROUTES.EXAMS);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-whisper pb-5">
        <h1 className="text-2xl font-bold text-notion-black">Create Exam</h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          Follow the steps to set up, build, and publish your exam.
        </p>
      </div>

      <StepIndicator current={step} />

      {/* Stage 0 — Setup */}
      {step === 0 && (
        <div className="bg-white border border-whisper rounded-comfortable p-6 shadow-sm">
          <h2 className="text-[17px] font-semibold text-notion-black mb-5">Step 1 — Setup Details</h2>
          {createExam.isError && (
            <p className="text-destructive text-[13px] mb-4">
              {createExam.error?.response?.data?.error || "Failed to create exam. Please try again."}
            </p>
          )}
          <Stage1
            onNext={handleStage1Submit}
            initialData={stage1Data || (prefillTopic ? { topic: prefillTopic } : null)}
          />
        </div>
      )}

      {/* Stage 1 — Build & Enroll */}
      {step === 1 && examId && (
        <BuildEnrollStage
          examId={examId}
          onNext={() => { saveDraft({ examId, step: 2, stage1Data }); setStep(2); }}
          onBack={() => setStep(0)}
        />
      )}

      {/* Stage 2 — Review & Publish */}
      {step === 2 && examId && (
        <ReviewPublishStage
          examId={examId}
          onPublished={() => { clearDraft(); navigate(ROUTES.EXAM_DETAIL.replace(":id", examId)); }}
          onBack={() => setStep(1)}
          onSaveDraft={() => { clearDraft(); navigate(ROUTES.EXAMS); }}
        />
      )}

      {/* Cancel link */}
      <div className="text-center">
        <button onClick={handleCancel} className="text-[13px] text-warm-gray-300 hover:text-warm-gray-500 transition-colors">
          Cancel and discard draft
        </button>
      </div>
    </div>
  );
}


