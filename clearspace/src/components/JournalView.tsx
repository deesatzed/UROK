import { useEffect, useMemo, useState } from "react";
import { detectSafetyRoute, type SafetyRoute } from "../services/guardrails";
import type { JournalEntry } from "../types";
import { SafetyAlert } from "./SafetyAlert";

type JournalViewProps = {
  entries: JournalEntry[];
  onBackHome: () => void;
  onClearEntries: () => void;
  onDeleteEntry: (entryId: string) => void;
  onSaveEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
};

export const createJournalExportText = (entries: JournalEntry[]) =>
  JSON.stringify(
    {
      app: "ClearSpace",
      exportVersion: 1,
      entries,
    },
    null,
    2,
  );

export function JournalView({
  entries,
  onBackHome,
  onClearEntries,
  onDeleteEntry,
  onSaveEntry,
}: JournalViewProps) {
  const [trigger, setTrigger] = useState("");
  const [helped, setHelped] = useState("");
  const [clearRequested, setClearRequested] = useState(false);
  const [safetyRoute, setSafetyRoute] = useState<SafetyRoute | null>(null);
  const exportText = useMemo(() => createJournalExportText(entries), [entries]);
  const exportHref = `data:application/json;charset=utf-8,${encodeURIComponent(
    exportText,
  )}`;

  useEffect(() => {
    setClearRequested(false);
  }, [entries.length]);

  const save = () => {
    const route = detectSafetyRoute(`${trigger} ${helped}`);
    if (route) {
      setSafetyRoute(route);
      return;
    }

    onSaveEntry({
      trigger: trigger.trim(),
      helped: helped.trim(),
    });
    setTrigger("");
    setHelped("");
    onBackHome();
  };

  const clearAll = () => {
    if (!clearRequested) {
      setClearRequested(true);
      return;
    }

    onClearEntries();
    setClearRequested(false);
  };

  return (
    <section className="journal-view" aria-labelledby="journal-title">
      <div>
        <p className="eyebrow">Optional note</p>
        <h1 id="journal-title">Journal</h1>
        <p>
          You can jot down what happened, or skip this entirely. A blank note is
          fine; the goal is noticing, not judging.
        </p>
      </div>

      {safetyRoute ? <SafetyAlert route={safetyRoute} /> : null}

      <div className="journal-form">
        <label>
          <span>What may have triggered this?</span>
          <textarea
            value={trigger}
            onChange={(event) => setTrigger(event.target.value)}
          />
        </label>
        <label>
          <span>What helped?</span>
          <textarea
            value={helped}
            onChange={(event) => setHelped(event.target.value)}
          />
        </label>
        <div className="tool-actions">
          <button type="button" onClick={save}>
            Save note
          </button>
          <button type="button" onClick={onBackHome}>
            Skip
          </button>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="journal-controls" aria-labelledby="journal-data-title">
          <h2 id="journal-data-title">Your journal data</h2>
          <p>
            Export creates a local JSON file from this browser's saved notes.
            Delete controls remove notes from this browser only.
          </p>
          <div className="tool-actions journal-data-actions">
            <a
              className="secondary-button"
              href={exportHref}
              download="clearspace-journal.json"
            >
              Download journal JSON
            </a>
            <button className="danger-button" type="button" onClick={clearAll}>
              {clearRequested ? "Confirm delete all" : "Delete all notes"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="journal-history" aria-label="Journal history">
        <h2>History</h2>
        {entries.length === 0 ? (
          <p>No notes yet. You can come back after a wave has passed.</p>
        ) : (
          <div className="settings-list">
            {entries.map((entry) => (
              <article className="history-entry" key={entry.id}>
                <div className="history-entry-header">
                  <time dateTime={entry.createdAt}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label={`Delete note from ${new Date(
                      entry.createdAt,
                    ).toLocaleString()}`}
                  >
                    Delete note
                  </button>
                </div>
                {entry.trigger ? (
                  <p>
                    <strong>Trigger:</strong> {entry.trigger}
                  </p>
                ) : null}
                {entry.helped ? (
                  <p>
                    <strong>Helped:</strong> {entry.helped}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
