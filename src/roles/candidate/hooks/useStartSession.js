import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { candidateSessionApi } from "@/lib/api/candidateSession.api.js";
import { useExamSessionStore } from "@/stores/examSessionStore.js";

/**
 * Start a new exam session with mandatory face registration.
 * Sends multipart/form-data with face_image file.
 * On success, stores sessionId and navigates to the exam session page.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useStartSession() {
  const setSessionId = useExamSessionStore((s) => s.setSessionId);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (faceImageFile) =>
      candidateSessionApi.startSession(faceImageFile),
    onSuccess: (res) => {
      const session = res.data;
      setSessionId(session.id);
      navigate(`/exam/session/${session.id}`);
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Failed to start exam session.";
      toast.error(message);
    },
  });
}
