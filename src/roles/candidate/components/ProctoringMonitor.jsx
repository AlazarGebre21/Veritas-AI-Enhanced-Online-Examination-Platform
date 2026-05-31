import { useEffect, useRef } from "react";
import { Shield, Maximize } from "lucide-react";

/**
 * Proctoring overlay displayed during the exam.
 * Shows webcam thumbnail, violation count, and warning banners.
 *
 * @param {{
 *   webcamStream: MediaStream|null,
 *   isFullscreen: boolean,
 *   onRequestFullscreen: () => void,
 * }} props
 */
export default function ProctoringMonitor({
  webcamStream,
  isFullscreen,
  onRequestFullscreen,
}) {
  const videoRef = useRef(null);

  // Attach webcam stream to video element
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  return (
    <div className="flex items-center gap-3 relative z-40">
      {/* Webcam thumbnail */}
      <div className="relative">
        <div className="w-[84px] h-[58px] rounded-standard overflow-hidden border border-gray-100 shadow-sm bg-warm-dark">
          {webcamStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield size={16} className="text-warm-gray-300" />
            </div>
          )}
        </div>

      </div>

      {/* Proctoring status indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-success/10 text-success">
        <Shield size={10} /> AI-Powered Live Proctoring
      </div>

      {/* Fullscreen prompt */}
      {!isFullscreen && (
        <button
          type="button"
          onClick={onRequestFullscreen}
          className="absolute top-full right-0 mt-2.5 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-warning rounded-subtle hover:bg-warning/90 transition-colors shadow-md z-50 animate-slide-in"
        >
          <Maximize size={12} /> Return to Fullscreen
        </button>
      )}

    </div>
  );
}
