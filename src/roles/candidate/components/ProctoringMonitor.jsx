import { useState, useEffect, useRef } from "react";
import { Shield, ShieldAlert, Maximize, X } from "lucide-react";

/**
 * Proctoring overlay displayed during the exam.
 * Shows webcam thumbnail, violation count, and warning banners.
 *
 * @param {{
 *   webcamStream: MediaStream|null,
 *   violationCount: number,
 *   lastResult: object|null,
 *   isFullscreen: boolean,
 *   onRequestFullscreen: () => void,
 * }} props
 */
export default function ProctoringMonitor({
  webcamStream,
  violationCount,
  lastResult,
  isFullscreen,
  onRequestFullscreen,
}) {
  const videoRef = useRef(null);
  const [warning, setWarning] = useState(null);
  const warningTimer = useRef(null);

  // Attach webcam stream to video element
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  // Show warnings based on face verification results
  useEffect(() => {
    if (!lastResult) return;
    let msg = null;

    if (lastResult.face_count === 0) {
      msg = "Face not detected — please face the camera";
    } else if (lastResult.face_count > 1) {
      msg = "Multiple faces detected";
    } else if (!lastResult.is_match) {
      msg = "Identity mismatch detected";
    }

    if (msg) {
      setWarning(msg);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      warningTimer.current = setTimeout(() => setWarning(null), 4000);
    }
  }, [lastResult]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, []);

  return (
    <div className="fixed top-16 right-4 z-40 flex flex-col items-end gap-2">
      {/* Webcam thumbnail */}
      <div className="relative">
        <div className="w-24 h-18 rounded-standard overflow-hidden border-2 border-whisper shadow-card bg-warm-dark">
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

        {/* Violation badge */}
        {violationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center px-1 text-[10px] font-bold text-white bg-destructive rounded-full">
            {violationCount}
          </span>
        )}
      </div>

      {/* Proctoring status indicator */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${
        violationCount === 0
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive"
      }`}>
        {violationCount === 0 ? (
          <><Shield size={10} /> Proctoring Active</>
        ) : (
          <><ShieldAlert size={10} /> {violationCount} violation{violationCount !== 1 ? "s" : ""}</>
        )}
      </div>

      {/* Fullscreen prompt */}
      {!isFullscreen && (
        <button
          type="button"
          onClick={onRequestFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-warning rounded-subtle hover:bg-warning/90 transition-colors"
        >
          <Maximize size={12} /> Return to Fullscreen
        </button>
      )}

      {/* Warning banner */}
      {warning && (
        <div className="flex items-center gap-2 px-3 py-2 bg-destructive text-white rounded-subtle text-[12px] font-medium shadow-deep max-w-[220px] animate-slide-in">
          <ShieldAlert size={14} className="flex-shrink-0" />
          <span className="flex-1">{warning}</span>
          <button type="button" onClick={() => setWarning(null)} className="flex-shrink-0 hover:opacity-70">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
