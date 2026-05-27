import { useAuthStore } from "@/stores/authStore.js";

/**
 * Top navigation bar for dashboard pages.
 * Shows user name and role badge.
 */
export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 flex items-center gap-4 px-6 border-b border-whisper bg-brand-sidebar shrink-0">
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
