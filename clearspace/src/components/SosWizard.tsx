import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { getFocusProfile } from "../data/focusProfiles";
import { VoiceControl } from "./VoiceControl";
import { cues, type OpeningCue } from "../data/guide";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";
import type { FocusProfileId, SupportContact } from "../types";

type Props = {
  focusProfile?: FocusProfileId;
  opening?: OpeningCue;
  selectedPhrase?: string;
  phraseOffset?: number;
  phrases: string[];
  speechGuide?: SpeechGuideControls;
  supportContact: SupportContact;
  onAfter?: () => void;
  onExitHome: () => void;
  onExitJournal: () => void;
  onStartBreathing: () => void;
  onStartGrounding: () => void;
};

export function SosWizard({
  focusProfile = "steady",
  opening = "surface",
  selectedPhrase,
  phraseOffset = 0,
  phrases,
  speechGuide = inactiveSpeechGuide,
  supportContact,
  onAfter,
  onExitHome,
  onExitJournal,
  onStartBreathing,
  onStartGrounding,
}: Props) {
  const [step, setStep] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [phrase] = useState(
    () =>
      selectedPhrase ||
      (phrases.length ? phrases[phraseOffset % phrases.length] : ""),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const steps = [
    cues[opening],
    ...(phrase ? [{ title: "Your reminder", body: phrase }] : []),
    cues.ease,
  ];
  const choosing = toolsOpen || step === steps.length;
  const cue = choosing ? cues.choice : steps[step];
  const text =
    cue.title === "Your reminder" ? cue.body : cue.title + " " + cue.body;
  const { enabled, supported, read, stop } = speechGuide;
  useEffect(() => {
    if (!enabled || !supported) return;
    read(text);
    return () => {
      stop();
    };
  }, [enabled, supported, read, stop, text]);
  const previousText = useRef(text);
  useEffect(() => {
    if (previousText.current !== text) heading.current?.focus();
    previousText.current = text;
  }, [text]);
  const openTool = { breathe: onStartBreathing, ground: onStartGrounding };
  const labels = { breathe: "Paced breathing", ground: "5-4-3-2-1 grounding" };
  return (
    <section className="guide-card" aria-labelledby="cue-title">
      <div className="guide-meta">
        <span>Guided support</span>
        <VoiceControl guide={speechGuide} text={text} />
      </div>
      <div className="guide-body">
        <h1 ref={heading} tabIndex={-1} id="cue-title">
          {cue.title}
        </h1>
        <p>{cue.body}</p>
      </div>
      {choosing ? (
        <div className="guide-actions" aria-label="Next support options">
          {getFocusProfile(focusProfile).toolOrder.map((tool, i) => (
            <button
              type="button"
              key={tool}
              className={i === 0 ? "action-primary" : "action-secondary"}
              onClick={openTool[tool]}
            >
              {labels[tool]} <ArrowRight size={18} aria-hidden="true" />
            </button>
          ))}
          {toolsOpen && step < steps.length && (
            <button className="text-action" onClick={() => setToolsOpen(false)}>
              Back to my cue
            </button>
          )}
          <button className="text-action" onClick={onExitJournal}>
            Journal
          </button>
          <button className="text-action" onClick={onExitHome}>
            Finish here
          </button>
        </div>
      ) : (
        <div className="guide-actions">
          <button
            className="action-primary"
            onClick={() => setStep((n) => n + 1)}
          >
            Next step <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button className="text-action" onClick={() => setToolsOpen(true)}>
            Try a different exercise
          </button>
        </div>
      )}
      {onAfter && (
        <button className="text-action" onClick={onAfter}>
          I’m ready for what’s next
        </button>
      )}
      {supportContact.phone.trim() && (
        <a className="person-link" href={"tel:" + supportContact.phone}>
          <Heart size={17} aria-hidden="true" />
          Call {supportContact.name.trim() || "my support person"}
        </a>
      )}
    </section>
  );
}
