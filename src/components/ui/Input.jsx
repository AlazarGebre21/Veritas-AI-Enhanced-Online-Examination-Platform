import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils/cn.js";
import { Eye, EyeOff } from "lucide-react";

/**
 * @typedef {Object} InputProps
 * @property {string} [label]
 * @property {string} [error]
 * @property {string} [type]
 */

export const Input = forwardRef(
  /**
   * @param {InputProps & React.InputHTMLAttributes<HTMLInputElement>} props
   */
  ({ className, label, error, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    
    // Toggle between text and password type if it's a password field
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-[14px] font-medium text-notion-black mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              "w-full border rounded-micro px-3.5 py-2 text-[14px] text-notion-black placeholder:text-warm-gray-300 transition-all focus:outline-none focus:ring-2",
              error 
                ? "border-warning focus:border-warning focus:ring-warning/20 bg-warning/5"
                : "border-[#ddd] focus:border-notion-blue focus:ring-notion-blue/20",
              isPassword && "pr-10", // extra padding for the absolute icon
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-300 hover:text-warm-gray-500 transition-colors focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-warning text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
