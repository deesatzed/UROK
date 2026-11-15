import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stepIdeas, emptyStep } from "../data/smallSteps";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isStepDraft } from "../storage/appStorage";
import type { SmallStep, StepDraft } from "../types";

type Props = {
  existing?: SmallStep;
  pendingEdits: Record<string, StepDraft>;
  setPendingEdits: Dispatch<SetStateAction<Record<string, StepDraft>>>;
  onSave: (draft: StepDraft, id?: string) => void;
  onCancel: () => void;
};
export function StepBuilder({
  existing,
  pendingEdits,
  setPendingEdits,
  onSave,
  onCancel,
}: Props) {
  const [savedDraft, setSavedDraft] = useLocalStorage<StepDraft>(
    "small-step-draft",
    emptyStep,
    { validate: isStepDraft },
  );
  const [draft, setDraft] = useState<StepDraft>(() => {
    const initial = existing
      ? (pendingEdits[existing.id] ?? existing)
      : savedDraft;
    return {
      activity: initial.activity,
      action: initial.action,
      prediction: initial.prediction,
      source: initial.source,
    };
  });
  function clearEdits() {
    if (!existing) return;
    setPendingEdits((current) => {
      const next = { ...current };
      delete next[existing.id];
      return next;
    });
  }
  const [stage, setStage] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [stage]);
  function update(patch: Partial<StepDraft>) {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (existing)
      setPendingEdits((current) => ({ ...current, [existing.id]: next }));
    else setSavedDraft(next);
  }
  function save() {
    onSave(
      {
        ...draft,
        activity: draft.activity.trim(),
        action: draft.action.trim(),
        prediction: draft.prediction.trim(),
      },
      existing?.id,
    );
    if (existing) clearEdits();
    else setSavedDraft(emptyStep);
  }
  return (
    <section className="flow-view" aria-labelledby="step-title">
      <button
        className="text-action back-action"
        onClick={stage ? () => setStage((s) => s - 1) : onCancel}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="flow-intro">
        <p className="eyebrow">My small plan · {stage + 1} of 3</p>
        <h1 ref={title} tabIndex={-1} id="step-title">
          {
            [
              "What would you like to do?",
              "What’s one manageable step?",
              "A plan you can come back to.",
            ][stage]
          }
        </h1>
      </div>
      {stage === 0 && (
        <>
          <p>Choose something that matters to you. You can start small.</p>
          <div className="idea-choices" aria-label="Ideas for a step">
            {stepIdeas.map((idea) => (
              <button
                key={idea.label}
                aria-pressed={
                  idea.source
                    ? draft.source === "therapist"
                    : draft.activity === idea.activity
                }
                onClick={() =>
                  update({
                    activity: idea.activity,
                    action: idea.action,
                    prediction: "",
                    source: idea.source ?? "mine",
                  })
                }
              >
                {idea.label}
              </button>
            ))}
          </div>
          <label>
            Something I want to do
            <input
              autoComplete="off"
              maxLength={120}
              value={draft.activity}
              onChange={(e) => update({ activity: e.target.value })}
              placeholder={
                draft.source === "therapist"
                  ? "Give my agreed practice a name"
                  : "Or write my own"
              }
            />
          </label>
          <button
            className="action-primary"
            disabled={!draft.activity.trim()}
            onClick={() => setStage(1)}
          >
            Choose my step <ArrowRight size={17} />
          </button>
        </>
      )}
      {stage === 1 && (
        <>
          <p>
            {draft.source === "therapist"
              ? "Use the activity and guidance you agreed with your therapist."
              : "Choose an ordinary, safe activity at a size that feels workable. You can change it later."}
          </p>
          <div className="plan-context">{draft.activity}</div>
          <label>
            My first step
            <textarea
              rows={2}
              maxLength={300}
              value={draft.action}
              onChange={(e) => update({ action: e.target.value })}
              placeholder="Something specific I can try"
            />
          </label>
          <details className="optional-detail">
            <summary>What worries me (optional)</summary>
            <label>
              What am I afraid might happen?
              <textarea
                rows={2}
                maxLength={300}
                value={draft.prediction}
                onChange={(e) => update({ prediction: e.target.value })}
              />
            </label>
          </details>
          <button
            className="action-primary"
            disabled={!draft.action.trim()}
            onClick={() => setStage(2)}
          >
            See my plan <ArrowRight size={17} />
          </button>
        </>
      )}
      {stage === 2 && (
        <>
          <div className="plan-paper">
            <h2>{draft.activity}</h2>
            <p className="plan-action">{draft.action}</p>
            {draft.prediction && (
              <details>
                <summary>What worries me</summary>
                <p>{draft.prediction}</p>
              </details>
            )}
          </div>
          <p>
            You can try this step with some anxiety present. You choose when to
            begin.
          </p>
          <button className="action-primary" onClick={save}>
            Keep this plan <ArrowRight size={17} />
          </button>
        </>
      )}
      {stage === 0 && !existing && (draft.activity || draft.action) && (
        <button
          className="text-action"
          onClick={() => {
            setDraft(emptyStep);
            setSavedDraft(emptyStep);
          }}
        >
          Clear my draft
        </button>
      )}
      {existing && pendingEdits[existing.id] && (
        <button
          className="text-action"
          onClick={() => {
            setDraft({
              activity: existing.activity,
              action: existing.action,
              prediction: existing.prediction,
              source: existing.source,
            });
            clearEdits();
          }}
        >
          Discard these changes
        </button>
      )}
      <p className="local-note">
        {existing
          ? "Your edit draft stays on this device. Keep this plan when you’re ready."
          : "Your draft stays on this device."}
      </p>
    </section>
  );
}
