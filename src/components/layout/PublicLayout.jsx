import { Outlet } from "react-router-dom";

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

      {/* Right side: Branding area */}
      <div className="hidden lg:flex lg:w-1/2 bg-warm-white relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="relative z-20 flex flex-col items-center text-center -mt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/logo.png" alt="Veritas Logo" className="w-[72px] h-[72px] object-contain" />
            <span className="text-[24px] font-bold text-notion-black tracking-tight" style={{ marginBottom: "-4px" }}>Veritas</span>
          </div>
          <h2 className="text-[9px] text-warm-gray-500 italic max-w-md font-medium leading-[1.3]">
            AI-Enhanced Assessment Platform for Enterprises
          </h2>
        </div>

        {/* Orbit animation container */}
        <div className="relative mt-24 mb-10 w-[420px] h-[420px] rounded-full border-2 border-warm-gray-300/20 border-dashed animate-orbit z-10">
          {[
            { text: "Secure", bg: "bg-[#FFFCE8]", textCol: "text-[#D97706]", border: "border-[#FDE68A]" },
            { text: "Automatic Scaling", bg: "bg-[#FFF1F2]", textCol: "text-[#E11D48]", border: "border-[#FECDD3]" },
            { text: "Intuitive", bg: "bg-[#ECFEFF]", textCol: "text-[#0891B2]", border: "border-[#A5F3FC]" },
            { text: "Proctoring", bg: "bg-[#FAF5FF]", textCol: "text-[#9333EA]", border: "border-[#E9D5FF]" },
            { text: "Role Based", bg: "bg-[#F0FDF4]", textCol: "text-[#16A34A]", border: "border-[#BBF7D0]" },
            { text: "Audit Logs", bg: "bg-[#FFF7ED]", textCol: "text-[#EA580C]", border: "border-[#FED7AA]" },
          ].map((char, i, arr) => {
             const angle = (i * 360) / arr.length;
             const radius = 210;
             const x = radius * Math.cos((angle * Math.PI) / 180);
             const y = radius * Math.sin((angle * Math.PI) / 180);
             return (
               <div 
                 key={char.text}
                 className="absolute left-1/2 top-1/2"
                 style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
               >
                 <div className={`flex items-center justify-center px-4 py-1.5 rounded-full text-[14px] font-bold whitespace-nowrap shadow-sm border ${char.bg} ${char.textCol} ${char.border} backdrop-blur-md animate-orbit-reverse`}>
                    {char.text}
                 </div>
               </div>
             );
          })}
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-badge-bg rounded-full blur-[100px] opacity-80 pointer-events-none" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-notion-blue/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="absolute bottom-8 z-10 text-warm-gray-300 text-sm font-medium">
          &copy; {new Date().getFullYear()} Veritas Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
