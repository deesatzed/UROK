import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Pattern = { noticed: string; predicted: string; response: string };
function valid(value: unknown): value is Pattern {
  return (
    !!value &&
    typeof value === "object" &&
    ["noticed", "predicted", "response"].every(
      (k) =>
        k in value &&
        typeof (value as Record<string, unknown>)[k] === "string" &&
        String((value as Record<string, unknown>)[k]).length <= 300,
    )
  );
}
export function PanicPattern({
  onDone,
  onPlan,
}: {
  onDone: () => void;
  onPlan: () => void;
}) {
  const [pattern, setPattern] = useLocalStorage<Pattern>(
    "my-panic-pattern",
    { noticed: "", predicted: "", response: "" },
    { validate: valid },
  );
  const [stage, setStage] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (stage) heading.current?.focus({ preventScroll: true });
  }, [stage]);
  const questions = [
    "What did you notice?",
    "What did your mind predict?",
    "What did you do next?",
    "A pattern you can work with.",
  ];
  const fields = ["noticed", "predicted", "response"] as const;
  const examples = [
    "My hands felt shaky.",
    "I thought I would lose control.",
    "I left the queue.",
  ];
  return (
    <section className="flow-view" aria-labelledby="pattern-title">
      <button
        className="text-action back-action"
        onClick={stage ? () => setStage((s) => s - 1) : onDone}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <p className="eyebrow">Understanding my pattern</p>
      <h1 id="pattern-title" tabIndex={-1} ref={heading}>
        {questions[stage]}
      </h1>
      {stage < 3 ? (
        <>
          <p>Think of a familiar experience, or just follow the example.</p>
          <div className="pattern-example">
            <span>One example</span>
            <p>{examples[stage]}</p>
          </div>
          <label>
            In my words (optional)
            <textarea
              maxLength={300}
              value={pattern[fields[stage]]}
              onChange={(e) =>
                setPattern({ ...pattern, [fields[stage]]: e.target.value })
              }
            />
          </label>
          <button
            className="action-primary"
            onClick={() => setStage((s) => s + 1)}
          >
            Next <ArrowRight size={17} />
          </button>
        </>
      ) : (
        <>
          <div className="pattern-summary">
            {fields.map((field, i) => (
              <div key={field}>
                <h2>{["I noticed", "My mind predicted", "I responded"][i]}</h2>
                {!pattern[field].trim() && <small>Example</small>}
                <p>{pattern[field].trim() || examples[i]}</p>
              </div>
            ))}
          </div>
          <p>
            CBT looks at how sensations, interpretations, and responses can feed
            into each other. A therapist can help you explore the pattern and
            choose a suitable next step.
          </p>
          <button className="action-primary" onClick={onPlan}>
            Choose a small step
          </button>
          <button className="text-action" onClick={onDone}>
            Done for now
          </button>
        </>
      )}
      <p className="local-note">Your words stay on this device.</p>
      {Object.values(pattern).some(Boolean) && (
        <button
          className="text-action"
          onClick={() =>
            setPattern({ noticed: "", predicted: "", response: "" })
          }
        >
          Clear my words
        </button>
      )}
    </section>
  );
}
