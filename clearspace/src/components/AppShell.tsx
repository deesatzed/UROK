import { useEffect, useRef, type ReactNode } from "react";
import {
  BookOpen,
  Grid3X3,
  Home,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  Wind,
} from "lucide-react";
import type { ViewName } from "../types";

type AppShellProps = {
  children: ReactNode;
  currentView: ViewName;
  currentViewLabel: string;
  focusMode?: boolean;
  lowStimEnabled: boolean;
  onHome: () => void;
  onNavigate: (view: ViewName) => void;
  onToggleLowStim: () => void;
};

const navItems: Array<{
  icon: typeof Home;
  label: string;
  view: ViewName;
}> = [
  { icon: Home, label: "Home", view: "home" },
  { icon: Wind, label: "Breathe", view: "breathe" },
  { icon: ShieldCheck, label: "Ground", view: "ground" },
  { icon: Grid3X3, label: "Toolkit", view: "settings" },
  { icon: BookOpen, label: "Journal", view: "journal" },
];

export function AppShell({
  children,
  currentView,
  currentViewLabel,
  focusMode = false,
  lowStimEnabled,
  onHome,
  onNavigate,
  onToggleLowStim,
}: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    mainRef.current?.focus();
  }, [currentViewLabel]);

  return (
    <div
      className={[
        "app-frame",
        lowStimEnabled ? "low-stim" : "",
        focusMode ? "focus-mode" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="top-bar">
        <button
          className="brand-row brand-button"
          type="button"
          onClick={onHome}
          aria-label="Go to home"
        >
          <span className="brand-mark" aria-hidden="true">
            <Wind size={24} />
          </span>
          <span>
            <span className="brand-name">ClearSpace</span>
            <span className="view-label">{currentViewLabel}</span>
          </span>
        </button>

        <div className="top-bar-actions">
          {!focusMode ? (
            <button
              className="icon-button"
              type="button"
              onClick={() => onNavigate("settings")}
              aria-label="Open settings"
            >
              <Settings size={20} aria-hidden="true" />
            </button>
          ) : null}
          <button
            className="icon-text-button"
            type="button"
            onClick={onToggleLowStim}
            aria-pressed={lowStimEnabled}
          >
            {lowStimEnabled ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
            <span>{lowStimEnabled ? "Standard" : "Low Stim"}</span>
          </button>
        </div>
      </header>

      <div className="app-layout">
        {!focusMode ? (
          <aside className="side-nav" aria-label="Primary navigation">
            <div className="side-nav-heading">
              <h2>Your Space</h2>
              <p>Stay grounded</p>
            </div>
            <nav className="side-nav-list">
              {navItems.map(({ icon: Icon, label, view }) => (
                <button
                  key={view}
                  className={currentView === view ? "active" : ""}
                  type="button"
                  onClick={() => onNavigate(view)}
                  aria-current={currentView === view ? "page" : undefined}
                  aria-label={`Open ${label.toLowerCase()}`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
            <div className="offline-badge">
              <ShieldCheck size={20} aria-hidden="true" />
              <span>
                <strong>Private by default</strong>
                <small>Offline storage active</small>
              </span>
            </div>
          </aside>
        ) : null}

        <main
          ref={mainRef}
          className="app-shell"
          id="main-content"
          tabIndex={-1}
          aria-label={`${currentViewLabel} content`}
        >
          {children}
        </main>
      </div>

      {!focusMode ? (
        <nav className="bottom-nav" aria-label="Mobile navigation">
          {navItems.map(({ icon: Icon, label, view }) => (
            <button
              key={view}
              className={currentView === view ? "active" : ""}
              type="button"
              onClick={() => onNavigate(view)}
              aria-current={currentView === view ? "page" : undefined}
              aria-label={`Open ${label.toLowerCase()}`}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
