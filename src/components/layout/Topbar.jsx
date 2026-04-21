import { useAuthStore } from "@/stores/authStore.js";
import { useUiStore } from "@/stores/uiStore.js";
import { Menu } from "lucide-react";

/**
 * Top navigation bar for dashboard pages.
 * Shows user name, role badge, and sidebar toggle.
 */
export default function Topbar() {
  const { user } = useAuthStore();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="h-14 flex items-center gap-4 px-6 border-b border-whisper bg-white shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-1 rounded-[4px] text-warm-gray-500 hover:text-notion-black hover:bg-warm-white transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-warm-gray-500">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-badge-bg text-badge-text text-[12px] font-semibold tracking-wide">
            {user.role}
          </span>
        </div>
      )}
    </header>
  );
}
