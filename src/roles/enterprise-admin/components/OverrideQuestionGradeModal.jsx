import { useState } from "react";
import { Modal, Button, Input, Textarea } from "@/components/ui/index.js";
import { useOverrideQuestionGrade } from "../hooks/useGrading.js";

export default function OverrideQuestionGradeModal({ isOpen, onClose, sessionId, question, currentScore }) {
  const [newScore, setNewScore] = useState(currentScore?.toString() || "");
  const [reason, setReason] = useState("");
  
  const { mutate: overrideGrade, isPending } = useOverrideQuestionGrade();

  const handleOverride = () => {
    if (!newScore || isNaN(newScore)) return;
    overrideGrade(
      { sessionId, sessionQuestionId: question.session_question_id, new_score: Number(newScore), reason },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Override Question Grade">
      <div className="space-y-4">
        <p className="text-[14px] text-warm-gray-500">
          You are manually overriding the grade for this specific question. This action will recalculate the overall score and record an audit log.
        </p>

        <div>
          <label className="block text-[13px] font-medium text-notion-black mb-1.5">
            New Score <span className="text-destructive">*</span>
          </label>
          <Input 
            type="number" 
            placeholder="Enter new score" 
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
          />
        </div>

        <div>
           <label className="block text-[13px] font-medium text-notion-black mb-1.5">
            Reason for Override <span className="text-destructive">*</span>
          </label>
          <Textarea 
            placeholder="e.g., Evaluation error in the prompt"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button 
            onClick={handleOverride} 
            disabled={isPending || !newScore || !reason}
            variant="destructive"
          >
            {isPending ? "Overriding..." : "Confirm Override"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
