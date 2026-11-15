import {
  ArrowRight,
  CircleDot,
  Hand,
  SlidersHorizontal,
  Sparkles,
  Wind,
} from "lucide-react";
import { getFocusProfile } from "../data/focusProfiles";
import type { FocusProfileId, SupportCheckIn } from "../types";

type Props = {
  focusProfile: FocusProfileId;
  lastCheckIn?: SupportCheckIn;
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenJoy: () => void;
  onOpenSettings: () => void;
  onStartSos: () => void;
};

export function HomeView(props: Props) {
  const tools = {
    breathe: {
      label: "Paced breathing",
      Icon: Wind,
      open: props.onOpenBreathing,
    },
    ground: {
      label: "5-4-3-2-1 senses",
      Icon: Hand,
      open: props.onOpenGrounding,
    },
  };
  return (
    <div className="home-view">
      <section className="welcome" aria-labelledby="app-title">
        <div className="welcome-copy">
          <h1 id="app-title">
            One steady step <br />
            <em>at a time.</em>
          </h1>
          <p>Follow one small cue. Go at your own pace.</p>
          <button
            className="action-primary"
            type="button"
            onClick={props.onStartSos}
          >
            Start calming support <ArrowRight aria-hidden="true" size={21} />
          </button>
          <button
            className="text-action"
            type="button"
            onClick={props.onOpenSettings}
          >
            <SlidersHorizontal aria-hidden="true" size={17} /> Set up my guide
          </button>
        </div>
        <div className="still-water" aria-hidden="true">
          <i className="sun-disc" />
          <i className="ridge distant" />
          <i className="ridge near" />
          <i className="water" />
          <i className="reflection" />
        </div>
      </section>
      <section className="home-tools" aria-label="Support areas">
        <h2>Practice a skill</h2>
        <div className="tool-links">
          {getFocusProfile(props.focusProfile).toolOrder.map((id) => {
            const { label, Icon, open } = tools[id];
            return (
              <button key={id} onClick={open}>
                <Icon aria-hidden="true" />
                {label}
                <ArrowRight aria-hidden="true" />
              </button>
            );
          })}
          <button onClick={props.onOpenJoy}>
            <Sparkles aria-hidden="true" />
            Spark Joy
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
      {props.lastCheckIn && (
        <p className="last-entry">
          <CircleDot size={15} aria-hidden="true" /> Last check-in saved
          locally.
        </p>
      )}
    </div>
  );
}
