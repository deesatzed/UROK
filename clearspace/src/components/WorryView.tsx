import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { cues, spokenCue } from "../data/guide";
import { VoiceControl } from "./VoiceControl";
import type { SpeechGuideControls } from "../hooks/useSpeechGuide";

type Props = {
  guide: SpeechGuideControls;
  onHome: () => void;
  onPlan: () => void;
  onSupport: () => void;
};
export function WorryView({ guide, onHome, onPlan, onSupport }: Props) {
  const [stage, setStage] = useState<"choose" | "action" | "later">("choose");
  const [task, setTask] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const id =
    stage === "later"
      ? "worryLater"
      : stage === "action"
        ? "worryAction"
        : "worry";
  const { enabled, supported, read, stop } = guide;
  useEffect(() => {
    if (enabled && supported) read(spokenCue(id));
    return () => {
      stop();
    };
  }, [enabled, supported, read, stop, id]);
  useEffect(() => {
    if (stage !== "choose") heading.current?.focus({ preventScroll: true });
  }, [stage]);
  return (
    <section className="flow-view" aria-labelledby="worry-title">
      <button
        className="text-action back-action"
        onClick={stage === "choose" ? onHome : () => setStage("choose")}
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="guide-meta">
        <span>A “what if” moment</span>
        <VoiceControl guide={guide} text={spokenCue(id)} />
      </div>
      <div className="flow-intro">
        <h1 id="worry-title" ref={heading} tabIndex={-1}>
          {stage === "action" ? "One thing you can do." : cues[id].title}
        </h1>
        <p>
          {stage === "action"
            ? "Choose a small, practical action. You can use your saved step or make a new plan."
            : cues[id].body}
        </p>
      </div>
      {stage === "choose" ? (
        <div className="stack-actions">
          <button className="action-primary" onClick={() => setStage("action")}>
            There’s something I can do
          </button>
          <button
            className="action-secondary"
            onClick={() => setStage("later")}
          >
            It’s another “what if”
          </button>
          <button className="text-action" onClick={onHome}>
            I’m not sure yet
          </button>
        </div>
      ) : stage === "action" ? (
        <>
          <button className="action-primary" onClick={onPlan}>
            Choose a small step
          </button>
          <button className="text-action" onClick={onHome}>
            I know what I’ll do
          </button>
        </>
      ) : (
        <>
          <label>
            What would I like to return to? (optional)
            <input
              maxLength={120}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Making tea, a book, a conversation…"
            />
          </label>
          {task.trim() && (
            <p className="return-note">
              I’ll give my attention to {task.trim()}.
            </p>
          )}
          <button className="action-primary" onClick={onHome}>
            Back to what I was doing
          </button>
          <details className="optional-detail">
            <summary>If the worry keeps returning</summary>
            <p>
              You can note it briefly and choose a short time to think it
              through later. When that time comes, consider what you can act on
              and what you can leave open.
            </p>
          </details>
        </>
      )}
      <button className="text-action" onClick={onSupport}>
        I’d like support now
      </button>
    </section>
  );
}
