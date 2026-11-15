import { useEffect, useRef, type ReactNode } from "react";
import {
  BookOpen,
  House,
  LifeBuoy,
  Moon,
  NotebookPen,
  Settings,
  Sun,
  Wind,
  X,
} from "lucide-react";
import type { ViewName } from "../types";

type AppShellProps = {
  children: ReactNode;
  currentView: ViewName;
  currentViewLabel: string;
  focusMode: boolean;
  lowStimEnabled: boolean;
  onHome: () => void;
  onNavigate: (view: ViewName) => void;
  onToggleLowStim: () => void;
  onHelp: () => void;
};

const items = [
  { Icon: House, view: "home", label: "Home" },
  { Icon: BookOpen, view: "practice", label: "Practice" },
  { Icon: NotebookPen, view: "journal", label: "Journal" },
  { Icon: Settings, view: "settings", label: "Settings" },
] as const;

export function AppShell({
  children,
  currentView,
  currentViewLabel,
  focusMode,
  lowStimEnabled,
  onHome,
  onNavigate,
  onToggleLowStim,
  onHelp,
}: AppShellProps) {
  const main = useRef<HTMLElement>(null);
  const last = useRef(currentView);
  useEffect(() => {
    if (last.current !== currentView) {
      main.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
      last.current = currentView;
    }
  }, [currentView]);
  return (
    <div
      className={
        "app-frame" +
        (lowStimEnabled ? " low-stim" : "") +
        (focusMode ? " focus-mode" : "")
      }
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <button
          className="wordmark"
          type="button"
          aria-label="Go to home"
          onClick={onHome}
        >
          <Wind aria-hidden="true" />
          <span>ClearSpace</span>
        </button>
        {!focusMode && (
          <nav aria-label="Main navigation" className="site-nav">
            {items.map(({ Icon, view, label }) => (
              <button
                type="button"
                key={view}
                onClick={() => onNavigate(view)}
                aria-current={currentView === view ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        )}
        <div className="header-tools">
          <button
            aria-label="Dim screen"
            title="Dim screen"
            className="circle-control"
            type="button"
            aria-pressed={lowStimEnabled}
            onClick={onToggleLowStim}
          >
            {lowStimEnabled ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button className="help-control" type="button" onClick={onHelp}>
            <LifeBuoy size={17} aria-hidden="true" />
            Urgent help
          </button>
        </div>
      </header>
      <main
        ref={main}
        tabIndex={-1}
        className="app-shell"
        id="main-content"
        aria-label={currentViewLabel + " content"}
      >
        {focusMode && (
          <button type="button" className="exit-guide" onClick={onHome}>
            <X size={16} aria-hidden="true" />
            Exit guide
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
