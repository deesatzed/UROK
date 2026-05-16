import { HeartPulse, Settings, Sparkles, Wind } from "lucide-react";

type HomeViewProps = {
  onOpenJoy: () => void;
  onOpenPractice: () => void;
  onOpenSettings: () => void;
  onStartSos: () => void;
};

const practiceItems = [
  "Paced breathing",
  "5-4-3-2-1 grounding",
  "Personal reassurance phrases",
  "Offline comfort toolkit",
];

export function HomeView({
  onOpenJoy,
  onOpenPractice,
  onOpenSettings,
  onStartSos,
}: HomeViewProps) {
  return (
    <>
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow">Local-first panic support</p>
          <h1 id="app-title">Start with one steady step.</h1>
          <p>
            Open the guided support flow, practice a calming tool, or choose a
            small offline prompt before panic gets louder.
          </p>
        </div>

        <div className="home-actions" aria-label="Primary actions">
          <button className="sos-button" type="button" onClick={onStartSos}>
            <HeartPulse size={34} aria-hidden="true" />
            <span>
              <strong>Start Calming Support</strong>
              <small>Four simple steps, then breathing or grounding</small>
            </span>
          </button>

          <div className="secondary-actions">
            <button type="button" onClick={onOpenPractice}>
              <Wind size={18} aria-hidden="true" />
              <span>Practice</span>
            </button>
            <button type="button" onClick={onOpenJoy}>
              <Sparkles size={18} aria-hidden="true" />
              <span>Spark Joy</span>
            </button>
            <button type="button" onClick={onOpenSettings}>
              <Settings size={18} aria-hidden="true" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </section>

      <section className="status-grid" aria-label="Planned app areas">
        <article>
          <Wind size={22} aria-hidden="true" />
          <h2>Practice Tools</h2>
          <ul>
            {practiceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article>
          <Sparkles size={22} aria-hidden="true" />
          <h2>Fun, Offline Help</h2>
          <p>
            Gentle pre-panic prompts and comfort content will stay available
            without network access.
          </p>
        </article>

        <article>
          <Settings size={22} aria-hidden="true" />
          <h2>Private By Default</h2>
          <p>
            Preferences and journal notes will use local device storage, with
            support-contact setup kept out of any cloud flow.
          </p>
        </article>
      </section>
    </>
  );
}
