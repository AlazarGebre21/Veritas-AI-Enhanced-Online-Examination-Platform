import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExamSessionStore } from "@/stores/examSessionStore.js";
import { useRedeemCode } from "../hooks/useRedeemCode.js";
import { useStartSession } from "../hooks/useStartSession.js";
import { useResumeSession } from "../hooks/useResumeSession.js";
import TokenEntryForm from "../components/TokenEntryForm.jsx";
import FaceVerificationStep from "../components/FaceVerificationStep.jsx";

/**
 * Candidate access page — entry point for the exam flow.
 *
 * Flow:
 * 1. Paste opaque code → TokenEntryForm
 * 2. Redeem code → useRedeemCode mutation
 * 3. Check for active session → useResumeSession
 *    - Active → navigate to /exam/session/:id (resume)
 *    - None → show FaceVerificationStep
 * 4. Capture face → useStartSession mutation (multipart/form-data)
 * 5. Navigate to /exam/session/:id
 */
export default function CandidateAccessPage() {
  const navigate = useNavigate();
  const rawToken = useExamSessionStore((s) => s.rawToken);
  const sessionId = useExamSessionStore((s) => s.sessionId);
  const setSessionId = useExamSessionStore((s) => s.setSessionId);

  // Steps: "token" → "face" → navigating
  const [step, setStep] = useState(rawToken ? "face" : "token");
  const [tokenError, setTokenError] = useState(null);

  const redeem = useRedeemCode();
  const startSession = useStartSession();
  const { data: activeSession, isSuccess: resumeChecked } = useResumeSession();

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
        {step === "token" && (
          <TokenEntryForm
            onSubmit={handleTokenSubmit}
            isLoading={redeem.isPending}
            error={tokenError}
          />
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
