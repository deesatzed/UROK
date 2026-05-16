import { educationSections } from "../data/education";
import { SafetyNotice } from "./SafetyNotice";

type EducationViewProps = {
  onDone: () => void;
};

export function EducationView({ onDone }: EducationViewProps) {
  return (
    <section className="education-view" aria-labelledby="education-title">
      <div>
        <p className="eyebrow">Practice and learn</p>
        <h1 id="education-title">Understand stress support.</h1>
        <p>
          Read this when you are not in the peak of stress. During active stress,
          use the calming support button first.
        </p>
      </div>

      <div className="education-grid">
        {educationSections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <SafetyNotice />

      <button className="secondary-button" type="button" onClick={onDone}>
        Back to home
      </button>
    </section>
  );
}
