import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useUiStore } from "@/stores/uiStore.js";
import { cn } from "@/lib/utils/cn.js";

/**
 * Shared layout for all authenticated dashboard views.
 * Contains the sidebar, topbar, and main content area.
 */
export default function DashboardLayout() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-warm-white">
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
}
