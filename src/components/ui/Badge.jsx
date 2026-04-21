import { cn } from "@/lib/utils/cn.js";

export function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium tracking-wide",
        variant === "default" && "bg-badge-bg text-badge-text",
        variant === "success" && "bg-[#ebf5ed] text-success",
        variant === "warning" && "bg-[#fff0e6] text-warning",
        variant === "neutral" && "bg-warm-white text-warm-gray-500",
        className
      )}
    >
      {children}
    </span>
  );
}
