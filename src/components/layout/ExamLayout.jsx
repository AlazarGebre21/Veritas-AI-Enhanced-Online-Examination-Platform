import { Outlet } from "react-router-dom";

/**
 * Fullscreen layout for the candidate exam taking interface.
 * No navigation — prevents candidates from leaving the exam view.
 */
export default function ExamLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Outlet />
    </div>
  );
}
