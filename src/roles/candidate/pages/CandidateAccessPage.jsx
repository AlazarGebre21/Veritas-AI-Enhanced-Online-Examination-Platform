import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExamSessionStore } from "@/stores/examSessionStore.js";
import { useRedeemCode } from "../hooks/useRedeemCode.js";
import { useStartSession } from "../hooks/useStartSession.js";
import { useResumeSession } from "../hooks/useResumeSession.js";
import TokenEntryForm from "../components/TokenEntryForm.jsx";
import FaceVerificationStep from "../components/FaceVerificationStep.jsx";

/**
 * Candidate access page — entry point for the exam flow.
 *
 * Supports two entry methods:
 * A) Email link: /exam?code=XXXXX → auto-redeems the code
 * B) Manual paste: candidate types the code into TokenEntryForm
 *
 * Flow:
 * 1. Read ?code= from URL (or paste manually) → useRedeemCode mutation
 * 2. Check for active session → useResumeSession
 *    - Active → navigate to /exam/session/:id (resume)
 *    - None → show FaceVerificationStep
 * 3. Capture face → useStartSession mutation (multipart/form-data)
 * 4. Navigate to /exam/session/:id
 */
export default function CandidateAccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawToken = useExamSessionStore((s) => s.rawToken);
  const sessionId = useExamSessionStore((s) => s.sessionId);
  const setSessionId = useExamSessionStore((s) => s.setSessionId);
  const clearSession = useExamSessionStore((s) => s.clearSession);

  // Steps: "token" → "face" → navigating
  const codeFromUrl = searchParams.get("code");
  const [step, setStep] = useState(
    rawToken && !codeFromUrl ? "face" : "token"
  );
  const [tokenError, setTokenError] = useState(null);
  const [autoRedeemed, setAutoRedeemed] = useState(false);

  const redeem = useRedeemCode();
  const startSession = useStartSession();
  const { data: activeSession, isSuccess: resumeChecked } = useResumeSession();

  // Auto-redeem code from URL query param (?code=XXXXX)
  // Clear any stale session first so the new code can be redeemed
  useEffect(() => {
    if (codeFromUrl && !autoRedeemed) {
      setAutoRedeemed(true);
      // Clear stale session data before redeeming new code
      clearSession();
      redeem.mutate(codeFromUrl, {
        onError: (err) => {
          setTokenError(
            err.response?.data?.error || "Invalid or expired invitation code."
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromUrl]);

  // If we already have a sessionId, go straight to the exam
  useEffect(() => {
    if (sessionId) {
      navigate(`/exam/session/${sessionId}`, { replace: true });
    }
  }, [sessionId, navigate]);

  // After redeem, check if there's an active session to resume
  useEffect(() => {
    if (resumeChecked && activeSession?.data) {
      const session = activeSession.data;
      setSessionId(session.id);
      navigate(`/exam/session/${session.id}`, { replace: true });
    }
  }, [resumeChecked, activeSession, setSessionId, navigate]);

  // After redeem succeeds and no active session → show face step
  useEffect(() => {
    if (rawToken && step === "token") {
      setStep("face");
    }
  }, [rawToken, step]);

  function handleTokenSubmit(code) {
    setTokenError(null);
    redeem.mutate(code, {
      onError: (err) => {
        setTokenError(
          err.response?.data?.error || "Invalid or expired invitation code."
        );
      },
    });
  }

  function handleFaceCapture(faceBlob) {
    startSession.mutate(faceBlob);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
      <div className="bg-white rounded-comfortable shadow-card p-8 w-full max-w-md border border-whisper">
        {step === "token" && !codeFromUrl && (
          <TokenEntryForm
            onSubmit={handleTokenSubmit}
            isLoading={redeem.isPending}
            error={tokenError}
          />
        )}
        
        {step === "token" && codeFromUrl && (
          <div className="relative w-full flex flex-col items-center justify-center py-12">
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.04]">
              <img src="/logo.png" alt="Veritas" className="w-[120px] object-contain mb-2" />
              <span className="text-[40px] font-black tracking-widest text-notion-black">VERITAS</span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <Loader2 size={32} className="animate-spin text-notion-blue" />
              <p className="text-[15px] font-medium text-notion-black">Verifying invitation code...</p>
              {tokenError && <p className="text-[13px] text-destructive px-4 py-2 bg-destructive/10 rounded-subtle">{tokenError}</p>}
            </div>
          </div>
        )}

        {step === "face" && (
          <FaceVerificationStep
            onCapture={handleFaceCapture}
            isLoading={startSession.isPending}
          />
        )}
      </div>
    </div>
  );
}
