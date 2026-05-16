import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Volume2, VolumeX } from "lucide-react";
import { groundingSteps } from "../data/grounding";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";

type GroundingToolProps = {
  speechGuide?: SpeechGuideControls;
  onDone: () => void;
};

export function GroundingTool({
  speechGuide = inactiveSpeechGuide,
  onDone,
}: GroundingToolProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const {
    enabled: voiceEnabled,
    isPaused: voicePaused,
    isSpeaking: voiceSpeaking,
    read: readVoice,
    stop: stopVoice,
    supported: voiceSupported,
  } = speechGuide;
  const activeStep = groundingSteps[activeStepIndex];
  const isComplete =
    activeStepIndex === groundingSteps.length - 1 &&
    checkedItems.length === activeStep.count;
  const showVoiceControls = voiceEnabled && voiceSupported;
  const speechText = useMemo(
    () =>
      isComplete
        ? "You finished the grounding steps. Notice whether anything feels even slightly more settled or clear."
        : `Name ${activeStep.count} ${activeStep.sense}. ${activeStep.hint}`,
    [activeStep.count, activeStep.hint, activeStep.sense, isComplete],
  );

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

  const finish = () => {
    stopVoice();
    onDone();
  };

  const toggleItem = (index: number) => {
    setCheckedItems((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }

      const next = [...current, index];
      if (next.length === activeStep.count && activeStepIndex < groundingSteps.length - 1) {
        setActiveStepIndex((value) => value + 1);
        return [];
      }

      return next;
    });
  };

  if (isComplete) {
    return (
      <section className="tool-view" aria-labelledby="grounding-complete-title">
        <p className="eyebrow">Grounding</p>
        <h1 id="grounding-complete-title">You finished the grounding steps.</h1>
        <p>Notice whether anything feels even slightly more settled or clear.</p>
        <div className="tool-actions compact-actions">
          {showVoiceControls ? (
            <button type="button" onClick={toggleVoice}>
              {voiceSpeaking || voicePaused ? (
                <VolumeX size={18} aria-hidden="true" />
              ) : (
                <Volume2 size={18} aria-hidden="true" />
              )}
              {voiceSpeaking || voicePaused ? "Stop voice" : "Read aloud"}
            </button>
          ) : null}
          <button type="button" onClick={finish}>
            Done
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="tool-view" aria-labelledby="grounding-title">
      <p className="eyebrow">5-4-3-2-1 grounding</p>
      <h1 id="grounding-title">
        Name {activeStep.count} {activeStep.sense}.
      </h1>
      <p>{activeStep.hint}</p>

      <div className="grounding-progress" aria-label="Grounding progress">
        {groundingSteps.map((step, index) => (
          <span
            key={step.sense}
            className={index <= activeStepIndex ? "active" : ""}
            aria-current={index === activeStepIndex ? "step" : undefined}
          >
            {step.count}
          </span>
        ))}
      </div>

      <div className="grounding-list" aria-label={`${activeStep.count} items`}>
        {Array.from({ length: activeStep.count }, (_, index) => {
          const checked = checkedItems.includes(index);

          return (
            <button
              key={`${activeStepIndex}-${index}`}
              type="button"
              aria-pressed={checked}
              onClick={() => toggleItem(index)}
            >
              {checked ? (
                <CheckCircle2 size={20} aria-hidden="true" />
              ) : (
                <Circle size={20} aria-hidden="true" />
              )}
              <span>Item {index + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="tool-actions compact-actions">
        {showVoiceControls ? (
          <button type="button" onClick={toggleVoice}>
            {voiceSpeaking || voicePaused ? (
              <VolumeX size={18} aria-hidden="true" />
            ) : (
              <Volume2 size={18} aria-hidden="true" />
            )}
            {voiceSpeaking || voicePaused ? "Stop voice" : "Read aloud"}
          </button>
        ) : null}
        <button type="button" onClick={finish}>
          Done for now
        </button>
      </div>
    </section>
  );
}
