type SafetyNoticeProps = {
  compact?: boolean;
};

export function SafetyNotice({ compact = false }: SafetyNoticeProps) {
  return (
    <aside className={compact ? "safety-notice compact" : "safety-notice"}>
      <h2>Support tool, not medical care</h2>
      <p>
        ClearSpace does not diagnose symptoms or replace a clinician, therapist,
        crisis line, emergency service, or trusted support person.
      </p>
      {!compact ? (
        <p>
          If symptoms are new, severe, unusual, or you are unsure what is
          happening, seek urgent human help. In the United States, call 911 for
          immediate danger.
        </p>
      ) : null}
    </aside>
  );
}
