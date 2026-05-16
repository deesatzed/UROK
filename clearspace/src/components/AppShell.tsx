import { useEffect, useRef, type ReactNode } from "react";
import { Moon, Sun, Wind } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
  currentViewLabel: string;
  lowStimEnabled: boolean;
  onHome: () => void;
  onToggleLowStim: () => void;
};

export function AppShell({
  children,
  currentViewLabel,
  lowStimEnabled,
  onHome,
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
    <div className={lowStimEnabled ? "app-frame low-stim" : "app-frame"}>
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
      </header>

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
  );
}
