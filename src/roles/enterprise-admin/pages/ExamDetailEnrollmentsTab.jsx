import { useState } from "react";
import { Copy, Check, RefreshCw, RotateCcw, Ban, Search } from "lucide-react";
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
  const [tokenDisplay, setTokenDisplay] = useState(null); // { enrollmentId, token }
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useExamEnrollments(examId);
  const enrollments = data?.data || [];

  const { data: candData } = useCandidates({ limit: 100, search });
  const candidates = candData?.data || [];

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
      { onSuccess: () => { setSelected([]); setEnrollOpen(false); } }
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
      <div className="flex items-center justify-between">
        <p className="text-[14px] text-warm-gray-500">{enrollments.length} enrolled candidate{enrollments.length !== 1 ? "s" : ""}</p>
        <Button onClick={() => setEnrollOpen(true)}>
          <Search size={14} className="mr-1.5" /> Enroll Candidates
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : enrollments.length === 0 ? (
        <p className="text-center text-[13px] text-warm-gray-500 py-10 border border-dashed border-whisper rounded-comfortable">
          No candidates enrolled. Click "Enroll Candidates" to get started.
        </p>
      ) : (
        <div className="border border-whisper rounded-comfortable overflow-hidden divide-y divide-whisper">
          {enrollments.map((e) => (
            <div key={e.id} className="flex items-center justify-between px-4 py-3 hover:bg-warm-white/50 transition-colors">
              <div>
                <p className="text-[14px] font-medium text-notion-black">
                  {e.candidate?.firstName} {e.candidate?.lastName}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-warm-gray-500">
                  <span>Attempts: {e.attemptsUsed}/{e.maxAttempts}</span>
                  <span>Expires: {formatDate(e.tokenExpiresAt)}</span>
                  <Badge variant={e.isRevoked ? "neutral" : "success"}>
                    {e.isRevoked ? "Revoked" : "Active"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-3">
                <button onClick={() => handleRegenerate(e.id)} title="Regenerate token"
                  className="p-1.5 text-warm-gray-300 hover:text-notion-blue transition-colors rounded-micro hover:bg-warm-white">
                  <RefreshCw size={13} />
                </button>
                <button onClick={() => resetAttempts.mutate(e.id)} title="Reset attempts"
                  className="p-1.5 text-warm-gray-300 hover:text-notion-blue transition-colors rounded-micro hover:bg-warm-white">
                  <RotateCcw size={13} />
                </button>
                {!e.isRevoked && (
                  <button onClick={() => revoke.mutate(e.id)} title="Revoke access"
                    className="p-1.5 text-warm-gray-300 hover:text-destructive transition-colors rounded-micro hover:bg-warm-white">
                    <Ban size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enroll Modal */}
      <Modal isOpen={enrollOpen} onClose={() => setEnrollOpen(false)} title="Enroll Candidates">
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#ddd] rounded-micro focus:outline-none focus:border-notion-blue focus:ring-2 focus:ring-notion-blue/20" />
          </div>
          <div className="max-h-56 overflow-y-auto space-y-1 border border-whisper rounded-micro p-2">
            {candidates.map((c) => {
              const alreadyEnrolled = enrollments.some((e) => e.candidateId === c.id);
              const isSel = selected.includes(c.id);
              return (
                <label key={c.id} className={`flex items-center gap-2 p-2 rounded-micro cursor-pointer transition-colors ${isSel ? "bg-notion-blue/5" : "hover:bg-warm-white"} ${alreadyEnrolled ? "opacity-40 cursor-not-allowed" : ""}`}>
                  <input type="checkbox" disabled={alreadyEnrolled} checked={isSel}
                    onChange={() => setSelected((prev) => isSel ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                    className="w-3.5 h-3.5" />
                  <span className="text-[13px] text-notion-black">{c.firstName} {c.lastName}</span>
                  {alreadyEnrolled && <Badge variant="success">Enrolled</Badge>}
                </label>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEnrollOpen(false)}>Cancel</Button>
            <Button onClick={handleEnroll} disabled={!selected.length || enroll.isPending}>
              {enroll.isPending ? "Enrolling..." : `Enroll ${selected.length || ""}`.trim()}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Token Modal */}
      <Modal isOpen={!!tokenDisplay} onClose={() => setTokenDisplay(null)} title="Access Token">
        <div className="space-y-4">
          <p className="text-[14px] text-warm-gray-500">Share this token securely — it will not be shown again.</p>
          <div className="flex items-center gap-2 bg-warm-white border border-whisper rounded-micro px-4 py-3">
            <code className="flex-1 text-[14px] font-mono text-notion-black select-all break-all">
              {tokenDisplay?.token}
            </code>
            <button onClick={handleCopy} className="p-1.5 text-warm-gray-500 hover:text-notion-black transition-colors shrink-0">
              {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
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
