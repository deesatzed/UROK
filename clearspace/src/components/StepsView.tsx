import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isReflectionDrafts, isPendingStepEdits } from "../storage/appStorage";
import { StepBuilder } from "./StepBuilder";
import type {
  SmallStep,
  StepAttempt,
  StepDraft,
  ReflectionDraft,
} from "../types";

type Props = {
  plans: SmallStep[];
  initialId?: string;
  anticipatory?: boolean;
  onSelect: (id: string) => void;
  onSave: (draft: StepDraft, id?: string) => string;
  onRecord: (
    id: string,
    attempt: Omit<StepAttempt, "id" | "createdAt">,
  ) => void;
  onDelete: (id: string) => void;
  onHome: () => void;
  onWorry: () => void;
  onSupport: () => void;
};
type Mode = "list" | "build" | "card" | "away" | "review";
export function StepsView({
  plans,
  initialId,
  anticipatory = false,
  onSelect,
  onSave,
  onRecord,
  onDelete,
  onHome,
  onWorry,
  onSupport,
}: Props) {
  const [id, setId] = useState(
    initialId ?? (anticipatory ? plans[0]?.id : undefined),
  );
  const [mode, setMode] = useState<Mode>(
    initialId || (anticipatory && plans.length) ? "card" : "list",
  );
  const [editing, setEditing] = useState(false);
  const [removeAsked, setRemoveAsked] = useState(false);
  const [reflections, setReflections] = useLocalStorage<
    Record<string, ReflectionDraft>
  >("reflection-drafts", {}, { validate: isReflectionDrafts });
  const [pendingEdits, setPendingEdits] = useLocalStorage<
    Record<string, StepDraft>
  >("pending-step-edits", {}, { validate: isPendingStepEdits });
  const reflection = reflections[id ?? ""] ?? { happened: "", learned: "" };
  const { happened, learned } = reflection;
  function updateReflection(patch: Partial<ReflectionDraft>) {
    if (id)
      setReflections((current) => ({
        ...current,
        [id]: { ...reflection, ...patch },
      }));
  }
  function clearReflection() {
    if (!id) return;
    setReflections((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }
  const heading = useRef<HTMLHeadingElement>(null);
  const plan = plans.find((p) => p.id === id);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    setRemoveAsked(false);
  }, [mode, id]);
  function build(edit = false) {
    setEditing(edit);
    setMode("build");
  }
  function save(draft: StepDraft, current?: string) {
    setId(onSave(draft, current));
    setMode("card");
  }
  function review() {
    setMode("review");
  }
  if (mode === "build")
    return (
      <StepBuilder
        existing={editing ? plan : undefined}
        pendingEdits={pendingEdits}
        setPendingEdits={setPendingEdits}
        onSave={save}
        onCancel={() => setMode(plan ? "card" : "list")}
      />
    );
  return (
    <section className="flow-view" aria-labelledby="steps-title">
      <button
        className="text-action back-action"
        onClick={mode === "list" ? onHome : () => setMode("list")}
      >
        <ArrowLeft size={16} />
        {mode === "list" ? "Back to home" : "My steps"}
      </button>
      {mode === "list" || !plan ? (
        <>
          <div className="flow-intro">
            <h1 id="steps-title" ref={heading} tabIndex={-1}>
              {anticipatory ? "Something you want to do." : "My small steps."}
            </h1>
            <p>
              {anticipatory
                ? "Choose a small step for something you want to do."
                : "Your plans are here whenever you want to try or return to one."}
            </p>
          </div>
          <button className="action-primary" onClick={() => build()}>
            <Plus size={18} />
            Make a small plan
          </button>
          {plans.length > 0 && (
            <div className="saved-plans">
              {plans.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setId(item.id);
                    onSelect(item.id);
                    setMode("card");
                  }}
                >
                  <span>
                    <strong>{item.activity}</strong>
                    <small>{item.action}</small>
                  </span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
          {anticipatory && (
            <button className="text-action" onClick={onWorry}>
              I’m caught in “what if” thoughts
            </button>
          )}
          <p className="local-note">
            Saved on this device. You can edit or remove a plan at any time.
          </p>
        </>
      ) : mode === "card" ? (
        <>
          <div className="flow-intro">
            <p className="eyebrow">My saved step</p>
            <h1 id="steps-title" ref={heading} tabIndex={-1}>
              {plan.activity}
            </h1>
          </div>
          <div className="plan-paper">
            <p className="plan-action">{plan.action}</p>
            {plan.prediction && (
              <details>
                <summary>What worries me</summary>
                <p>{plan.prediction}</p>
              </details>
            )}
            {plan.source === "therapist" && (
              <p className="local-note">
                Use the guidance you agreed with your therapist.
              </p>
            )}
          </div>
          <button className="action-primary" onClick={() => setMode("away")}>
            I’ll try this step <ArrowRight size={17} />
          </button>
          <button className="action-secondary" onClick={review}>
            I want to look back on it
          </button>
          <div className="guide-links">
            <button className="text-action" onClick={() => build(true)}>
              Make it smaller or change it
            </button>
            <button className="text-action" onClick={onHome}>
              Leave it for today
            </button>
          </div>
          {plan.attempts.length > 0 && (
            <details className="optional-detail">
              <summary>What I noticed before</summary>
              {[...plan.attempts].reverse().map((a) => (
                <article className="attempt-note" key={a.id}>
                  <time dateTime={a.createdAt}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </time>
                  {a.happened && <p>{a.happened}</p>}
                  {a.learned && <p>{a.learned}</p>}
                </article>
              ))}
            </details>
          )}
          <details className="optional-detail">
            <summary>Manage this plan</summary>
            <button
              className="text-action"
              onClick={() => setRemoveAsked(true)}
            >
              Remove this plan
            </button>
            {removeAsked && (
              <div role="group" aria-label="Remove plan confirmation">
                <p>Remove this plan and its reflections from this device?</p>
                <button
                  onClick={() => {
                    clearReflection();
                    setPendingEdits((current) => {
                      const next = { ...current };
                      delete next[plan.id];
                      return next;
                    });
                    onDelete(plan.id);
                    setId(undefined);
                    setMode("list");
                  }}
                >
                  Yes, remove plan
                </button>
                <button
                  className="text-action"
                  onClick={() => setRemoveAsked(false)}
                >
                  Keep it
                </button>
              </div>
            )}
          </details>
        </>
      ) : mode === "away" ? (
        <>
          <div className="flow-intro">
            <h1 id="steps-title" ref={heading} tabIndex={-1}>
              Take this at your pace.
            </h1>
            <p>
              You can put your phone away. Your plan will be here when you
              return.
            </p>
          </div>
          <div className="plan-paper">
            <h2>{plan.activity}</h2>
            <p className="plan-action">{plan.action}</p>
          </div>
          <button className="action-primary" onClick={onHome}>
            Done for now
          </button>
          <button className="text-action" onClick={review}>
            I’m back
          </button>
          <button className="text-action" onClick={onSupport}>
            I’d like support now
          </button>
        </>
      ) : (
        <>
          <div className="flow-intro">
            <h1 id="steps-title" ref={heading} tabIndex={-1}>
              What did you notice?
            </h1>
            <p>Any part of the experience counts. You can leave these blank.</p>
          </div>
          {plan.prediction && (
            <details className="optional-detail">
              <summary>What I expected</summary>
              <p>{plan.prediction}</p>
            </details>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRecord(plan.id, {
                happened: happened.trim(),
                learned: learned.trim(),
              });
              clearReflection();
              setMode("card");
            }}
          >
            <label>
              What happened? (optional)
              <textarea
                maxLength={600}
                value={happened}
                onChange={(e) => updateReflection({ happened: e.target.value })}
                placeholder="Including anything I managed, changed, or found hard"
              />
            </label>
            <label>
              What do I want to remember? (optional)
              <textarea
                maxLength={600}
                value={learned}
                onChange={(e) => updateReflection({ learned: e.target.value })}
              />
            </label>
            <button
              className="action-primary"
              disabled={!happened.trim() && !learned.trim()}
            >
              Keep this reflection
            </button>
          </form>
          <button className="text-action" onClick={() => setMode("card")}>
            Skip for now
          </button>
          {(happened || learned) && (
            <button className="text-action" onClick={clearReflection}>
              Clear this draft
            </button>
          )}
          <p className="local-note">
            Your unfinished reflection stays on this device until you keep or
            clear it.
          </p>
        </>
      )}
      {mode !== "away" && (
        <button className="text-action" onClick={onSupport}>
          I’d like support now
        </button>
      )}
    </section>
  );
}
