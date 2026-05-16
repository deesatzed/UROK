# GOAL.md

## Ultimate Goal

Build a fun, calming, local-first personal stress-support app that helps someone at early-stress or active-stress moments move through simple, safe, evidence-informed coping steps with as little cognitive load as possible.

## Primary Objectives

| Objective | Why | Success Signal |
| --- | --- | --- |
| Immediate SOS support | A user under high stress cannot navigate menus or dense copy. | From the first screen, the user can start guided support in one obvious tap and complete a calming flow without network access. |
| Early-stress practice and prevention | The app is more useful before stress fully escalates. | The app includes practice tools for breathing, grounding, reassurance phrases, sensory toolkit prep, and light mood-shifting activities. |
| Personalization without accounts | Stress support works better when the words, contact, and tools feel personal. | Reassurance phrases, support contact, toolkit items, low-stimulation preference, and journal entries persist locally on the device. |
| Safety-first health boundaries | The app must support, not diagnose or over-reassure. | It has clear crisis guidance, configurable support contact, emergency disclaimers, and avoids medication/diagnosis claims. |
| Fun and helpful tone | A stress app should not feel clinical, punitive, or boring. | It includes gentle playful moments such as Spark Joy prompts, comforting micro-rewards, and optional character/companion ideas without blocking the SOS path. |
| Maintainable implementation | Future Codex runs need a clear, testable path. | The app is split into focused React/TypeScript modules with documented decisions, tests, and a small backlog of atomic tasks. |

## User Value

The target user is someone with high anxiety who may be scared, overstimulated, embarrassed, or racing cognitively. The app should give them a friendly place to land: one-tap grounding, paced breathing, reassuring language, sensory distraction ideas, quick access to a trusted person, and a post-episode note without judgment.

## Source Material Assessment

`prefile.md` is the primary build source. It is a single React prototype for a mobile-first app currently named `ClearSpace`, with these core features:

- one prominent home action for active support,
- SOS wizard with grounding, reassurance, muscle release, stimulation reduction, and branching into breathing or 5-4-3-2-1 grounding,
- paced breathing with visual timer, optional voice, and haptics,
- 5-4-3-2-1 grounding checklist,
- education panels about stress and stress toolkit prep,
- post-episode journaling,
- settings for custom phrases, toolkit items, voice guide, low-stimulation mode, support contact, and journal history.

`lumina` is a useful reference for architecture and patterns, not a feature spec to copy wholesale. Reusable ideas:

- local-first persistence via a `useLocalStorage` hook,
- offline fallback content for comfort/joy,
- deterministic safety and red-flag thinking before any AI layer,
- gentle ambient/check-in/Spark Joy interaction model,
- Vitest and React Testing Library setup.

`virtual-puppet-theater` is a useful reference for playful embodied interaction, animation, speech queueing, and robust browser media handling. Reusable ideas:

- expressive companion/character concepts for later optional polish,
- browser speech synthesis queueing and autoplay-unlock patterns,
- animation and gesture state-machine discipline,
- hardening patterns around media permissions, rate limits, and tests.

Do not make the initial app depend on webcam, microphone, WebSockets, Anthropic, ElevenLabs, MediaPipe, Three.js, or server infrastructure. Those are optional future experiments after the stress-support MVP is stable.

## In Scope

- Create the main stress-support app from `prefile.md` as a first-party app in this project.
- Use React, TypeScript, Vite, and a local bundled dependency workflow.
- Build mobile-first responsive screens for active stress and early-stress use.
- Implement local-only persistence for user preferences and journaling.
- Keep SOS, breathing, grounding, toolkit, reassurance, education, support contact, and journaling available offline.
- Add a gentle fun layer: offline Spark Joy content, comforting completion states, optional friendly character visuals if they do not add risk or complexity.
- Add tests for state transitions, persistence, safety copy, and core interactions.
- Maintain project-control files as source of truth.

## Out of Scope

- Medical diagnosis, treatment planning, or medication advice.
- Replacing therapy, emergency services, clinicians, or crisis lines.
- Provider dashboards, clinical triage, palliative-care workflows, or care-team data sharing from Lumina.
- AI-generated health advice in the initial MVP.
- Camera, microphone, hand tracking, or puppet theater as required features.
- Accounts, cloud sync, remote databases, analytics, or telemetry.
- Production deployment until explicitly requested.

## Assumptions

- The repo root for this effort is `/Volumes/WS4TB/UROK`.
- The user intended `prefile.md`; `prefile.dm` in the prompt is treated as a typo.
- `ClearSpace` is the provisional product name from `prefile.md`; it can be changed later.
- The main app should be built separately from the two support directories so `lumina` and `virtual-puppet-theater` remain references.
- The safest default is a local-only, no-login app with no network requirement for stress support.
- Emergency wording should be general and configurable; in the United States, the app may mention 911, but future copy should avoid assuming a region unless configured.
- Any AI, voice, or camera feature is optional and must be explicitly gated by user consent and fallback gracefully.

## Non-Goals

- Maximizing feature count before the SOS experience is excellent.
- Building a chatbot as the core support mechanism.
- Turning the app into a clinical device.
- Importing large support-code stacks before a focused MVP exists.
- Optimizing for desktop before mobile stress use cases are handled.
