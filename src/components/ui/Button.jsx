import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn.js";

/**
 * @typedef {Object} ButtonProps
 * @property {'primary' | 'secondary' | 'ghost' | 'danger'} [variant='primary']
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {boolean} [isLoading]
 * @property {React.ReactNode} [leftIcon]
 * @property {React.ReactNode} [rightIcon]
 */

export const Button = forwardRef(
  /** 
   * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props 
   */
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all rounded-micro disabled:opacity-60 disabled:cursor-not-allowed",
          // Variants
          variant === "primary" && "bg-notion-blue text-white hover:bg-active-blue active:scale-[0.98]",
          variant === "secondary" && "bg-warm-white text-notion-black hover:bg-[#e4e2e0] active:scale-[0.98]",
          variant === "ghost" && "bg-transparent text-warm-gray-500 hover:text-notion-black hover:bg-warm-white",
          variant === "danger" && "bg-transparent text-warning hover:bg-warning/10",
          // Sizes
          size === "sm" && "text-[13px] px-3 py-1.5",
          size === "md" && "text-[14px] px-4 py-2",
          size === "lg" && "text-[15px] px-5 py-2.5",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";
