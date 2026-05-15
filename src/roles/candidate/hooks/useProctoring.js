import { useEffect, useRef, useCallback, useState } from "react";
import { candidateProctoringApi } from "@/lib/api/proctoring.api.js";

const MOUSE_INACTIVE_THRESHOLD = 30_000; // 30 seconds

/**
 * Client-side behavioral proctoring monitor.
 * Detects tab switches, fullscreen exits, mouse inactivity, and copy/paste
 * attempts, then reports each event to POST /proctoring/events.
 *
 * @param {string} sessionId
 * @returns {{ violationCount: number, violations: Array, isFullscreen: boolean, requestFullscreen: () => void }}
 */
export function useProctoring(sessionId) {
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const mouseTimerRef = useRef(null);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const reportEvent = useCallback(
    async (eventType, metadata = {}) => {
      const id = sessionIdRef.current;
      if (!id) return;

      const violation = { eventType, timestamp: new Date().toISOString(), metadata };
      setViolations((prev) => [...prev, violation]);

      try {
        await candidateProctoringApi.ingestEvent(id, eventType, metadata);
      } catch {
        // Silent — event is logged locally even if POST fails
      }
    },
    []
  );

  // Tab visibility
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        reportEvent("tab_switch");
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [reportEvent]);

  // Fullscreen
  useEffect(() => {
    function handleFullscreen() {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) {
        reportEvent("fullscreen_exit");
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, [reportEvent]);

  // Mouse inactivity
  useEffect(() => {
    function resetMouseTimer() {
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      mouseTimerRef.current = setTimeout(() => {
        reportEvent("mouse_inactive", { duration_ms: MOUSE_INACTIVE_THRESHOLD });
      }, MOUSE_INACTIVE_THRESHOLD);
    }

    resetMouseTimer();
    document.addEventListener("mousemove", resetMouseTimer);
    document.addEventListener("keydown", resetMouseTimer);

    return () => {
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      document.removeEventListener("mousemove", resetMouseTimer);
      document.removeEventListener("keydown", resetMouseTimer);
    };
  }, [reportEvent]);

  // Copy/paste
  useEffect(() => {
    function handleCopyPaste(e) {
      reportEvent("copy_paste_attempt", { action: e.type });
    }
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
    };
  }, [reportEvent]);

  const requestFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  return {
    violationCount: violations.length,
    violations,
    isFullscreen,
    requestFullscreen,
  };
}
