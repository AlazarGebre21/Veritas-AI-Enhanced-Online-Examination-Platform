import { useState, useEffect, useCallback, useRef } from "react";
import { openDB } from "idb";

const DB_NAME = "veritas-exam";
const STORE_NAME = "pendingAnswers";
const DB_VERSION = 1;

/**
 * Open (or create) the IndexedDB database for offline answer queuing.
 * @returns {Promise<import('idb').IDBPDatabase>}
 */
async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
}

/**
 * IndexedDB-backed offline answer queue.
 *
 * When online: saves directly via the provided saveAnswer function.
 * When offline: queues answers to IndexedDB.
 * On reconnection: automatically flushes the queue in order.
 *
 * @param {(payload: object) => Promise<any>} saveAnswerFn - The mutation function to save an answer
 * @returns {{ queueAnswer: (payload: object) => Promise<void>, pendingCount: number, isOnline: boolean, flushQueue: () => Promise<void> }}
 */
export function useAnswerQueue(saveAnswerFn) {
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const flushingRef = useRef(false);
  const saveRef = useRef(saveAnswerFn);
  saveRef.current = saveAnswerFn;

  // Track online/offline status
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Count pending items on mount
  useEffect(() => {
    (async () => {
      try {
        const db = await getDb();
        const count = await db.count(STORE_NAME);
        setPendingCount(count);
      } catch {
        // IndexedDB unavailable — fallback silently
      }
    })();
  }, []);

  // Flush queue when coming back online
  useEffect(() => {
    if (isOnline) {
      flushQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  /**
   * Flush all pending answers from IndexedDB to the server.
   */
  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return;
    flushingRef.current = true;

    try {
      const db = await getDb();
      const allItems = await db.getAll(STORE_NAME);

      for (const item of allItems) {
        try {
          await saveRef.current(item.payload);
          await db.delete(STORE_NAME, item.id);
          setPendingCount((c) => Math.max(0, c - 1));
        } catch {
          // If a save fails, stop flushing — will retry on next online event
          break;
        }
      }
    } catch {
      // IndexedDB error — silent
    } finally {
      flushingRef.current = false;
    }
  }, []);

  /**
   * Queue an answer — saves directly if online, otherwise queues to IndexedDB.
   * @param {object} payload - The answer payload ({ sessionQuestionId, answerData })
   */
  const queueAnswer = useCallback(
    async (payload) => {
      if (isOnline) {
        try {
          await saveRef.current(payload);
          return;
        } catch {
          // If online save fails, fall through to queue
        }
      }

      // Queue to IndexedDB
      try {
        const db = await getDb();
        await db.add(STORE_NAME, {
          payload,
          timestamp: Date.now(),
        });
        setPendingCount((c) => c + 1);
      } catch {
        // Last resort — log to console
        console.error("Failed to queue answer to IndexedDB", payload);
      }
    },
    [isOnline]
  );

  return { queueAnswer, pendingCount, isOnline, flushQueue };
}
