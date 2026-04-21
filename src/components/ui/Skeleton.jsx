import { cn } from "@/lib/utils/cn.js";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-[#e8e6e3]", className)}
      {...props}
    />
  );
}
