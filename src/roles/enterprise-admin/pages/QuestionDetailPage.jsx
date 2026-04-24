import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useQuestion, useCreateQuestion, useUpdateQuestion } from "../hooks/useQuestions.js";
import { Button, Input, Badge, Skeleton } from "@/components/ui/index.js";
import { Card, CardContent } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";

// ── Zod schema ──────────────────────────────────────────────────────────
const questionSchema = z.object({
  title: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Question content is required"),
  type: z.enum(["MCQ", "TrueFalse", "ShortAnswer", "Essay"]),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  points: z.coerce.number().min(0, "Must be >= 0"),
  negativePoints: z.coerce.number().min(0).optional().default(0),
  topic: z.string().optional().default(""),
  mediaUrl: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
  metadata: z.object({
    gradeField: z.string().optional().default(""),
    course: z.string().optional().default(""),
    chapter: z.string().optional().default(""),
    tags: z.string().optional().default(""),
    examYear: z.string().optional().default(""),
  }).optional(),
});


const TYPES = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "TrueFalse", label: "True / False" },
  { value: "ShortAnswer", label: "Short Answer" },
  { value: "Essay", label: "Essay" },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  // Fetch existing question
  const { data: question, isLoading } = useQuestion(isNew ? null : id);

  // Mutations
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const saving = createQuestion.isPending || updateQuestion.isPending;

  // Options state (managed outside react-hook-form for dynamic list)
  const [options, setOptions] = useState([
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "MCQ",
      difficulty: "Easy",
      points: 1,
      negativePoints: 0,
      topic: "",
      mediaUrl: "",
      isActive: true,
      metadata: {
        gradeField: "",
        course: "",
        chapter: "",
        tags: "",
        examYear: "",
      },
    },
  });

  const questionType = watch("type");
  const needsOptions = questionType === "MCQ" || questionType === "TrueFalse";

  // Populate form when editing
  useEffect(() => {
    if (question && !isNew) {
      reset({
        title: question.title || "",
        content: question.content || "",
        type: question.type || "MCQ",
        difficulty: question.difficulty || "Easy",
        points: question.points || 0,
        negativePoints: question.negativePoints || 0,
        topic: question.topic || "",
        mediaUrl: question.mediaUrl || "",
        isActive: question.isActive ?? true,
        metadata: {
          gradeField: question.metadata?.gradeField || "",
          course: question.metadata?.course || "",
          chapter: question.metadata?.chapter || "",
          tags: question.metadata?.tags || "",
          examYear: question.metadata?.examYear || "",
        },
      });
      if (question.options?.length) {
        setOptions(question.options.map((o) => ({ content: o.content, isCorrect: o.isCorrect })));
      }
    }
  }, [question, isNew, reset]);

  // Auto-set True/False options
  useEffect(() => {
    if (questionType === "TrueFalse") {
      setOptions([
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ]);
    }
  }, [questionType]);

  // ── Options handlers ──────────────────────────────────────────────────
  function addOption() {
    setOptions((prev) => [...prev, { content: "", isCorrect: false }]);
  }

  function removeOption(idx) {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateOptionContent(idx, value) {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, content: value } : o))
    );
  }

  function toggleCorrect(idx) {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, isCorrect: !o.isCorrect } : o))
    );
  }

  // ── Submit ────────────────────────────────────────────────────────────
  function onSubmit(values) {
    const payload = { ...values };
    
    // Omit optional fields if they are empty strings
    if (payload.topic === "") delete payload.topic;
    if (payload.mediaUrl === "") delete payload.mediaUrl;

    // Ensure options is always an array
    if (needsOptions) {
      payload.options = options.filter((o) => o.content.trim());
    } else {
      payload.options = [];
    }

    // Ensure metadata is at least an empty object and omit empty strings
    payload.metadata = payload.metadata || {};
    Object.keys(payload.metadata).forEach((key) => {
      if (!payload.metadata[key]) delete payload.metadata[key];
    });

    if (isNew) {
      createQuestion.mutate(payload, {
        onSuccess: () => navigate(ROUTES.QUESTIONS),
      });
    } else {
      updateQuestion.mutate(
        { id, payload },
        { onSuccess: () => navigate(ROUTES.QUESTIONS) }
      );
    }
  }

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => navigate(ROUTES.QUESTIONS)}
        className="flex items-center gap-1.5 text-[14px] text-warm-gray-500 hover:text-notion-black transition-colors"
      >
        <ArrowLeft size={16} /> Back to Question Bank
      </button>

      {/* Header */}
      <div className="border-b border-whisper pb-5">
        <h1 className="text-2xl font-bold text-notion-black">
          {isNew ? "Create Question" : "Edit Question"}
        </h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          {isNew ? "Add a new question to your bank." : `Editing: ${question?.title || ""}`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Left Column: Main Body ───────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Input
                  label="Subject"
                  id="q-title"
                  placeholder="e.g. Physics - Mechanics"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Content (textarea) */}
                <div>
                  <label htmlFor="q-content" className="block text-[14px] font-medium text-notion-black mb-1.5">
                    Question Content
                  </label>
                  <textarea
                    id="q-content"
                    rows={8}
                    placeholder="Full question text shown to candidates..."
                    className="w-full border border-[#ddd] rounded-micro px-3.5 py-2.5 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all resize-y placeholder:text-warm-gray-300"
                    {...register("content")}
                  />
                  {errors.content && (
                    <p className="text-warning text-[12px] mt-1">{errors.content.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label htmlFor="q-type" className="block text-[14px] font-medium text-notion-black mb-1.5">
                      Question Type
                    </label>
                    <select
                      id="q-type"
                      {...register("type")}
                      className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
                    >
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label htmlFor="q-diff" className="block text-[14px] font-medium text-notion-black mb-1.5">
                      Difficulty
                    </label>
                    <select
                      id="q-diff"
                      {...register("difficulty")}
                      className="w-full border border-[#ddd] rounded-micro px-3.5 py-2 text-[14px] text-notion-black focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20 transition-all bg-white appearance-none"
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Points"
                    id="q-points"
                    type="number"
                    min={0}
                    error={errors.points?.message}
                    {...register("points")}
                  />
                  <Input
                    label="Negative Points"
                    id="q-neg"
                    type="number"
                    min={0}
                    {...register("negativePoints")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right Column: Additional Information & Options ────────────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Options Editor (MCQ / TrueFalse) */}
            {needsOptions && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-notion-black">Answer Options</h3>
                    {questionType === "MCQ" && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="flex items-center gap-1 text-[13px] font-medium text-notion-blue hover:text-active-blue transition-colors"
                      >
                        <Plus size={14} /> Add Option
                      </button>
                    )}
                  </div>

                  <p className="text-[13px] text-warm-gray-500 -mt-2">
                    Click the circle to mark the correct answer(s).
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-micro border transition-colors ${
                          opt.isCorrect
                            ? "border-success/40 bg-success/5"
                            : "border-whisper bg-white"
                        }`}
                      >
                        {/* Correct toggle */}
                        <button
                          type="button"
                          onClick={() => toggleCorrect(idx)}
                          className={`shrink-0 transition-colors ${
                            opt.isCorrect ? "text-success" : "text-warm-gray-300 hover:text-warm-gray-500"
                          }`}
                          title={opt.isCorrect ? "Marked correct" : "Mark as correct"}
                        >
                          {opt.isCorrect ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>

                        {/* Content */}
                        <input
                          type="text"
                          value={opt.content}
                          onChange={(e) => updateOptionContent(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          disabled={questionType === "TrueFalse"}
                          className="flex-1 bg-transparent text-[14px] text-notion-black placeholder:text-warm-gray-300 focus:outline-none disabled:opacity-60"
                        />

                        {/* Delete (only MCQ, min 2 options) */}
                        {questionType === "MCQ" && options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            className="p-1 text-warm-gray-300 hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata / Additional Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-[16px] font-semibold text-notion-black">Additional Details</h3>
                
                <Input
                  label="Topic (optional)"
                  id="q-topic"
                  placeholder="e.g. Algebra"
                  {...register("topic")}
                />
                
                <Input
                  label="Media URL (optional)"
                  id="q-media"
                  placeholder="https://..."
                  {...register("mediaUrl")}
                />

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-whisper mt-2">
                  <Input
                    label="Grade/Field"
                    id="q-meta-grade"
                    placeholder="e.g. 12"
                    {...register("metadata.gradeField")}
                  />
                  <Input
                    label="Course"
                    id="q-meta-course"
                    placeholder="e.g. Physics"
                    {...register("metadata.course")}
                  />
                  <Input
                    label="Chapter"
                    id="q-meta-chapter"
                    placeholder="e.g. Electricity"
                    {...register("metadata.chapter")}
                  />
                  <Input
                    label="Exam Year"
                    id="q-meta-year"
                    placeholder="e.g. 2022"
                    {...register("metadata.examYear")}
                  />
                </div>
                
                <Input
                  label="Tags"
                  id="q-meta-tags"
                  placeholder="e.g. conceptual"
                  {...register("metadata.tags")}
                />

                <div className="pt-4 border-t border-whisper mt-2">
                  {/* Active toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded border-[#ddd] text-notion-blue focus:ring-notion-blue/20" />
                    <span className="text-[14px] text-notion-black font-medium">Active Status</span>
                  </label>
                  <p className="text-[12px] text-warm-gray-500 mt-1">
                    Inactive questions will not appear in exams.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Error & Actions ─────────────────────────────────────────── */}
        {(createQuestion.isError || updateQuestion.isError) && (
          <p className="text-warning text-[13px]">
            {(createQuestion.error || updateQuestion.error)?.response?.data?.error || "Failed to save question."}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-whisper pt-5">
          <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.QUESTIONS)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isNew ? "Create Question" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
