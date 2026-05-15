/**
 * @fileoverview Candidate role module barrel export.
 */

// Pages
export { default as CandidateAccessPage } from "./pages/CandidateAccessPage.jsx";
export { default as ExamSessionPage } from "./pages/ExamSessionPage.jsx";
export { default as CandidateResultsPage } from "./pages/CandidateResultsPage.jsx";

// Hooks
export { useRedeemCode } from "./hooks/useRedeemCode.js";
export { useStartSession } from "./hooks/useStartSession.js";
export { useResumeSession } from "./hooks/useResumeSession.js";
export { useSessionQuestions } from "./hooks/useSessionQuestions.js";
export { useSaveAnswer } from "./hooks/useSaveAnswer.js";
export { useSubmitExam } from "./hooks/useSubmitExam.js";
export { useCandidateResult } from "./hooks/useCandidateResult.js";
export { useAnswerQueue } from "./hooks/useAnswerQueue.js";
