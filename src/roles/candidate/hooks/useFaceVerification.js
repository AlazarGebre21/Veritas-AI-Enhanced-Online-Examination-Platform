import { useState, useEffect, useRef, useCallback } from "react";
import { candidateProctoringApi } from "@/lib/api/proctoring.api.js";

const VERIFY_INTERVAL = 30_000; // 30 seconds

/**
 * Periodic webcam face verification during the exam.
 * Captures a frame every 30s, converts to base64 JPEG,
 * and sends to POST /face/verify.
 *
 * @param {string} sessionId
 * @returns {{ lastResult: object|null, isVerifying: boolean, webcamStream: MediaStream|null, startVerification: () => void, stopVerification: () => void }}
 */
export function useFaceVerification(sessionId) {
  const [webcamStream, setWebcamStream] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  // Create hidden video + canvas elements
  useEffect(() => {
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.display = "none";
    document.body.appendChild(video);
    videoRef.current = video;

    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    return () => {
      video.remove();
      canvas.remove();
    };
  }, []);

  const startVerification = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
        audio: false,
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start periodic capture
      intervalRef.current = setInterval(() => captureAndVerify(), VERIFY_INTERVAL);
      // Do an initial capture after a short delay
      setTimeout(() => captureAndVerify(), 3000);
    } catch {
      // Camera unavailable — proctoring continues without face verification
    }
  }, []);

  const stopVerification = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (webcamStream) {
      webcamStream.getTracks().forEach((t) => t.stop());
      setWebcamStream(null);
    }
  }, [webcamStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (webcamStream) webcamStream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function captureAndVerify() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const sid = sessionIdRef.current;
    if (!video || !canvas || !sid || !video.srcObject) return;

    setIsVerifying(true);
    try {
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      // Convert to base64 JPEG (strip the data URL prefix)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      const imageB64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");

      const result = await candidateProctoringApi.verifyFace(sid, imageB64);
      setLastResult(result);
    } catch {
      // Silent — verification failure is non-blocking
    } finally {
      setIsVerifying(false);
    }
  }

  return {
    lastResult,
    isVerifying,
    webcamStream,
    startVerification,
    stopVerification,
  };
}
