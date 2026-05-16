import {
  BookOpen,
  HeartPulse,
  Settings,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";

type HomeViewProps = {
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
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
  onOpenBreathing,
  onOpenGrounding,
  onOpenJoy,
  onOpenPractice,
  onOpenSettings,
  onStartSos,
}: HomeViewProps) {
  return (
    <>
      <section className="hero-panel" aria-labelledby="app-title">
        <div className="hero-copy">
          <p className="eyebrow">Your Space / Stay grounded</p>
          <h1 id="app-title">One steady step at a time.</h1>
          <p>
            A calm, private place to land before panic gets louder. Start the
            guided support flow, practice a tool, or choose a small offline
            shift.
          </p>
        </div>

        <div className="calm-visual" aria-hidden="true">
          <div className="calm-visual-ring outer" />
          <div className="calm-visual-ring middle" />
          <div className="calm-visual-core">
            <Wind size={42} />
          </div>
        </div>

        <div className="home-actions" aria-label="Primary actions">
          <button className="sos-button" type="button" onClick={onStartSos}>
            <HeartPulse size={34} aria-hidden="true" />
            <span>
              <strong>Start Calming Support</strong>
              <small>I need support now</small>
            </span>
          </button>

          <div className="secondary-actions" aria-label="Quick routes">
            <button type="button" onClick={onOpenPractice}>
              <BookOpen size={18} aria-hidden="true" />
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

      <section className="status-grid" aria-label="Support areas">
        <button className="bento-card primary-card" type="button" onClick={onOpenBreathing}>
          <Wind size={22} aria-hidden="true" />
          <span className="card-kicker">Breathe</span>
          <h2>Paced breathing</h2>
          <p>Use a simple inhale/exhale timer with optional local voice cues.</p>
        </button>

        <button className="bento-card" type="button" onClick={onOpenGrounding}>
          <ShieldCheck size={22} aria-hidden="true" />
          <span className="card-kicker">Ground</span>
          <h2>5-4-3-2-1 senses</h2>
          <p>
            Move attention from racing thoughts into what you can see, touch,
            hear, smell, and taste.
          </p>
        </button>

        <button className="bento-card" type="button" onClick={onOpenSettings}>
          <Settings size={22} aria-hidden="true" />
          <span className="card-kicker">Toolkit</span>
          <h2>Personal setup</h2>
          <p>
            Keep reassurance phrases, support contact, and sensory tools on
            this device.
          </p>
        </button>

        <article className="bento-card quiet-card">
          <Sparkles size={22} aria-hidden="true" />
          <span className="card-kicker">Offline help</span>
          <h2>What is ready</h2>
          <ul>
            {practiceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
