import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  ClipboardList,
  BarChart2,
  CreditCard,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore.js";
import { useUiStore } from "@/stores/uiStore.js";
import { USER_ROLES } from "@/config/constants.js";
import { ROUTES } from "@/config/routes.js";
import { cn } from "@/lib/utils/cn.js";

const NAV_ITEMS = {
  [USER_ROLES.SYSTEM_ADMIN]: [
    { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.ADMIN },
    { label: "Enterprises", icon: Building2, to: ROUTES.ADMIN_ENTERPRISES },
    { label: "Subscriptions", icon: CreditCard, to: ROUTES.ADMIN_SUBSCRIPTIONS },
    { label: "Audit Log", icon: ScrollText, to: ROUTES.ADMIN_AUDIT_LOG },
  ],
  [USER_ROLES.ENTERPRISE_ADMIN]: [
    { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.DASHBOARD },
    { label: "Staff", icon: Users, to: ROUTES.STAFF },
    { label: "Candidates", icon: Users, to: ROUTES.CANDIDATES },
    { label: "Questions", icon: FileText, to: ROUTES.QUESTIONS },
    { label: "Exams", icon: ClipboardList, to: ROUTES.EXAMS },
    { label: "Results", icon: BarChart2, to: ROUTES.RESULTS },
    { label: "Billing", icon: CreditCard, to: ROUTES.BILLING },
    { label: "Settings", icon: Settings, to: ROUTES.SETTINGS },
  ],
  [USER_ROLES.ENTERPRISE_STAFF]: [
    { label: "Dashboard", icon: LayoutDashboard, to: ROUTES.STAFF_PORTAL },
    { label: "Exams", icon: ClipboardList, to: ROUTES.STAFF_EXAMS },
    { label: "Questions", icon: FileText, to: ROUTES.STAFF_QUESTIONS },
    { label: "Monitoring", icon: BarChart2, to: ROUTES.STAFF_MONITOR },
    { label: "Results", icon: BarChart2, to: ROUTES.STAFF_RESULTS },
  ],
};

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS[user?.role] ?? [];

  function handleLogout() {
    clearAuth();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-whisper",
        "transition-all duration-200",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-whisper shrink-0">
        <div className="w-7 h-7 rounded bg-notion-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
          V
        </div>
        {sidebarOpen && (
          <span className="font-semibold text-notion-black text-[15px] truncate">Veritas</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[5px] px-2 py-2 text-[14px] font-medium transition-colors",
                "text-warm-gray-500 hover:bg-warm-white hover:text-notion-black",
                isActive && "bg-warm-white text-notion-black font-semibold"
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-whisper px-2 py-3 space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-[5px] px-2 py-2 text-[14px] font-medium text-warm-gray-500 hover:bg-warm-white hover:text-notion-black transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 w-full rounded-[5px] px-2 py-2 text-[14px] font-medium text-warm-gray-300 hover:text-notion-black transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          {sidebarOpen && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
