import { useState, useMemo } from "react";
import { Copy, Check, RefreshCw, RotateCcw, Ban, Search, Loader2 } from "lucide-react";
import {
  useExamEnrollments, useEnrollCandidates,
  useRegenerateToken, useResetAttempts, useRevokeEnrollment,
} from "../hooks/useExams.js";
import { useCandidates } from "../hooks/useCandidates.js";
import { Badge, Button, Skeleton } from "@/components/ui/index.js";
import { Modal } from "@/components/ui/index.js";
import { formatDate } from "@/lib/utils/date.js";

export function ExamEnrollmentsTab({ examId }) {
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [tokenDisplay, setTokenDisplay] = useState(null);
  const [copied, setCopied] = useState(false);

  // Enrolled list
  const { data, isLoading } = useExamEnrollments(examId);
  const enrollments = data?.data || [];

  // Fetch ALL candidates once — client-side search filtering (no server-side search param)
  const { data: candData, isLoading: candLoading } = useCandidates({ limit: 1000 });
  const allCandidates = candData?.data || [];

  // Client-side filter
  const filteredCandidates = useMemo(() => {
    if (!search.trim()) return allCandidates;
    const q = search.toLowerCase();
    return allCandidates.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [allCandidates, search]);

  const enroll = useEnrollCandidates(examId);
  const regenerate = useRegenerateToken();
  const resetAttempts = useResetAttempts();
  const revoke = useRevokeEnrollment(examId);

  function handleEnroll() {
    enroll.mutate(
      {
        candidateIds: selected,
        maxAttempts: 1,
        tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        onSuccess: () => {
          setSelected([]);
          setEnrollOpen(false);
        },
      }
    );
  }

  function handleRegenerate(id) {
    regenerate.mutate(id, {
      onSuccess: (res) => setTokenDisplay({ enrollmentId: id, token: res.rawToken }),
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(tokenDisplay?.token || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-warm-gray-500">
          {enrollments.length} enrolled candidate{enrollments.length !== 1 ? "s" : ""}
        </p>
        <Button onClick={() => setEnrollOpen(true)}>
          + Enroll Candidates
        </Button>
      </div>

      {/* Enrolled list */}
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : enrollments.length === 0 ? (
        <p className="text-center text-[13px] text-warm-gray-500 py-10 border border-dashed border-whisper rounded-comfortable">
          No candidates enrolled. Click &quot;Enroll Candidates&quot; to get started.
        </p>
      ) : (
        <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
          {enrollments.map((e) => {
            const candidate = allCandidates.find((c) => c.id === e.candidateId);
            return (
              <div key={e.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-warm-white/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-notion-black">
                    {candidate
                      ? `${candidate.firstName} ${candidate.lastName}`
                      : e.candidateId}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                    <span>Attempts: {e.attemptsUsed ?? 0}/{e.maxAttempts}</span>
                    {e.tokenExpiresAt && <span>Expires: {formatDate(e.tokenExpiresAt)}</span>}
                    <Badge variant={e.isRevoked ? "neutral" : "success"}>
                      {e.isRevoked ? "Revoked" : "Active"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                  <button
                    onClick={() => handleRegenerate(e.id)}
                    title="Regenerate access token"
                    className="p-2 rounded-micro text-warm-gray-400 hover:text-notion-blue hover:bg-notion-blue/5 transition-colors"
                  >
                    <RefreshCw size={17} />
                  </button>
                  <button
                    onClick={() => resetAttempts.mutate(e.id)}
                    title="Reset attempts to zero"
                    className="p-2 rounded-micro text-warm-gray-400 hover:text-notion-blue hover:bg-notion-blue/5 transition-colors"
                  >
                    <RotateCcw size={17} />
                  </button>
                  {!e.isRevoked && (
                    <button
                      onClick={() => revoke.mutate(e.id)}
                      title="Revoke access"
                      className="p-2 rounded-micro text-warm-gray-400 hover:text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <Ban size={17} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Enroll Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={enrollOpen} onClose={() => { setEnrollOpen(false); setSelected([]); setSearch(""); }} title="Enroll Candidates">
        <div className="space-y-3">
          {/* Search — client-side */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or email..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
            {candLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-warm-gray-300" size={20} /></div>
            ) : filteredCandidates.length === 0 ? (
              <p className="text-center text-[13px] text-warm-gray-500 py-4">No candidates match your search.</p>
            ) : (
              filteredCandidates.map((c) => {
                const alreadyEnrolled = enrollments.some((e) => e.candidateId === c.id);
                const isSel = selected.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-micro transition-colors ${
                      isSel ? "bg-notion-blue/5" : "hover:bg-warm-white"
                    } ${alreadyEnrolled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      disabled={alreadyEnrolled}
                      checked={isSel}
                      onChange={() =>
                        setSelected((prev) =>
                          isSel ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                        )
                      }
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-notion-black">
                        {c.firstName} {c.lastName}
                      </p>
                      {c.email && <p className="text-[11px] text-warm-gray-500 truncate">{c.email}</p>}
                    </div>
                    {alreadyEnrolled && <Badge variant="success">Enrolled</Badge>}
                  </label>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[12px] text-warm-gray-500">{selected.length} selected</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => { setEnrollOpen(false); setSelected([]); }}>
                Cancel
              </Button>
              <Button onClick={handleEnroll} disabled={!selected.length || enroll.isPending}>
                {enroll.isPending ? "Enrolling..." : `Enroll ${selected.length || ""}`.trim()}
              </Button>
            </div>
          </div>

          {enroll.isError && (
            <p className="text-[12px] text-destructive">
              {enroll.error?.response?.data?.error || "Failed to enroll candidates."}
            </p>
          )}
        </div>
      </Modal>

      {/* ── Token Modal ───────────────────────────────────────────────── */}
      <Modal isOpen={!!tokenDisplay} onClose={() => setTokenDisplay(null)} title="New Access Token">
        <div className="space-y-4">
          <p className="text-[14px] text-warm-gray-500">
            Share this token securely with the candidate. It will <strong>not</strong> be shown again.
          </p>
          <div className="flex items-center gap-2 bg-warm-white border border-whisper rounded-micro px-4 py-3">
            <code className="flex-1 text-[13px] font-mono text-notion-black select-all break-all">
              {tokenDisplay?.token}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 text-warm-gray-500 hover:text-notion-black transition-colors shrink-0"
            >
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setTokenDisplay(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
