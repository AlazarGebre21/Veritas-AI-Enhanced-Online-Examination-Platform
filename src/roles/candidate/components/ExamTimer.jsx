import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Countdown timer driven by server-enforced expiresAt timestamp.
 * Changes color as time runs low:
 *  - Normal: notion-black
 *  - Warning (<5 min): orange
 *  - Critical (<1 min): red, pulsing
 *
 * @param {{ expiresAt: string, onExpire: () => void }} props
 */
export default function ExamTimer({ expiresAt, onExpire }) {
  const [remaining, setRemaining] = useState(() => calcRemaining(expiresAt));
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const left = calcRemaining(expiresAt);
      setRemaining(left);

      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const isWarning = remaining <= 300 && remaining > 60;
  const isCritical = remaining <= 60;

  const display =
    hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  let colorClass = "text-notion-black";
  if (isCritical) colorClass = "text-destructive";
  else if (isWarning) colorClass = "text-warning";

  return (
    <div
      className={`
        font-mono text-[18px] font-bold tabular-nums
        ${colorClass}
        ${isCritical ? "animate-pulse" : ""}
      `}
      role="timer"
      aria-label={`Time remaining: ${display}`}
    >
      {display}
    </div>
  );
}

function calcRemaining(expiresAt) {
  const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  return Math.max(0, diff);
}

function pad(n) {
  return String(n).padStart(2, "0");
}
