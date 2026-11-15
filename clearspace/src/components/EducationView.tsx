import {
  ArrowRight,
  ExternalLink,
  Footprints,
  Lightbulb,
  MessageCircle,
  Hand,
  Wind,
  Sparkles,
} from "lucide-react";
import { getFocusProfile } from "../data/focusProfiles";
import type { FocusProfileId } from "../types";
import { SafetyNotice } from "./SafetyNotice";

const reading = [
  {
    title: "Facing feared situations",
    source: "Centre for Clinical Interventions",
    url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Panic",
  },
  {
    title: "Grounding through your senses",
    source: "NHS inform",
    url: "https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/grounding-exercises",
  },
  {
    title: "Comfortable breathing",
    source: "NHS",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
  },
  {
    title: "Working with worry",
    source: "NHS",
    url: "https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/",
  },
  {
    title: "Care for recurring episodes",
    source: "NICE · CG113",
    url: "https://www.nice.org.uk/guidance/cg113/chapter/recommendations",
  },
  {
    title: "Understanding panic disorder",
    source: "NIMH",
    url: "https://www.nimh.nih.gov/health/publications/panic-disorder-when-fear-overwhelms",
  },
];
type Props = {
  focusProfile: FocusProfileId;
  onDone: () => void;
  onBreathe: () => void;
  onGround: () => void;
  onPlan: () => void;
  onSteps: () => void;
  onPattern: () => void;
  onWorry: () => void;
  onJoy: () => void;
  onJournal: () => void;
};
export function EducationView({
  focusProfile,
  onDone,
  onBreathe,
  onGround,
  onPlan,
  onSteps,
  onPattern,
  onWorry,
  onJoy,
  onJournal,
}: Props) {
  const options = [
    {
      title: "Take one small step",
      body: "Make room for something fear has been getting in the way of.",
      Icon: Footprints,
      open: onSteps,
    },
    {
      title: "Understand my pattern",
      body: "Explore a sensation, the thought that followed, and what I did next.",
      Icon: Lightbulb,
      open: onPattern,
    },
    {
      title: "Untangle a worry",
      body: "Find one action, or practice leaving a question open.",
      Icon: MessageCircle,
      open: onWorry,
    },
  ];
  return (
    <section className="learn-view">
      <div className="flow-intro">
        <h1>Practice when you feel ready.</h1>
        <p>Pick one thing that feels useful today.</p>
      </div>
      <div className="practice-options">
        {options.map(({ title, body, Icon, open }) => (
          <button key={title} onClick={open}>
            <Icon aria-hidden="true" size={22} />
            <span>
              <strong>{title}</strong>
              <small>{body}</small>
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      <section className="familiar-tools" aria-label="Support areas">
        <h2>A familiar exercise</h2>
        <div className="tool-links">
          {getFocusProfile(focusProfile).toolOrder.map((tool) =>
            tool === "breathe" ? (
              <button key={tool} onClick={onBreathe}>
                <Wind aria-hidden="true" />
                Paced breathing
              </button>
            ) : (
              <button key={tool} onClick={onGround}>
                <Hand aria-hidden="true" />
                5-4-3-2-1 senses
              </button>
            ),
          )}
          <button onClick={onJoy}>
            <Sparkles aria-hidden="true" />
            Spark Joy
          </button>
        </div>
      </section>
      <details className="source-links">
        <summary>How these practices can help</summary>
        <p>
          Cognitive behavioral therapy (CBT) helps people work with feared
          sensations, interpretations, and avoidance. These short activities can
          support reflection and practice alongside care.
        </p>
        <p>
          When trying a step, you can notice what actually happened, even if you
          still felt anxious. Over time, a therapist can help you practice using
          less reassurance or other things you have come to rely on.
        </p>
        <p>
          For exercises that deliberately bring on physical sensations, work
          from a plan agreed with a suitable clinician. Your health and
          circumstances help determine what is appropriate.
        </p>
        <p>
          These activities have not been tested as a treatment in ClearSpace.
        </p>
        {reading.map((item) => (
          <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
            {item.title} · {item.source}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        ))}
      </details>
      <details className="source-links">
        <summary>When worry keeps getting in the way</summary>
        <p>
          If fear of another episode is changing where you go, who you see, or
          how you live, a clinician can help you find care that fits. CBT is an
          established treatment for panic disorder.
        </p>
      </details>
      <div className="guide-links">
        <button className="text-action" onClick={onJournal}>
          My journal
        </button>
        <button className="text-action" onClick={onPlan}>
          Set up my guide
        </button>
        <button className="text-action" onClick={onDone}>
          Back to home
        </button>
      </div>
      <SafetyNotice />
    </section>
  );
}
