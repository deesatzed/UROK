import { ArrowRight, ExternalLink } from "lucide-react";
import { SafetyNotice } from "./SafetyNotice";

const reading = [
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
  onDone: () => void;
  onBreathe: () => void;
  onGround: () => void;
  onPlan: () => void;
};
export function EducationView({ onDone, onBreathe, onGround, onPlan }: Props) {
  return (
    <section className="learn-view">
      <h1>Practice when you feel ready.</h1>
      <p className="intro">
        Try one exercise on an ordinary day. You can choose what feels workable
        before a harder moment.
      </p>
      <article>
        <h2>Notice your surroundings</h2>
        <p>
          Bring your attention to a color, a texture, or a sound. The five
          senses offer a sequence you can adapt or skip.
        </p>
        <button className="text-action" onClick={onGround}>
          Try grounding <ArrowRight size={17} />
        </button>
      </article>
      <article>
        <h2>Find a comfortable breath</h2>
        <p>
          Let air move gently, without forcing a deep breath. Some people like
          an even count. If focusing on breathing feels uncomfortable, return to
          your usual rhythm or try grounding.
        </p>
        <button className="text-action" onClick={onBreathe}>
          Try breathing <ArrowRight size={17} />
        </button>
      </article>
      <article>
        <h2>When episodes keep coming back</h2>
        <p>
          If worry about the next episode is changing where you go or what you
          do, talk with a clinician. Cognitive behavioral therapy (CBT) is an
          established treatment for panic disorder.
        </p>
      </article>
      <details className="source-links">
        <summary>About these exercises and sources</summary>
        <p>
          The counts and wording are flexible ways to practice. Which cue you
          prefer is personal. These exercises have not been tested as a
          treatment in ClearSpace.
        </p>
        {reading.map((item) => (
          <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
            {item.title} · {item.source}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        ))}
      </details>
      <SafetyNotice />
      <div className="guide-links">
        <button className="action-secondary" onClick={onPlan}>
          Set up my guide
        </button>
        <button className="text-action" onClick={onDone}>
          Back to home
        </button>
      </div>
    </section>
  );
}
