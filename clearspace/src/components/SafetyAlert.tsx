import type { SafetyRoute } from "../services/guardrails";

type SafetyAlertProps = {
  route: SafetyRoute;
};

export function SafetyAlert({ route }: SafetyAlertProps) {
  return (
    <section
      className="safety-alert"
      role="alert"
      aria-labelledby="safety-alert-title"
    >
      <p className="eyebrow">Safety first</p>
      <h2 id="safety-alert-title">{route.title}</h2>
      <p>{route.body}</p>
      <strong>{route.action}</strong>
    </section>
  );
}
