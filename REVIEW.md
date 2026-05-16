# REVIEW.md

## Review Scope

Reviewed the current `clearspace/` MVP against the user's requested full-function direction: AI connection, TTS, STT, per-user focusing/personalization, preferences, privacy, safety guardrails, and release readiness.

Primary files reviewed:

- `clearspace/src/App.tsx`
- `clearspace/src/components/SettingsView.tsx`
- `clearspace/src/components/SosWizard.tsx`
- `clearspace/src/components/JournalView.tsx`
- `clearspace/src/hooks/useLocalStorage.ts`
- `clearspace/src/data/education.ts`
- `GOAL.md`, `STANDARDS.md`, `DECISIONS.md`, `TASK_QUEUE.md`

## Summary Judgment

Needs Fixes before it can be called a full-function app.

The current app is a good local-first MVP. It is intentionally conservative and useful without accounts, network, AI, microphone, or server dependencies. That was the correct early choice for a panic-support tool. It is not yet a full-function assistant because voice features are only represented as a dormant setting, AI is intentionally not integrated, personalization is global rather than profile-aware, and guardrails are static copy rather than enforceable runtime policy.

## Why No AI Is Connected

AI is absent by design, not by accident.

- `DECISIONS.md` D-008 explicitly excludes AI-generated health guidance from the MVP.
- `GOAL.md` and `STANDARDS.md` prioritize local-first, no-account, offline panic support.
- AI would require API keys, network dependency, provider choice, request redaction, rate limiting, model behavior tests, opt-in UX, crisis escalation handling, and a policy boundary that prevents diagnosis or medical advice.
- In this domain, a weak AI integration would make the app less safe, not more complete.

AI should be added only after an AI readiness layer exists: explicit opt-in, no AI in the critical SOS path by default, offline fallback, prompt-injection resistance, red-flag routing, transcript controls, and tests for unsafe responses.

## Findings

| Severity | Category | Finding | Why It Matters | Required Fix |
|---|---|---|---|---|
| High | UX / Correctness | The `Voice guide` preference exists but does not drive any TTS behavior. See `SettingsView.tsx` lines 11 and 197-203, and `App.tsx` lines 46-49 where the preference is stored but never consumed by breathing, grounding, SOS, or education. | A user can turn on a feature that does nothing. In a panic app, false affordances reduce trust. | Either implement browser TTS for selected scripts or hide/rename the setting until implemented. |
| High | Product Scope / Safety | No AI boundary or guardrail architecture exists. | Adding AI directly inside this app would risk unsafe health guidance, privacy leaks, API-key exposure, and non-deterministic crisis behavior. | Build an AI readiness layer first: opt-in, server/proxy boundary if using paid APIs, redaction, response allowlist/refusal rules, crisis routing, audit logging policy, and tests. |
| High | Voice / Privacy | STT is absent, and there is no microphone permission UX, transcript control, or fallback. | Speech input can help during panic, but microphone access is privacy-sensitive and browser support/reliability varies. | Add STT only as optional, user-initiated input outside default SOS. Include permission copy, transcript preview, delete controls, and no-network fallback behavior. |
| High | Personalization | Personalization is device-global, not per-user or per-context. See `App.tsx` lines 41-64 where all preferences are one local state set. | A shared device can expose support contacts and journal notes. A single global profile cannot adapt to different panic triggers, sensory preferences, or user needs. | Add local profiles or a private mode, plus focus plans for pre-panic, active panic, post-panic, nighttime, public-place, and sensory-overload contexts. |
| High | Safety Guardrails | Guardrails are currently static education copy. `education.ts` lines 1-14 is good baseline copy, but there is no runtime classifier or routing for self-harm, chest pain, fainting, severe breathing trouble, or unsafe AI/STT content. | Static copy is not enough once AI, STT, or free-text assistance enters the app. | Create a deterministic guardrail module before AI/STT: red-flag phrase detection, emergency/support routing, refusal templates, and tests. |
| Medium | Privacy / Data Integrity | Local storage reads cast arbitrary JSON as trusted typed data. See `useLocalStorage.ts` lines 12-16. | Malformed but parseable data can produce bad UI states. Sensitive fields persist indefinitely on shared devices. | Add schema validation/migration, storage versioning, storage write error handling, and optional local data expiration/private mode. |
| Medium | Data Deletion | Per-entry delete happens immediately, while delete-all has a confirmation step. See `JournalView.tsx` per-entry delete flow. | Immediate single-note deletion is probably acceptable, but accidental taps on mobile are plausible. | Consider undo snackbar or confirm for individual journal deletion. |
| Medium | Release Readiness | No PWA/offline cache exists. | The app is local-first in data model, but not reliably available when offline unless it has already loaded and remains cached by the browser. | Add PWA/service worker/offline cache after deciding release target. |
| Medium | Accessibility | Baseline accessibility work is present, but no automated a11y tool, screen-reader pass, or real-device pass has run. | Panic use often overlaps with impaired attention, tremor, low vision, or voice/keyboard reliance. | Add axe/pa11y or equivalent, run real-device mobile and screen-reader QA, and record results. |
| Medium | Preferences | Preferences are too shallow for a full app: low-stim and dormant voice only. | Users need the app to adapt before panic escalates. | Add focus modes, sensory profile, preferred tool order, support scripts, "do not say" phrases, emergency region, and preferred modality. |
| Medium | AI / Privacy | Journal entries and support contact data are local-only today, but there is no policy preventing future AI calls from sending them. | Future implementation could accidentally leak sensitive local content. | Add an explicit AI data-sharing policy object and tests: default no journal/support-contact upload, user must choose what to include. |
| Low | Correctness | Toolkit item IDs still use `Date.now()` in `SettingsView.tsx` lines 47-53. | Collision risk is low but unnecessary now that journal IDs use stronger generation. | Reuse the stronger ID helper pattern for toolkit items. |

## Correctness

The current deterministic MVP works for the flows it claims to support. The main correctness gap is that the UI exposes a `Voice guide` preference that has no effect. That should be treated as a bug if the app is presented as full function.

The app also lacks durable data schema validation. `readLocalStorageValue` catches invalid JSON but accepts any parseable JSON. This is adequate for a prototype but weak for a user-owned app where stored data can outlive code changes.

## Security and Privacy

Current security posture is intentionally low-risk because there is no account, backend, telemetry, AI, microphone, camera, or sync.

That posture changes immediately if AI, TTS/STT, or cloud sync is added. Required security boundaries before AI/STT:

- no API keys in the browser bundle,
- explicit opt-in before any network AI call,
- local-only default for journal/support-contact data,
- redaction and "include this data" controls,
- no silent microphone activation,
- transcript preview and deletion,
- no AI in emergency routing,
- crisis/red-flag paths remain deterministic.

## Tests

Existing tests cover core flows, local storage, safety copy, journal export/delete, and accessibility landmarks. Missing test classes for a full-function app:

- TTS queue start/pause/stop and cleanup on navigation.
- STT permission-denied, unavailable, timeout, transcript delete, and fallback behavior.
- AI guardrail refusals and emergency escalation.
- Redaction tests proving journal/support contact data is not sent by default.
- Profile/focus-mode persistence and migration tests.
- PWA/offline cache smoke tests.
- Automated accessibility tests.

## Maintainability

The codebase is clean and small. It should not absorb AI directly into `App.tsx` or individual components. Before adding AI/TTS/STT, introduce clear modules:

- `services/speechSynthesis.ts`
- `services/speechRecognition.ts`
- `services/guardrails.ts`
- `services/aiClient.ts` or `services/aiProxyClient.ts`
- `data/focusPlans.ts`
- `hooks/useUserProfile.ts`
- `hooks/useSpeechGuide.ts`

The first AI-related implementation should be an interface and mocked tests, not a live provider call.

## Performance

The app remains lightweight. TTS using browser speech synthesis can stay light. STT and AI may introduce latency, permissions friction, and network failure modes. Any voice/AI feature needs:

- explicit loading and fallback states,
- no dependency in the SOS path,
- cleanup on view changes,
- battery/network failure behavior,
- rate limits if network AI is used.

## UI/UX Impact

For active panic, the current app is intentionally simple. That is good. A "full function" version should not turn the home screen into a dashboard.

Recommended UX model:

- Keep SOS deterministic and available offline.
- Put AI behind a "Coach me gently" or "Help me choose" secondary path.
- Put STT behind a clear "Speak a note" or "Tell me what is happening" control, never always-listening.
- Put TTS in SOS/breathing/grounding as a toggle with stop/pause visible.
- Add focus modes that change default copy and tool order without hiding the SOS button.

## Regression Risk

Highest regression risks:

- AI or STT makes the panic path slower.
- Voice output becomes intrusive or hard to stop.
- Network failures break support flows.
- Local sensitive data leaks through AI calls.
- Too many settings increase cognitive load.
- Guardrails become model-dependent instead of deterministic.

## Scope Creep Check

AI, TTS, STT, profiles, and full personalization are not small polish items. They define a new phase. The right sequence is:

1. Fix the misleading dormant voice preference.
2. Add deterministic guardrails and policy tests.
3. Add browser TTS for scripted existing content.
4. Add richer local focus profiles and preferences.
5. Add optional STT for notes or tool selection.
6. Add AI only after guardrails, redaction, and provider architecture are done.

## Required Fixes Before Done

Required before calling this a full-function app:

1. Implement or remove the dormant `Voice guide` setting.
2. Add TTS for deterministic scripted guidance with stop/pause and cleanup.
3. Add a guardrail module with tests for urgent symptoms, self-harm, medical uncertainty, and unsafe AI/STT text.
4. Add profile/focus-mode support for user-specific coping preferences.
5. Add storage schema validation, migrations, and write-error handling.
6. Add a PWA/offline availability layer.
7. Add automated accessibility tooling and real-device QA.

Required before connecting AI:

1. Choose the AI scope: creative prompts only, tool selection, or conversational support.
2. Decide provider/API architecture and keep API keys off the client.
3. Add explicit user opt-in.
4. Add data-sharing controls and default redaction.
5. Add crisis routing that does not depend on AI.
6. Add tests for refusals, red flags, hallucinated medical advice, prompt injection, and network failure.

## Optional Improvements

- Local "panic plan" builder with preferred phrase, grounding method, support contact, and environment tips.
- Local session recap: what helped, not just journal text.
- Support-contact message templates that the user can copy manually.
- Gentle companion visual using CSS/SVG only.
- Optional browser haptics where supported, with fallback.
- Local-only streaks or "tools practiced" stats, avoiding shame language.

