import { Modal } from "@/components/ui/index.js";
import { AlertTriangle, Loader2 } from "lucide-react";

/**
 * Confirmation modal before exam submission.
 * Shows summary of answered/unanswered/flagged questions.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   summary: { total: number, answered: number, unanswered: number, flagged: number },
 *   isSubmitting: boolean,
 * }} props
 */
export default function SubmissionConfirmModal({ isOpen, onClose, onConfirm, summary, isSubmitting }) {
  const { total = 0, answered = 0, unanswered = 0, flagged = 0 } = summary || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Exam">
      <div className="space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="Total Questions" value={total} />
          <SummaryCard label="Answered" value={answered} color="text-success" />
          <SummaryCard label="Unanswered" value={unanswered} color={unanswered > 0 ? "text-destructive" : "text-warm-gray-500"} />
          <SummaryCard label="Flagged" value={flagged} color={flagged > 0 ? "text-warning" : "text-warm-gray-500"} />
        </div>

        {/* Warning */}
        {unanswered > 0 && (
          <div className="flex items-start gap-2.5 p-3 bg-warning/5 border border-warning/20 rounded-subtle">
            <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-notion-black">
              You have <strong>{unanswered} unanswered</strong> question{unanswered > 1 ? "s" : ""}.
              Once submitted, you cannot change your answers.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-[14px] font-medium text-notion-black border border-whisper rounded-subtle hover:bg-warm-white transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-[14px] font-medium text-white bg-notion-blue rounded-subtle hover:bg-active-blue transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Exam"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function SummaryCard({ label, value, color = "text-notion-black" }) {
  return (
    <div className="bg-warm-white rounded-subtle px-3 py-2.5 border border-whisper">
      <p className="text-[11px] text-warm-gray-500 mb-0.5">{label}</p>
      <p className={`text-[20px] font-bold ${color}`}>{value}</p>
    </div>
  );
}
