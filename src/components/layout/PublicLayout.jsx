import { Outlet } from "react-router-dom";
import { BookOpenCheck } from "lucide-react";

/**
 * Layout for public pages (login, register).
 * Split screen: Form on the left, branding on the right.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-warm-white flex">
      {/* Left side: Form Outlet */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-white lg:shadow-[20px_0_40px_rgba(0,0,0,0.03)] border-r border-whisper">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>

      {/* Right side: Branding area (hidden on mg/sm) */}
      <div className="hidden lg:flex lg:w-1/2 bg-warm-white relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-md bg-notion-blue flex items-center justify-center font-bold shrink-0 shadow-sm">
              <BookOpenCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-notion-black text-[22px] tracking-tight">Veritas</span>
          </div>
          
          <h2 className="text-[36px] xl:text-[44px] font-bold leading-[1.15] text-notion-black">
            AI-Enhanced Enterprise <br /> Assessment Platform
          </h2>
          
          <p className="text-warm-gray-500 mt-2 text-lg max-w-md leading-relaxed">
            Secure, scalable, and intuitive online examinations with advanced proctoring capabilities.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-badge-bg rounded-full blur-[100px] opacity-80 pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-notion-blue/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 text-warm-gray-300 text-sm font-medium">
          &copy; {new Date().getFullYear()} Veritas Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
