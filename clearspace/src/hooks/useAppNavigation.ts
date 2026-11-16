import { useCallback, useEffect, useState } from "react";
import type { ViewName } from "../types";

export const viewLabels: Record<ViewName, string> = {
  home: "Home",
  sos: "Calming Support",
  practice: "Practice",
  settings: "Settings",
  breathe: "Paced Breathing",
  ground: "Grounding",
  journal: "Journal",
  joy: "Spark Joy",
  checkin: "Check In",
  before: "Before an activity",
  after: "Aftercare",
  steps: "My steps",
  worry: "Working with worry",
  pattern: "My panic pattern",
};

// Each fresh visit opens Home. History within that visit stays in the application.
export function useAppNavigation(): [ViewName, (view: ViewName) => void] {
  const [view, setView] = useState<ViewName>("home");
  useEffect(() => {
    const original = history.state ?? {};
    history.replaceState({ ...original, clearspaceView: "home" }, "");
    const backOrForward = (event: PopStateEvent) => {
      const next: unknown = event.state?.clearspaceView;
      setView(
        typeof next === "string" &&
          Object.prototype.hasOwnProperty.call(viewLabels, next)
          ? (next as ViewName)
          : "home",
      );
    };
    window.addEventListener("popstate", backOrForward);
    return () => window.removeEventListener("popstate", backOrForward);
  }, []);
  const navigate = useCallback((next: ViewName) => {
    if (history.state?.clearspaceView !== next) {
      history.pushState({ ...history.state, clearspaceView: next }, "");
    }
    setView(next);
  }, []);
  return [view, navigate];
}
