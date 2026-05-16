# ClearSpace Component Map

This map converts the planned `prefile.md` prototype behavior, as summarized in the project-control files, into the implemented React/TypeScript structure in `clearspace/`.

## Component Targets

| Component | Responsibility | Owns State | Inputs | Notes |
| --- | --- | --- | --- | --- |
| `App` | Top-level view routing and persistent app state wiring. | `currentView` only if no router is added. | None. | Keep small; delegate actual screens. |
| `AppShell` | Shared page frame, low-stimulation class, header/nav affordances. | No. | `currentView`, `lowStimEnabled`, navigation callbacks. | Must keep SOS access obvious. |
| `HomeView` | First screen with dominant SOS action and secondary practice/settings paths. | No. | Navigation callbacks. | No landing-page marketing copy. |
| `SosWizard` | Active stress guidance flow: grounding, reassurance, tension release, reduce stimulation, branch to tools. | Wizard step and stable selected phrase. | `phrases`, `supportContact`, navigation callbacks. | Random phrase must be selected once per SOS session, not during render. |
| `BreathingTool` | Paced breathing interaction with start/pause/resume and cleanup. | Timer, phase, active state. | `voiceGuideEnabled` if retained, navigation callback. | Must clean intervals on unmount. |
| `GroundingTool` | 5-4-3-2-1 grounding checklist. | Active sense step and checked items for current step. | Navigation callback. | Advance only when the current step is complete. |
| `EducationView` | Stress education, bounded safety copy, toolkit guidance. | No. | Education sections. | Must avoid diagnosis and absolute reassurance. |
| `SettingsView` | Personalization for phrases, toolkit, support contact, low-stim, voice preference. | Local form drafts only. | Persisted settings and setters. | Settings must not block active SOS path. |
| `JournalView` | Optional post-episode note capture and save/skip actions. | Current entry draft. | `addJournalEntry`, navigation callback. | Local-only, nonjudgmental copy. |
| `CheckInView` | Optional post-tool reflection on what changed and what helped. | Current check-in selections. | `addSupportCheckIn`, navigation callback. | Local-only and optional; not a clinical score. |
| `SparkJoyView` | Optional early-stress/offline fun prompts. | Current prompt index or selection. | Offline content list. | Not part of the critical SOS path. |
| `SafetyNotice` | Reusable support-tool disclaimer and escalation guidance. | No. | Optional compact/full variant. | Should be visible in education/settings, not a stress-path blocker. |
| `SafetyAlert` | Deterministic urgent-support alert when free text contains red flags. | No. | Guardrail route. | Should not diagnose; routes to emergency/trusted-human support. |

## Data Modules

| Module | Contents |
| --- | --- |
| `types.ts` | `ViewName`, `FocusProfileId`, `SupportContact`, `ToolkitItem`, `JournalEntry`, `SupportCheckIn`, `AppPreferences`. |
| `data/focusProfiles.ts` | Local context profiles and suggested tool order. |
| `data/reassurance.ts` | Default reassurance phrases. |
| `data/education.ts` | Bounded stress education and safety guidance. |
| `data/grounding.ts` | 5-4-3-2-1 grounding steps. |
| `data/joy.ts` | Offline fun/early-stress prompts. |
| `hooks/useLocalStorage.ts` | Typed, namespaced local storage with malformed-value fallback. |
| `services/guardrails.ts` | Deterministic red-flag routing for self-harm and possible medical-emergency text. |

## Current State Ownership

`App` owns or composes persisted state for:

- custom reassurance phrases,
- support contact,
- low-stimulation preference,
- voice guide preference,
- focus profile,
- toolkit items,
- journal entries,
- optional support check-ins,
- SOS session count for deterministic reassurance rotation.

Feature components should own only transient interaction state:

- SOS current step,
- breathing timer phase,
- grounding checklist progress,
- check-in selections,
- form drafts.

## Prototype Fixes Applied

- Split the single prototype file into the components above.
- Replace render-time random phrase selection with stable per-session selection.
- Move injected style strings into bundled CSS modules or app CSS.
- Avoid runtime CDN styling.
- Add accessible labels for icon-only controls.
- Keep emergency/support copy bounded and configurable.
- Keep all core tools offline-capable.
- Add tests as each state machine lands.

## Next Implementation Slice

The queued MVP implementation is complete. The next slice should be promoted from `TASK_QUEUE.md` backlog, with an accessibility audit recommended before release-oriented features.
