import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { Card, CardContent } from "@/components/ui/index.js";
import { ROUTES } from "@/config/routes.js";

export default function StaffDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-whisper pb-6">
        <h1 className="text-2xl font-bold text-notion-black">
          Welcome, {user?.firstName || "Staff"} 👋
        </h1>
        <p className="text-warm-gray-500 text-[15px] mt-1">
          Staff Portal — Manage enrollments, questions, and candidates.
        </p>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-semibold text-notion-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            to={ROUTES.STAFF_ENROLLMENTS}
            icon={ClipboardList}
            title="Manage Enrollments"
            description="Enroll candidates and send invitations"
            color="notion-blue"
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

      {/* ── Info Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <InfoCard
          icon={ClipboardList}
          title="Enrollments"
          description="Enroll candidates into exams using exam IDs provided by your administrator."
          color="notion-blue"
        />
        <InfoCard
          icon={FileText}
          title="Questions"
          description="Build and organize your question bank. Create, edit, and manage question content."
          color="[#d9730d]"
        />
        <InfoCard
          icon={Users}
          title="Candidates"
          description="View the candidate pool. Candidate management is handled by your administrator."
          color="success"
        />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function QuickAction({ to, icon: Icon, title, description, color }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 p-5 rounded-comfortable border border-whisper bg-white hover:shadow-card hover:border-notion-blue/30 hover:-translate-y-0.5 transition-all duration-200"
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

function InfoCard({ icon: Icon, title, description, color }) {
  return (
    <Card className="hover:shadow-card transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-lg bg-${color}/10 flex items-center justify-center text-${color} shrink-0`}
          >
            <Icon size={16} />
          </div>
          <h3 className="text-[15px] font-semibold text-notion-black">{title}</h3>
        </div>
        <p className="text-[13px] text-warm-gray-500 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
