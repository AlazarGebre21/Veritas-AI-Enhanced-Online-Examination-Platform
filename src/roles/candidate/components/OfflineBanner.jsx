import { WifiOff } from "lucide-react";

/**
 * Fixed top banner shown when the candidate is offline.
 * @param {{ isOnline: boolean, pendingCount: number }} props
 */
export default function OfflineBanner({ isOnline, pendingCount }) {
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning/95 text-white px-4 py-2 flex items-center justify-center gap-2 text-[13px] font-medium animate-slide-down">
      <WifiOff size={15} />
      <span>
        You are offline — answers are being saved locally
        {pendingCount > 0 && ` (${pendingCount} pending)`}
      </span>
    </div>
  );
}
