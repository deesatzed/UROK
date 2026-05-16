# IMPLEMENT.md

## Recommended Agent Workflow

| Role | Responsibility |
| --- | --- |
| Orchestrator | Read project-control docs, choose the next task, keep scope tight, update progress and decisions. |
| Implementer | Make the smallest coherent code change for one task, following existing project patterns. |
| Reviewer | Check health-safety copy, privacy, accessibility, regressions, and maintainability. |
| Tester | Run automated tests and targeted manual checks, then report exact pass/fail state. |

One Codex run may perform multiple roles, but it should keep the stages explicit.

## Upfront Repository Reconnaissance

Future coding runs should begin with:

```sh
pwd
ls -la
rg --files -g 'GOAL.md' -g 'STANDARDS.md' -g 'IMPLEMENT.md' -g 'DECISIONS.md' -g 'PROGRESS.md' -g 'TASK_QUEUE.md' -g 'prefile.md' -g 'package.json'
```

Then read the project-control files and inspect the current app directory once it exists.

## Clarification Questions That Would Have Been Ideal

These are not blockers for the initial plan:

- Should the final app keep the name `ClearSpace`?
- Should the app be installable as a PWA in the first release?
- Should emergency copy assume the United States, or be fully region-configurable?
- Should any AI feature be allowed after MVP, and if so, for creative content only or also conversational support?
- Should journal data be exportable, encrypted, or automatically cleared after a retention period?
- Should voice guidance be browser speech synthesis only, or should microphone/speech recognition ever be considered?

## Architecture Decisions Needed

| Decision | Default For Now | When To Revisit |
| --- | --- | --- |
| App location | Create a separate `clearspace/` app directory under repo root. | If the user wants a different name or monorepo layout. |
| Stack | Vite + React + TypeScript + bundled CSS. | If current repo later reveals a stronger existing app scaffold. |
| Styling | Start from `prefile.md` visual intent, but implement with maintainable app CSS/design tokens rather than runtime CDN Tailwind. | If Tailwind is intentionally installed and configured. |
| Persistence | Browser local storage via a typed hook. | If encryption, export, or sync is requested. |
| AI | No AI required for MVP. Offline creative content first. | If the user explicitly wants AI-generated joy prompts or companion dialogue. |
| Puppet/character layer | Optional future polish, not core MVP. | After SOS flow, tests, privacy, and safety copy are stable. |

## Implementation Phases

### Phase 0: Project Scaffolding

- Create a new first-party app directory.
- Add Vite, React, TypeScript, lucide icons, Vitest, React Testing Library, and accessibility-friendly CSS baseline.
- Preserve `prefile.md`, `lumina`, and `virtual-puppet-theater` as references.
- Add basic build, dev, test, and preview commands.

Acceptance criteria:

- `npm run build` and `npm test` or equivalent commands exist.
- The app opens to a minimal shell with no external API dependency.
- No support source directories are modified.

### Phase 1: Convert `prefile.md` Into Maintainable UI

- Split the prototype into components:
  - app shell/navigation,
  - home,
  - SOS wizard,
  - breathing tool,
  - grounding tool,
  - education,
  - settings,
  - journal,
  - shared controls.
- Fix prototype issues while preserving intended behavior.
- Replace random phrase selection during render with stable per-step state.
- Ensure all controls have accessible names and predictable focus behavior.

Acceptance criteria:

- The active panic flow works end to end.
- Back/exit paths are clear.
- Components are small enough to test and maintain.

### Phase 2: Local Persistence And Offline Content

- Add a typed `useLocalStorage` hook modeled after Lumina's pattern.
- Persist reassurance phrases, toolkit checklist, support contact, low-stimulation setting, voice preference, and journal entries.
- Add malformed-storage fallback handling.
- Add offline Spark Joy content inspired by Lumina's offline fallback, rewritten for panic support.

Acceptance criteria:

- Reloading the page preserves user settings and journal entries.
- Corrupted local storage does not crash the app.
- SOS tools remain usable offline.

### Phase 3: Health-Safety Review And Crisis Boundaries

- Rewrite education and reassurance copy to be supportive but medically bounded.
- Add a persistent safety disclaimer in settings/education, not in a way that blocks SOS.
- Add quick contact and emergency guidance.
- Add self-harm and severe-symptom copy rules.

Acceptance criteria:

- The app does not diagnose or promise safety.
- The user can reach a configured support contact during or after SOS.
- Severe-symptom guidance is clear and conservative.

### Phase 4: Fun Helpful Layer

- Add nonblocking "Spark Joy" or "Shift My Attention" cards for pre-panic and post-panic use.
- Include short offline options: silly prompt, sensory scavenger hunt, micro-story, color hunt, gratitude/noticing prompt, comforting animation.
- Add completion feedback that feels warm without being infantilizing.

Acceptance criteria:

- Fun features are reachable outside the active SOS critical path.
- They work offline.
- They do not add accounts, API keys, or heavy runtime dependencies.

### Phase 5: Tests And Hardening

- Add unit/component tests for core state machines.
- Add persistence tests.
- Add manual viewport checks for mobile and desktop.
- Add reduced-motion and low-stimulation checks.
- Add release-readiness notes before any deploy work.

Acceptance criteria:

- Build and tests pass.
- Manual smoke flow is documented in `PROGRESS.md`.
- Known gaps are listed in `TASK_QUEUE.md`.

### Phase 6: Optional Companion Experiment

Only after MVP stability:

- Explore a lightweight friendly guide character using CSS/SVG/canvas.
- Borrow Virtual Puppet Theater's state-machine ideas, not its server/webcam stack.
- Keep any companion silent, local, and optional unless a later task explicitly adds voice.

Acceptance criteria:

- Companion can be disabled.
- SOS remains fully usable without it.
- No microphone, camera, WebSocket, or LLM dependency is introduced by default.

## Atomic Task Format

Each future task should include:

- ID:
- Goal:
- Files likely touched:
- Dependencies:
- Acceptance criteria:
- Verification commands/manual checks:
- Rollback notes:
- Documentation updates:

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Health advice becomes too absolute. | Keep copy bounded, crisis-aware, and reviewed against `STANDARDS.md`. |
| Fun layer distracts from panic support. | Keep SOS first and fun features optional. |
| Prototype stays as one large file. | Split components in Phase 1 before adding new features. |
| Local storage leaks sensitive details on shared devices. | Minimize stored fields, avoid cloud sync, consider export/delete controls in backlog. |
| Voice/camera features create privacy risk. | Exclude them from MVP; require explicit future decision. |
| Styling depends on runtime Tailwind CDN. | Use bundled CSS or install/configure Tailwind deliberately. |
| Support projects get accidentally rewritten. | Treat `lumina` and `virtual-puppet-theater` as read-only references unless a task says otherwise. |

## Open Decisions

- Final product name and app directory name.
- PWA/offline-install requirement for first release.
- Exact emergency/escalation wording and regional assumptions.
- Whether journal deletion/export is required in MVP.
- Whether to use Tailwind with a real build config or plain app CSS.
- Whether optional browser speech synthesis remains in MVP or moves to post-MVP.
