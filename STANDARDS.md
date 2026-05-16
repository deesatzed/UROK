# STANDARDS.md

## Engineering Quality

- Use React + TypeScript with strict typing for the main app.
- Prefer small, named components and pure helper functions over a single large `App.tsx`.
- Keep the active stress path fast, deterministic, and offline-capable.
- Do not add a runtime server unless a task explicitly requires it.
- Do not copy broad code from `lumina` or `virtual-puppet-theater`; extract patterns deliberately.
- Avoid runtime CDNs for the production app. Dependencies should be installed and bundled by the app build.
- Keep edits scoped to the active task and preserve user or prior-agent changes.

## Repository Awareness

- Before coding, read `GOAL.md`, `STANDARDS.md`, `IMPLEMENT.md`, `DECISIONS.md`, `PROGRESS.md`, and `TASK_QUEUE.md`.
- Treat `prefile.md` as the primary source until a future decision supersedes it.
- Treat `lumina` and `virtual-puppet-theater` as reference projects unless a task says to modify them.
- Document any meaningful assumption in `PROGRESS.md`.
- Record architecture, safety, data, or dependency decisions in `DECISIONS.md`.

## Security And Privacy

- Default to local-only storage. Do not add accounts, telemetry, cloud sync, or external analytics.
- Do not commit API keys, credentials, PHI, secrets, or `.env` files containing secrets.
- Do not send journal entries, support contacts, or stress logs to third-party APIs by default.
- If future AI features are added, require explicit opt-in and redact unnecessary personal data.
- Camera and microphone access must be optional, user-initiated, clearly labeled, and nonessential.
- Keep support contact data on-device unless the user explicitly requests sync/export.

## Health And Safety

- The app is a support tool, not a medical device.
- Avoid absolute claims such as "you are definitely safe" when symptoms could be medical. Prefer supportive but bounded language.
- Include clear escalation guidance for new, severe, unusual, or life-threatening symptoms.
- For self-harm language, chest pain, fainting, severe breathing trouble, stroke-like symptoms, or medical uncertainty, direct the user toward emergency or trusted human support.
- Do not recommend medications, substances, or clinical interventions.
- Do not shame avoidance, stress, relapse, or incomplete exercises.

## Testing

- Add tests proportional to risk.
- Use Vitest and React Testing Library for component/state behavior if the app is Vite/React.
- Add regression tests for persistence, SOS wizard progression, breathing timer state, grounding checklist behavior, and safety/escalation copy.
- For substantial UI work, verify manually in desktop and mobile viewport sizes.
- If a dev server is needed, start it and provide the local URL after implementation tasks.
- Do not skip or delete failing tests to force a pass.

## UI/UX

- Optimize first for a user in distress: low reading load, large targets, calm pacing, and obvious exits.
- The first screen should have one dominant action for immediate help and a secondary path for practice/settings.
- Keep settings and learning content away from the active stress path.
- Support reduced motion, low stimulation, and accessible contrast.
- Use familiar icons from the existing icon library when helpful.
- Text must fit within buttons/cards on mobile and desktop.
- Avoid clutter, nested cards, unnecessary marketing sections, and decorative complexity in the active support flow.
- Fun should be gentle and optional. It must never slow access to help.

## Performance And Reliability

- SOS, breathing, grounding, support contact, and local reassurance must work offline.
- Timers should be resilient to pause/resume and component unmounts.
- Local storage parsing must tolerate missing or malformed data.
- Keep bundle size modest; defer heavy libraries unless a task justifies them.
- Avoid continuous sensors, speech recognition, or animation loops unless explicitly enabled by the user.

## Documentation

- Update `PROGRESS.md` after each meaningful task.
- Update `TASK_QUEUE.md` as tasks move from pending to done or blocked.
- Update `DECISIONS.md` when a default becomes a durable decision or is superseded.
- Keep docs concise, current, and useful to the next coding agent.

## Agent Behavior

- Make safe assumptions and continue unless blocked by credentials, destructive action, sensitive data risk, legal/compliance uncertainty, production deployment, or a material product-scope decision.
- Do not implement code during initialization-only runs.
- Use Claude Code only for bounded second-opinion work when appropriate and safe; Codex remains final decision-maker.
- Tests arbitrate disputes about behavior.

## Definition Of Done

A task is done only when:

- acceptance criteria are met,
- relevant tests or manual checks pass,
- the implementation respects privacy and health-safety boundaries,
- docs are updated when behavior or decisions changed,
- no unrelated files were rewritten,
- remaining risks or skipped checks are stated clearly.
