import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import BrandingProvider from "@/components/shared/BrandingProvider.jsx";
import { useAuthStore } from "@/stores/authStore.js";
import { useUiStore } from "@/stores/uiStore.js";
import { USER_ROLES } from "@/config/constants.js";
import { cn } from "@/lib/utils/cn.js";

/**
 * Shared layout for all authenticated dashboard views.
 * Contains the sidebar, topbar, and main content area.
 * Wraps enterprise roles with BrandingProvider for dynamic theming.
 */
export default function DashboardLayout() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const userRole = useAuthStore((s) => s.user?.role);

  const isEnterprise =
    userRole === USER_ROLES.ENTERPRISE_ADMIN ||
    userRole === USER_ROLES.ENTERPRISE_STAFF;

  const layout = (
    <div className="flex h-screen overflow-hidden bg-brand-bg text-brand-text" style={{ fontFamily: "var(--font-brand)" }}>
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-200",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );

  // Wrap with BrandingProvider only for enterprise roles
  return isEnterprise ? <BrandingProvider>{layout}</BrandingProvider> : layout;
}
