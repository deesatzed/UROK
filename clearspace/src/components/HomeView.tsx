import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CornerDownLeft,
  Footprints,
  SlidersHorizontal,
} from "lucide-react";
import type { SmallStep } from "../types";

type Props = {
  nextStep?: SmallStep;
  onStartSos: () => void;
  onBefore: () => void;
  onAfter: () => void;
  onPractice: () => void;
  onOpenStep: (id: string) => void;
  onOpenSettings: () => void;
};

export function HomeView({
  nextStep,
  onStartSos,
  onBefore,
  onAfter,
  onPractice,
  onOpenStep,
  onOpenSettings,
}: Props) {
  return (
    <div className="home-view moment-home">
      <section className="moment-welcome" aria-labelledby="app-title">
        <h1 id="app-title">
          One steady step
          <br /> <em>at a time.</em>
        </h1>
      </section>
      <section className="moment-choices" aria-label="Find support">
        <button className="moment-now" onClick={onStartSos}>
          <span>
            <strong>Help me through this</strong>
            <small>One simple cue. At your pace.</small>
          </span>
          <ArrowRight aria-hidden="true" size={24} />
        </button>
        <div className="moment-other">
          <button onClick={onBefore}>
            <Footprints aria-hidden="true" />
            <span>
              <strong>I’m afraid it might happen</strong>
              <small>Before something I want to do</small>
            </span>
            <ArrowUpRight aria-hidden="true" size={18} />
          </button>
          <button onClick={onAfter}>
            <CornerDownLeft aria-hidden="true" />
            <span>
              <strong>It just happened</strong>
              <small>Take a pause, then choose</small>
            </span>
            <ArrowUpRight aria-hidden="true" size={18} />
          </button>
          <button onClick={onPractice}>
            <BookOpen aria-hidden="true" />
            <span>
              <strong>I want to practice</strong>
              <small>Try something when I feel ready</small>
            </span>
            <ArrowUpRight aria-hidden="true" size={18} />
          </button>
        </div>
      </section>
      {nextStep && (
        <button className="resume-step" onClick={() => onOpenStep(nextStep.id)}>
          <span>
            <small>My saved step</small>
            <strong>{nextStep.activity}</strong>
          </span>
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      )}
      <button className="text-action home-settings" onClick={onOpenSettings}>
        <SlidersHorizontal size={16} aria-hidden="true" />
        Set up my guide
      </button>
    </div>
  );
}
