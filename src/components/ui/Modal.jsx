import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn.js";

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-notion-black/40 backdrop-blur-sm transition-opacity">
      <div 
        className={cn(
          "bg-white rounded-comfortable shadow-deep w-full max-w-lg overflow-hidden flex flex-col",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-whisper">
          <h2 className="text-lg font-semibold text-notion-black">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-micro text-warm-gray-500 hover:text-notion-black hover:bg-warm-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
