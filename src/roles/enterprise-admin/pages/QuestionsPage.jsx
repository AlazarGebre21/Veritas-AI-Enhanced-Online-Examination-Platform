import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { useQuestions } from "../hooks/useQuestions.js";
import { Button, Skeleton } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";

export default function QuestionsPage() {
  const navigate = useNavigate();

  // Fetch a large page of questions to group by subject
  const { data, isLoading } = useQuestions({
    page: 1,
    limit: 1000,
    sort: "created_at",
    sort_dir: "desc",
    with_correct_answer: false,
  });
  
  const questions = data?.data || [];
  
  // Group questions by title (Subject)
  const subjectsMap = {};
  questions.forEach(q => {
    const subject = q.title || "Untitled Subject";
    if (!subjectsMap[subject]) {
      subjectsMap[subject] = [];
    }
    subjectsMap[subject].push(q);
  });
  
  const subjects = Object.keys(subjectsMap).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-whisper pb-6">
        <div>
          <h1 className="text-2xl font-bold text-notion-black">Question Bank</h1>
          <p className="text-warm-gray-500 text-[15px] mt-1">
            Browse your questions categorized by subject.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.QUESTION_DETAIL.replace(":id", "new"))}>
          <Plus size={16} className="mr-2" />
          Create Question
        </Button>
      </div>

      {/* Grid of Subjects */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-whisper rounded-md">
          <p className="text-warm-gray-500 text-[14px]">No subjects found. Create your first question to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const count = subjectsMap[subject].length;
            return (
              <div
                key={subject}
                onClick={() => navigate(ROUTES.QUESTIONS_SUBJECT.replace(":subjectName", encodeURIComponent(subject)))}
                className="group flex flex-col justify-between p-5 bg-white border border-whisper rounded-md hover:border-notion-blue/40 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-notion-blue/5 text-notion-blue rounded-md group-hover:bg-notion-blue group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[15px] text-notion-black line-clamp-2" title={subject}>
                      {subject}
                    </h3>
                  </div>
                </div>
                <div className="text-[13px] text-warm-gray-500 font-medium">
                  {count} {count === 1 ? "question" : "questions"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
