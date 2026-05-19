/**
 * Selectable options list for MCQ and TrueFalse question types.
 * @param {{ options: Array<{ id: string, text: string }>, selectedIds: string[], onSelect: (id: string) => void }} props
 */
export default function AnswerOptionList({ options = [], selectedIds = [], onSelect }) {
  return (
    <div className="space-y-2" role="radiogroup">
      {options.map((opt, idx) => {
        const isSelected = selectedIds.includes(opt.id);
        const letter = String.fromCharCode(65 + idx);
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(opt.id)}
            className={`w-full flex items-start gap-3 px-4 py-3 rounded-subtle text-left text-[14px] transition-all border ${
              isSelected
                ? "border-notion-blue bg-notion-blue/5 text-notion-black"
                : "border-whisper bg-white text-notion-black hover:border-warm-gray-300 hover:bg-warm-white"
            }`}
          >
            <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-[12px] font-bold ${
              isSelected ? "bg-notion-blue text-white" : "bg-warm-white text-warm-gray-500 border border-whisper"
            }`}>
              {letter}
            </span>
            <span className="pt-0.5 leading-relaxed">{opt.text || opt.content}</span>
          </button>
        );
      })}
    </div>
  );
}
