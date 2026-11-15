import { useEffect, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { VoiceControl } from "./VoiceControl";
import { cues, spokenCue } from "../data/guide";
import {
  inactiveSpeechGuide,
  type SpeechGuideControls,
} from "../hooks/useSpeechGuide";

type Props = {
  speechGuide?: SpeechGuideControls;
  onDone: () => void;
  onSwitchGrounding?: () => void;
  suspended?: boolean;
};
const phaseSeconds = 4;

export function BreathingTool({
  speechGuide = inactiveSpeechGuide,
  onDone,
  onSwitchGrounding,
  suspended = false,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const phase =
    elapsed % (phaseSeconds * 2) < phaseSeconds ? "breathIn" : "breathOut";
  const remaining = phaseSeconds - (elapsed % phaseSeconds);
  const { enabled, supported, read, stop } = speechGuide;
  useEffect(() => {
    if (suspended) setRunning(false);
    if (!running || suspended) return;
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    const pauseWhenHidden = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [running, suspended]);
  useEffect(() => {
    if (suspended || !enabled || !supported || (!running && hasStarted)) return;
    read(spokenCue(running ? phase : "ownPace"));
    return () => {
      stop();
    };
  }, [running, hasStarted, suspended, enabled, supported, phase, read, stop]);
  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );
  function reset() {
    setRunning(false);
    setElapsed(0);
    stop();
  }
  return (
    <section
      className="guide-card breath-guide"
      aria-labelledby="breathing-title"
    >
      <div className="guide-meta">
        <span>Paced breathing</span>
        <VoiceControl
          guide={speechGuide}
          text={spokenCue(running ? phase : "ownPace")}
        />
      </div>
      <div className="guide-body">
        <h1 id="breathing-title" aria-live="polite">
          {running ? cues[phase].title : cues.ownPace.title}
        </h1>
        <p>{cues.ownPace.body}</p>
      </div>
      <div className="pace-controls">
        <button
          className="action-primary"
          aria-label={
            running
              ? "Pause breathing timer"
              : elapsed
                ? "Resume pacing, resume breathing timer"
                : "Try a gentle count, start breathing timer"
          }
          onClick={() => {
            setHasStarted(true);
            setRunning((v) => !v);
          }}
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? "Pause" : elapsed ? "Resume pacing" : "Try a gentle count"}
          {running && (
            <span className="pace-beat" aria-hidden="true">
              {remaining}
            </span>
          )}
        </button>
        {(running || elapsed > 0) && (
          <button className="text-action" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        )}
      </div>
      <div className="guide-links">
        {onSwitchGrounding && (
          <button
            className="text-action"
            onClick={() => {
              stop();
              onSwitchGrounding();
            }}
          >
            Try grounding instead <ArrowRight size={16} />
          </button>
        )}
        <button
          className="text-action"
          onClick={() => {
            stop();
            onDone();
          }}
        >
          Done
        </button>
      </div>
    </section>
  );
}
