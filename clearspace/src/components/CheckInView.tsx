import { useState } from "react";
import type { CheckInHelped, CheckInShift, SupportCheckIn } from "../types";

type CheckInViewProps = {
  source: SupportCheckIn["source"];
  onSave: (entry: Omit<SupportCheckIn, "id" | "createdAt">) => void;
  onSkip: () => void;
};

const shiftOptions: Array<{ id: CheckInShift; label: string }> = [
  { id: "a-little-calmer", label: "A little calmer" },
  { id: "about-the-same", label: "About the same" },
  { id: "more-intense", label: "More intense" },
];

const helpedOptions: Array<{ id: CheckInHelped; label: string }> = [
  { id: "grounding-helped", label: "Grounding helped" },
  { id: "breathing-helped", label: "Breathing helped" },
  { id: "reassurance-helped", label: "Reassurance helped" },
  { id: "human-support-helped", label: "Human support helped" },
];

export function CheckInView({ source, onSave, onSkip }: CheckInViewProps) {
  const [selectedShift, setSelectedShift] = useState<CheckInShift>(
    shiftOptions[0].id,
  );
  const [selectedHelped, setSelectedHelped] = useState<CheckInHelped>(
    helpedOptions[0].id,
  );

  return (
    <section className="checkin-view" aria-labelledby="checkin-title">
      <div>
        <p className="eyebrow">Optional check-in</p>
        <h1 id="checkin-title">What changed?</h1>
        <p>
          This is not a score. It helps ClearSpace suggest a calmer first step
          next time and stays only in this browser.
        </p>
      </div>

      <div className="checkin-section">
        <h2>How do you feel compared with a few minutes ago?</h2>
        <div className="checkin-options">
          {shiftOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === selectedShift}
              onClick={() => setSelectedShift(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="checkin-section">
        <h2>What seemed most helpful?</h2>
        <div className="checkin-options">
          {helpedOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={option.id === selectedHelped}
              onClick={() => setSelectedHelped(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tool-actions">
        <button
          type="button"
          onClick={() =>
            onSave({
              source,
              shift: selectedShift,
              helped: selectedHelped,
            })
          }
        >
          Save check-in
        </button>
        <button type="button" onClick={onSkip}>
          Skip
        </button>
      </div>
    </section>
  );
}
