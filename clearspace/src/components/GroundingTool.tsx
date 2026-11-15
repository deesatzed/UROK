import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { VoiceControl } from "./VoiceControl";
import { cues, spokenCue } from "../data/guide";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";

const senses = ["see", "touch", "hear", "smell", "taste"] as const;
type Props = {
  speechGuide?: SpeechGuideControls;
  onDone: () => void;
  onSwitchBreathing?: () => void;
};
export function GroundingTool({
  speechGuide = inactiveSpeechGuide,
  onDone,
  onSwitchBreathing,
}: Props) {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const complete = step >= senses.length;
  const id = complete ? "finished" : senses[step];
  const cue = cues[id];
  const { enabled, supported, read, stop } = speechGuide;
  useEffect(() => {
    if (!enabled || !supported) return;
    read(spokenCue(id));
    return () => {
      stop();
    };
  }, [enabled, supported, id, read, stop]);
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);
  const next = () => {
    setChecked([]);
    setStep((i) => Math.min(senses.length, i + 1));
  };
  const finish = () => {
    stop();
    onDone();
  };
  const count = senses.length - step;
  const checkItem = (index: number) => {
    const items = checked.includes(index)
      ? checked.filter((n) => n !== index)
      : [...checked, index];
    if (items.length === count) next();
    else setChecked(items);
  };
  return (
    <section className="guide-card" aria-labelledby="grounding-title">
      <div className="guide-meta">
        <span>5-4-3-2-1 grounding</span>
        <VoiceControl guide={speechGuide} text={spokenCue(id)} />
      </div>
      <div className="guide-body">
        <h1 id="grounding-title" ref={heading} tabIndex={-1}>
          {cue.title}
        </h1>
        <p>{cue.body}</p>
      </div>
      {!complete && (
        <>
          <p className="guide-hint">
            Stay with one detail or move to another sense.
          </p>
          <button className="action-primary" onClick={next}>
            {step === 4 ? "Finish exercise" : "Next sense"}{" "}
            <ArrowRight size={18} />
          </button>
          <details className="count-details" key={step}>
            <summary>Count with taps</summary>
            <div className="count-buttons">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  aria-label={"Item " + (i + 1)}
                  aria-pressed={checked.includes(i)}
                  onClick={() => checkItem(i)}
                >
                  {checked.includes(i) ? <Check size={18} /> : i + 1}
                </button>
              ))}
            </div>
          </details>
        </>
      )}
      <div className="guide-links">
        <button
          className={complete ? "action-primary" : "text-action"}
          onClick={finish}
        >
          Done for now
        </button>
        {onSwitchBreathing && !complete && (
          <button className="text-action" onClick={onSwitchBreathing}>
            Try breathing instead
          </button>
        )}
      </div>
    </section>
  );
}
