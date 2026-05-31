import { Outlet } from "react-router-dom";

/**
 * Layout for public pages (login, register).
 * Split screen: Form on the left, branding on the right.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-warm-white flex lg:flex-row-reverse">
      {/* Form Outlet (visually on the right on large screens) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-white lg:shadow-[-20px_0_40px_rgba(0,0,0,0.03)] lg:border-l border-whisper">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>

      {/* Branding area (visually on the left on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-warm-white relative overflow-hidden flex-col items-center justify-center p-12 h-screen max-h-screen">
        
        {/* Central Overlay Container for Logo and Orbit to prevent vertical overflow */}
        <div className="relative flex items-center justify-center w-[500px] h-[500px]">
          
          {/* Orbit animation container - behind logo */}
          <div style={{ perspective: "1000px" }} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div style={{ transform: "rotateX(60deg)", transformStyle: "preserve-3d" }} className="w-[420px] h-[420px] relative">
              <div className="absolute inset-0 rounded-full border-2 border-warm-gray-300/20 border-dashed animate-orbit" style={{ transformStyle: "preserve-3d" }}>
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
                       style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`, transformStyle: "preserve-3d" }}
                     >
                       <div className="animate-orbit-reverse w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                          <div 
                            className={`flex items-center justify-center px-4 py-1.5 rounded-full text-[14px] font-bold whitespace-nowrap shadow-sm border ${char.bg} ${char.textCol} ${char.border} backdrop-blur-md`}
                            style={{ transform: "rotateX(-60deg)" }}
                          >
                            {char.text}
                          </div>
                       </div>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>

          {/* Logo and Titles on top */}
          <div className="relative z-20 w-[400px] h-[400px]">
            <img src="/logo.png" alt="Veritas Logo" className="w-full h-full object-contain pointer-events-none" />
            
            {/* "Veritas" Text at the top */}
            <span className="absolute -top-16 left-[48%] -translate-x-1/2 text-[64px] font-normal text-notion-black drop-shadow-md">
              Veritas
            </span>
            
            {/* Motto below image, slightly offset downwards */}
            <h2 className="absolute -bottom-6 w-full text-center text-[10px] text-warm-gray-500 italic max-w-md font-medium leading-[1.3] left-1/2 -translate-x-1/2">
              AI-Enhanced Assessment Platform for Enterprises
            </h2>
          </div>
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
