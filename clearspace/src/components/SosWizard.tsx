import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Home, Volume2, VolumeX, Wind } from "lucide-react";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";
import type { SupportContact } from "../types";

type SosWizardProps = {
  phrases: string[];
  speechGuide?: SpeechGuideControls;
  supportContact: SupportContact;
  onExitHome: () => void;
  onExitJournal: () => void;
  onStartBreathing: () => void;
  onStartGrounding: () => void;
};

type Step = {
  title: string;
  body: string;
  action: string;
};

const baseSteps: Step[] = [
  {
    title: "Plant your feet.",
    body: "Sit down if you can. Press both feet into the floor and notice what is holding you up.",
    action: "I am here",
  },
  {
    title: "Release one layer of tension.",
    body: "Drop your shoulders. Let your jaw loosen. Open your hands or rest them somewhere steady.",
    action: "Next",
  },
  {
    title: "Reduce stimulation.",
    body: "If it is safe to do so, step away from bright light, noise, crowds, or anything demanding your attention.",
    action: "Next",
  },
];

export function SosWizard({
  phrases,
  speechGuide = inactiveSpeechGuide,
  supportContact,
  onExitHome,
  onExitJournal,
  onStartBreathing,
  onStartGrounding,
}: SosWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPhrase] = useState(() => phrases[0] ?? "Take one small step.");
  const {
    enabled: voiceEnabled,
    isPaused: voicePaused,
    isSpeaking: voiceSpeaking,
    read: readVoice,
    stop: stopVoice,
    supported: voiceSupported,
  } = speechGuide;

  const steps: Step[] = [
    baseSteps[0],
    {
      title: "Read this slowly.",
      body: selectedPhrase,
      action: "I read it",
    },
    ...baseSteps.slice(1),
  ];

  const currentStep = steps[stepIndex];
  const isBranchStep = stepIndex >= steps.length;
  const speechText = useMemo(
    () =>
      isBranchStep
        ? "What would help next? You can slow your breathing or ground through your senses. Pick the option that feels easiest to start."
        : `${currentStep.title} ${currentStep.body}`,
    [currentStep?.body, currentStep?.title, isBranchStep],
  );
  const progressText = isBranchStep
    ? "Choose a tool"
    : `Step ${stepIndex + 1} of ${steps.length}`;
  const hasSupportContact = supportContact.phone.trim().length > 0;
  const showVoiceControls = voiceEnabled && voiceSupported;

  useEffect(() => {
    if (!showVoiceControls) return undefined;

    readVoice(speechText);
    return () => {
      stopVoice();
    };
  }, [readVoice, showVoiceControls, speechText, stopVoice]);

  const toggleVoice = () => {
    if (voiceSpeaking || voicePaused) {
      stopVoice();
      return;
    }

    readVoice(speechText);
  };

  return (
    <section className="sos-view" aria-labelledby="sos-title">
      <div className="sos-top-row">
        <span>{progressText}</span>
        <div className="sos-exit-actions">
          {showVoiceControls ? (
            <button type="button" onClick={toggleVoice}>
              {voiceSpeaking || voicePaused ? (
                <VolumeX size={16} aria-hidden="true" />
              ) : (
                <Volume2 size={16} aria-hidden="true" />
              )}
              {voiceSpeaking || voicePaused ? "Stop voice" : "Read aloud"}
            </button>
          ) : null}
          <button type="button" onClick={onExitJournal}>
            Journal
          </button>
          <button type="button" onClick={onExitHome}>
            <Home size={16} aria-hidden="true" />
            Home
          </button>
        </div>
      </div>

      {!isBranchStep ? (
        <div className="sos-card">
          <p className="eyebrow">Guided support</p>
          <h1 id="sos-title">{currentStep.title}</h1>
          <p>{currentStep.body}</p>
          <button
            className="sos-next-button"
            type="button"
            onClick={() => setStepIndex((value) => value + 1)}
          >
            <span>{currentStep.action}</span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="sos-card">
          <p className="eyebrow">Choose the next support</p>
          <h1 id="sos-title">What would help next?</h1>
          <p>
            You can slow your breathing or ground through your senses. Pick the
            option that feels easiest to start.
          </p>
          <div className="sos-branch-actions">
            <button type="button" onClick={onStartBreathing}>
              <Wind size={20} aria-hidden="true" />
              Paced breathing
            </button>
            <button type="button" onClick={onStartGrounding}>
              5-4-3-2-1 grounding
            </button>
          </div>
        </div>
      )}

      {hasSupportContact ? (
        <a className="support-contact-link" href={`tel:${supportContact.phone}`}>
          <Heart size={18} aria-hidden="true" />
          Call {supportContact.name.trim() || "support"}
        </a>
      ) : null}
    </section>
  );
}
