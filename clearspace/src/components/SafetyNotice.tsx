export function SafetyNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className="safety-notice">
      <h2>When you need medical help</h2>
      <p>
        New, severe, or unusual symptoms deserve medical attention. ClearSpace
        cannot tell what is causing them.
      </p>
      {!compact && (
        <p>
          For immediate danger, call 911 in the U.S. or your local emergency
          number.
        </p>
      )}
    </aside>
  );
}
