import ExamTimer from "./ExamTimer.jsx";
import { Type, Minus, Plus } from "lucide-react";
import { useState } from "react";

/**
 * Exam session header bar with exam title, timer, and font size controls.
 *
 * @param {{ examTitle: string, expiresAt: string, onExpire: () => void }} props
 */
export default function ExamHeader({ examTitle, expiresAt, onExpire }) {
  const [fontScale, setFontScale] = useState(100);

  function adjustFont(delta) {
    setFontScale((prev) => Math.min(150, Math.max(75, prev + delta)));
  }

  // Expose font scale via CSS custom property on the header's parent
  // Components below can read --exam-font-scale if needed
  return (
    <header
      className="
        sticky top-0 z-30 flex items-center justify-between
        px-5 py-3 bg-white border-b border-whisper
      "
      style={{ "--exam-font-scale": `${fontScale}%` }}
    >
      {/* Left: Exam title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img src="/logo.png" alt="Veritas" className="w-[18px] h-[18px] object-contain opacity-90" />
        <h1
          className="text-[15px] font-semibold text-notion-black truncate"
          title={examTitle}
        >
          {examTitle || "Exam Session"}
        </h1>
      </div>

      {/* Center: Timer */}
      <div className="flex-shrink-0 mx-4">
        {expiresAt && <ExamTimer expiresAt={expiresAt} onExpire={onExpire} />}
      </div>

      {/* Right: Font size controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => adjustFont(-10)}
          disabled={fontScale <= 75}
          title="Decrease font size"
          className="p-1.5 rounded-micro text-warm-gray-400 hover:text-notion-black hover:bg-warm-white transition-colors disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="flex items-center gap-1 text-[12px] text-warm-gray-500 tabular-nums min-w-[3rem] justify-center">
          <Type size={13} />
          {fontScale}%
        </span>
        <button
          type="button"
          onClick={() => adjustFont(10)}
          disabled={fontScale >= 150}
          title="Increase font size"
          className="p-1.5 rounded-micro text-warm-gray-400 hover:text-notion-black hover:bg-warm-white transition-colors disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </header>
  );
}
