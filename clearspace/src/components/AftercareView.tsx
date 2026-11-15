import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { cues, spokenCue } from "../data/guide";
import { VoiceControl } from "./VoiceControl";
import type { SpeechGuideControls } from "../hooks/useSpeechGuide";
import type { SupportContact } from "../types";

type Props = {
  guide: SpeechGuideControls;
  contact: SupportContact;
  checkInAvailable: boolean;
  onSupport: () => void;
  onHome: () => void;
  onSteps: () => void;
  onJournal: () => void;
  onCheckIn: () => void;
};
export function AftercareView({
  guide,
  contact,
  checkInAvailable,
  onSupport,
  onHome,
  onSteps,
  onJournal,
  onCheckIn,
}: Props) {
  const [stage, setStage] = useState<"arrive" | "pause" | "next">("arrive");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (stage !== "arrive") heading.current?.focus({ preventScroll: true });
  }, [stage]);
  const id = stage === "pause" ? "rest" : "after";
  const { enabled, supported, read, stop } = guide;
  useEffect(() => {
    if (enabled && supported && stage !== "next") read(spokenCue(id));
    return () => {
      stop();
    };
  }, [enabled, supported, read, stop, id, stage]);
  return (
    <section className="guide-card aftercare" aria-labelledby="after-title">
      <div className="guide-meta">
        <span>After a difficult moment</span>
        {stage !== "next" && (
          <VoiceControl guide={guide} text={spokenCue(id)} />
        )}
      </div>
      <div className="guide-body">
        <h1 ref={heading} id="after-title" tabIndex={-1}>
          {stage === "next" ? "What would help next?" : cues[id].title}
        </h1>
        <p>
          {stage === "next"
            ? "You can ease back into your day, or take a little more time."
            : cues[id].body}
        </p>
      </div>
      <div className="guide-actions">
        {stage === "arrive" ? (
          <>
            <button
              className="action-primary"
              onClick={() => setStage("pause")}
            >
              Take a quiet moment
            </button>
            <button className="text-action" onClick={() => setStage("next")}>
              I’m ready for what’s next <ArrowRight size={17} />
            </button>
          </>
        ) : stage === "pause" ? (
          <>
            <button className="action-primary" onClick={() => setStage("next")}>
              When I’m ready <ArrowRight size={17} />
            </button>
            <button className="text-action" onClick={onHome}>
              Done for now
            </button>
          </>
        ) : (
          <>
            <button className="action-primary" onClick={onHome}>
              Back to my day <ArrowRight size={17} />
            </button>
            {contact.phone.trim() && (
              <a className="action-secondary" href={"tel:" + contact.phone}>
                <Phone size={17} />
                Call {contact.name.trim() || "my support person"}
              </a>
            )}
            <button className="text-action" onClick={onSteps}>
              Look back on a step I tried
            </button>
            <details className="optional-detail">
              <summary>Keep a note (optional)</summary>
              <button className="text-action" onClick={onJournal}>
                Write a journal note
              </button>
              {checkInAvailable && (
                <button className="text-action" onClick={onCheckIn}>
                  How do I feel now?
                </button>
              )}
            </details>
          </>
        )}
      </div>
      <button className="text-action" onClick={onSupport}>
        I’d like support again
      </button>
    </section>
  );
}
