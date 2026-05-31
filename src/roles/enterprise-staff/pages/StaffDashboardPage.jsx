import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  FileText,
  ArrowRight,
  LucideClipboardList,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { ROUTES } from "@/config/routes.js";

export default function StaffDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="pb-2">
        <h1 className="text-xl font-normal text-notion-black">
          Welcome, {user?.firstName || "Staff"}
        </h1>
        <p className="text-warm-gray-500 text-[10px] mt-1">
          Staff Portal — Manage enrollments, questions, and candidates.
        </p>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-notion-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
          to={ROUTES.EXAMS}
          icon={LucideClipboardList}
          title="Exams"
          description="Create, edit, and organize exams"
          color="[#d10523]"
          />
          <QuickAction
            to={ROUTES.STAFF_QUESTIONS}
            icon={FileText}
            title="Question Bank"
            description="Create, edit, and organize questions"
            color="[#d9730d]"
          />
          <QuickAction
            to={ROUTES.STAFF_CANDIDATES}
            icon={Users}
            title="View Candidates"
            description="Browse the candidate pool"
            color="success"
          />
        </div>
      </div>

    
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function QuickAction({ to, icon: Icon, title, description, color }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-5 rounded-md border border-whisper bg-white hover:shadow-card hover:border-notion-blue/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center text-${color} shrink-0 group-hover:scale-110 transition-transform`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-notion-black group-hover:text-notion-blue transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-warm-gray-500 mt-0.5 line-clamp-1">{description}</p>
      </div>
      <ArrowRight
        size={16}
        className="text-warm-gray-300 group-hover:text-notion-blue group-hover:translate-x-0.5 transition-all mt-0.5 ml-auto shrink-0"
      />
    </Link>
  );
}