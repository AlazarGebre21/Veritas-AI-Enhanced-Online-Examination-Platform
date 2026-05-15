import { Outlet } from "react-router-dom";

/**
 * Fullscreen layout for the candidate exam taking interface.
 * No navigation — prevents candidates from leaving the exam view.
 * Includes a subtle Veritas wordmark at the top.
 */
export default function ExamLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Subtle branding bar */}
      <div className="flex items-center px-4 py-2 border-b border-whisper bg-white/80 backdrop-blur-sm">
        <span className="text-[13px] font-semibold tracking-tight text-warm-gray-500">
          Veritas
        </span>
        <span className="text-[10px] text-warm-gray-300 ml-1.5">Assessment Platform</span>
      </div>
      <Outlet />
    </div>
  );
}
