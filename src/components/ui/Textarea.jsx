import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn.js";

export const Textarea = forwardRef(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[14px] font-medium text-notion-black mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full border rounded-micro px-3.5 py-2 text-[14px] text-notion-black placeholder:text-warm-gray-300 transition-all focus:outline-none focus:ring-2 resize-y",
            error
              ? "border-warning focus:border-warning focus:ring-warning/20 bg-warning/5"
              : "border-[#ddd] focus:border-brand-primary focus:ring-brand-primary/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-warning text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
