import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { joyPrompts } from "../data/joy";

type SparkJoyViewProps = {
  onDone: () => void;
};

export function SparkJoyView({ onDone }: SparkJoyViewProps) {
  const [index, setIndex] = useState(0);
  const prompt = joyPrompts[index];

  return (
    <section className="joy-view" aria-labelledby="joy-title">
      <div className="joy-card">
        <p className="eyebrow">Offline shift</p>
        <Sparkles className="joy-icon" size={34} aria-hidden="true" />
        <h1 id="joy-title">{prompt.title}</h1>
        <p>{prompt.body}</p>
        <div className="tool-actions">
          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % joyPrompts.length)}
          >
            <RefreshCw size={18} aria-hidden="true" />
            Another
          </button>
          <button type="button" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    </section>
  );
}
