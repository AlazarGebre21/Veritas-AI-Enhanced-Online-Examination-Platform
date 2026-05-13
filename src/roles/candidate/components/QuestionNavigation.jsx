import { useMemo } from "react";

/**
 * Question navigation panel — grid of numbered buttons showing answer state.
 *
 * Color-coded:
 *  - Gray: unanswered
 *  - Green: answered
 *  - Orange: flagged for review
 *  - Blue ring: current question
 *
 * @param {{
 *   questions: Array<{ id: string }>,
 *   answers: Map<string, any>,
 *   currentIndex: number,
 *   flagged: Set<string>,
 *   onNavigate: (index: number) => void,
 * }} props
 */
export default function QuestionNavigation({
  questions = [],
  answers = new Map(),
  currentIndex = 0,
  flagged = new Set(),
  onNavigate,
}) {
  const stats = useMemo(() => {
    let answered = 0;
    let flaggedCount = 0;
    questions.forEach((q) => {
      if (answers.has(q.id)) answered++;
      if (flagged.has(q.id)) flaggedCount++;
    });
    return { answered, flaggedCount, total: questions.length };
  }, [questions, answers, flagged]);

  return (
    <div className="flex flex-col h-full">
      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answers.has(q.id);
            const isFlagged = flagged.has(q.id);

            let bgClass = "bg-warm-white text-warm-gray-500"; // unanswered
            if (isFlagged) bgClass = "bg-warning/15 text-warning";
            else if (isAnswered) bgClass = "bg-success/15 text-success";

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onNavigate(idx)}
                title={`Question ${idx + 1}${isAnswered ? " (answered)" : ""}${isFlagged ? " (flagged)" : ""}`}
                className={`
                  w-full aspect-square flex items-center justify-center
                  text-[12px] font-semibold rounded-micro
                  transition-all
                  ${bgClass}
                  ${isCurrent ? "ring-2 ring-notion-blue ring-offset-1" : ""}
                  hover:ring-2 hover:ring-notion-blue/40
                `}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary footer */}
      <div className="border-t border-whisper px-3 py-2.5 text-[11px] text-warm-gray-500 space-y-0.5">
        <p>
          <span className="inline-block w-2 h-2 rounded-full bg-success mr-1.5 align-middle" />
          {stats.answered}/{stats.total} answered
        </p>
        {stats.flaggedCount > 0 && (
          <p>
            <span className="inline-block w-2 h-2 rounded-full bg-warning mr-1.5 align-middle" />
            {stats.flaggedCount} flagged
          </p>
        )}
      </div>
    </div>
  );
}
