import { cn } from "@/lib/utils/cn.js";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white rounded-comfortable shadow-card border border-whisper", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 py-5 border-b border-whisper", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
