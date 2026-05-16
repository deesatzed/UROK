import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";

type BreathingToolProps = {
  speechGuide?: SpeechGuideControls;
  onDone: () => void;
  onSwitchGrounding?: () => void;
};

type BreathPhase = "inhale" | "exhale";

const phaseDurations: Record<BreathPhase, number> = {
  inhale: 4,
  exhale: 6,
};

export function BreathingTool({
  speechGuide = inactiveSpeechGuide,
  onDone,
  onSwitchGrounding,
}: BreathingToolProps) {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [timeLeft, setTimeLeft] = useState(phaseDurations.inhale);
  const [isActive, setIsActive] = useState(false);
  const {
    enabled: voiceEnabled,
    isPaused: voicePaused,
    isSpeaking: voiceSpeaking,
    read: readVoice,
    stop: stopVoice,
    supported: voiceSupported,
  } = speechGuide;
  const speechText =
    phase === "inhale"
      ? "Breathe in gently for four."
      : "Breathe out slowly for six.";
  const showVoiceControls = voiceEnabled && voiceSupported;

  useEffect(() => {
    if (!isActive) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current > 1) return current - 1;

        const nextPhase = phase === "inhale" ? "exhale" : "inhale";
        setPhase(nextPhase);
        return phaseDurations[nextPhase];
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isActive, phase]);

  const reset = () => {
    setIsActive(false);
    stopVoice();
    setPhase("inhale");
    setTimeLeft(phaseDurations.inhale);
  };

  useEffect(() => {
    if (!isActive || !showVoiceControls) return;

    readVoice(speechText);
  }, [isActive, readVoice, showVoiceControls, speechText]);

  useEffect(() => {
    if (!isActive) {
      stopVoice();
    }
  }, [isActive, stopVoice]);

  useEffect(
    () => () => {
      stopVoice();
    },
    [stopVoice],
  );

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

  const switchGrounding = () => {
    stopVoice();
    onSwitchGrounding?.();
  };

  return (
    <section className="tool-view" aria-labelledby="breathing-title">
      <p className="eyebrow">Paced breathing</p>
      <h1 id="breathing-title">
        {phase === "inhale" ? "Breathe in gently." : "Breathe out slowly."}
      </h1>
      <p>
        Use a longer exhale than inhale. Pause whenever you need to; there is no
        score to keep.
      </p>

      <button
        className={isActive ? "breath-orb active" : "breath-orb"}
        type="button"
        onClick={() => setIsActive((value) => !value)}
        aria-label={isActive ? "Pause breathing timer" : "Start breathing timer"}
      >
        <span>{phase === "inhale" ? "In" : "Out"}</span>
        <strong>{timeLeft}</strong>
      </button>

      <div className="tool-actions">
        <button type="button" onClick={() => setIsActive((value) => !value)}>
          {isActive ? (
            <Pause size={18} aria-hidden="true" />
          ) : (
            <Play size={18} aria-hidden="true" />
          )}
          {isActive ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={reset}>
          <RotateCcw size={18} aria-hidden="true" />
          Reset
        </button>
        {onSwitchGrounding ? (
          <button type="button" onClick={switchGrounding}>
            Breathing feels worse
          </button>
        ) : null}
        {showVoiceControls ? (
          <button type="button" onClick={toggleVoice}>
            {voiceSpeaking || voicePaused ? (
              <VolumeX size={18} aria-hidden="true" />
            ) : (
              <Volume2 size={18} aria-hidden="true" />
            )}
            {voiceSpeaking || voicePaused ? "Stop voice" : "Read cue"}
          </button>
        ) : null}
        <button type="button" onClick={finish}>
          Done
        </button>
      </div>
    </section>
  );
}
