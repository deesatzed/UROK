# TASKS.md

## Task Overview

These tasks implement the mitigation path from `MITIGATION_PLAN.md` and `REVIEW.md`. Each task is intended to be small enough for one focused Codex run. Critical path tasks come first.

## Assumptions

- Main app is `clearspace/`.
- Current app remains local-first and no-account.
- AI, STT, and microphone access remain disabled until their prerequisite mitigation gates pass.
- Browser TTS should use Web Speech `speechSynthesis` first, not cloud TTS.
- Guardrails must be deterministic and tested before AI/STT free text is connected.
- Support projects remain read-only references.

## Atomic Tasks

### Task 1 (MP-001): Resolve Dormant Voice Guide Preference

**Purpose:**
Remove the current false affordance where `Voice guide` can be toggled but does nothing.

**Description:**
Either hide the toggle until TTS exists or replace it with a disabled "Voice guide coming next" control. Preferred path is to implement Task 4 and then wire the toggle to real TTS.

**Likely Files:**

- `clearspace/src/components/SettingsView.tsx`
- `clearspace/src/App.tsx`
- `clearspace/src/App.test.tsx`

**Acceptance Criteria:**

- [x] No visible setting promises inactive behavior.
- [x] Tests assert the setting is either absent/disabled or connected to TTS state.
- [x] Existing preferences continue to load without crashing.

**Completion Note (2026-05-15):**
The voice guide preference now reflects browser support and drives local scripted TTS through `useSpeechGuide`.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`

**Rollback Plan:**
Revert only the settings label/control change and keep stored `voice-guide-enabled` data untouched.

**Depends On:**
None.

**Estimated Risk:** Medium

### Task 2 (MP-002): Add Storage Schema Validation And Migrations

**Purpose:**
Prevent malformed but parseable local storage from creating broken UI states.

**Description:**
Introduce versioned validators for preferences, support contact, toolkit items, reassurance phrases, journal entries, and future profiles. Unknown or invalid shapes fall back safely and can be migrated.

**Likely Files:**

- `clearspace/src/hooks/useLocalStorage.ts`
- `clearspace/src/storage/*`
- `clearspace/src/types.ts`
- `clearspace/src/hooks/useLocalStorage.test.tsx`

**Acceptance Criteria:**

- [x] Wrong-shape data falls back or migrates safely.
- [x] Existing valid data remains readable.
- [x] Storage write failures are handled without crashing the UI.
- [x] Tests cover invalid JSON, wrong shapes, missing fields, and migration.

**Completion Note (2026-05-16):**
`useLocalStorage` now accepts per-key validators and migrators, catches write failures, and ClearSpace validates persisted preferences, contact data, focus profile, toolkit items, journal entries, check-ins, and SOS session count. Legacy toolkit text arrays migrate to typed toolkit items.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`

**Rollback Plan:**
Keep previous `clearspace:` keys readable; revert validators without deleting user data.

**Depends On:**
None.

**Estimated Risk:** High

### Task 3 (MP-003): Add Deterministic Guardrail Module

**Purpose:**
Create safety routing before free-text STT or AI enters the app.

**Description:**
Add a local guardrail module that detects red-flag categories and returns deterministic guidance/actions. Cover self-harm, chest pain, fainting, severe breathing trouble, stroke-like symptoms, medical uncertainty, and unsafe requests for diagnosis/medication.

**Likely Files:**

- `clearspace/src/services/guardrails.ts`
- `clearspace/src/services/guardrails.test.ts`
- `clearspace/src/data/education.ts`
- `clearspace/src/components/SafetyNotice.tsx`

**Acceptance Criteria:**

- [ ] Red-flag inputs route to emergency/trusted-person guidance.
- [ ] Guardrails never depend on AI.
- [ ] Refusal/help templates avoid diagnosis and absolute reassurance.
- [ ] Tests cover each red-flag class and benign text.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`

**Rollback Plan:**
Remove the new module and tests; static safety copy remains.

**Depends On:**
Task 2 preferred, but not required.

**Estimated Risk:** High

### Task 4 (MP-004): Add Browser TTS Service

**Purpose:**
Provide safe scripted text-to-speech without cloud dependency.

**Description:**
Create a small service/hook around `window.speechSynthesis`. Include feature detection, queueing, stop/pause/resume, cleanup, and testable abstraction.

**Likely Files:**

- `clearspace/src/services/speechSynthesis.ts`
- `clearspace/src/hooks/useSpeechGuide.ts`
- `clearspace/src/services/speechSynthesis.test.ts`
- `clearspace/src/test/setup.ts`

**Acceptance Criteria:**

- [x] Missing browser support falls back gracefully.
- [x] Speech can start, pause, resume, and stop.
- [x] Queue clears on cleanup.
- [x] Tests use mocks, not real browser speech.

**Completion Note (2026-05-15):**
Added a Web Speech `speechSynthesis` service, React hook, and deterministic test mocks.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`

**Rollback Plan:**
Remove service and hook; no persisted data migration needed.

**Depends On:**
Task 1.

**Estimated Risk:** Medium

### Task 5 (MP-005): Wire TTS Into SOS, Breathing, And Grounding

**Purpose:**
Make voice guidance useful in the core tools while keeping it controllable.

**Description:**
Use deterministic scripts from existing screen copy. Add visible stop control where speech can be active. Respect `voiceGuideEnabled` and cleanup on navigation.

**Likely Files:**

- `clearspace/src/App.tsx`
- `clearspace/src/components/SosWizard.tsx`
- `clearspace/src/components/BreathingTool.tsx`
- `clearspace/src/components/GroundingTool.tsx`
- `clearspace/src/App.test.tsx`

**Acceptance Criteria:**

- [x] Voice guide reads SOS steps only when enabled.
- [x] Voice guide supports breathing and grounding.
- [x] User can stop active speech.
- [x] Speech stops on view change and unmount.
- [x] Tests cover enabled, disabled, unsupported, and cleanup states.

**Completion Note (2026-05-15):**
SOS, breathing, and grounding now read app-authored scripts when voice guide is enabled and expose stop controls. No AI, STT, microphone, or cloud TTS was added.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- Manual browser smoke with TTS enabled and disabled.

**Rollback Plan:**
Disable speech wiring while keeping the TTS service for later.

**Depends On:**
Task 4.

**Estimated Risk:** High

### Task 6 (MP-006): Add Local Focus Profiles And Richer Preferences

**Purpose:**
Make support personal without accounts or cloud sync.

**Description:**
Introduce local profile/focus plan data: context mode, preferred tool order, sensory preferences, "do not say" phrases, support scripts, emergency region, and preferred modality.

**Likely Files:**

- `clearspace/src/types.ts`
- `clearspace/src/data/focusPlans.ts`
- `clearspace/src/hooks/useUserProfile.ts`
- `clearspace/src/components/SettingsView.tsx`
- `clearspace/src/App.tsx`

**Acceptance Criteria:**

- [ ] User can choose or edit a local focus profile.
- [ ] SOS still remains one-tap and dominant.
- [ ] Preferred tool order influences post-SOS branch ordering.
- [ ] Profile data persists locally and validates through storage schema.
- [ ] Tests cover persistence and profile-driven tool order.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- Manual mobile/narrow viewport settings check.

**Rollback Plan:**
Fallback to default single profile while preserving existing settings.

**Depends On:**
Task 2.

**Estimated Risk:** High

### Task 7 (MP-007): Add Privacy And Private Mode Controls

**Purpose:**
Reduce shared-device risk from local personal data.

**Description:**
Add controls for session-only mode, auto-clear journal option, profile data delete, and clear all local app data. Do not add passcode/encryption unless explicitly chosen later.

**Likely Files:**

- `clearspace/src/components/SettingsView.tsx`
- `clearspace/src/components/JournalView.tsx`
- `clearspace/src/hooks/useLocalStorage.ts`
- `clearspace/src/App.test.tsx`

**Acceptance Criteria:**

- [ ] User can clear all local ClearSpace data with confirmation.
- [ ] User can use session-only journaling or disable journal persistence.
- [ ] Export remains available before deletion.
- [ ] Tests cover clear-all and session-only behavior.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`

**Rollback Plan:**
Remove private mode UI; keep existing journal export/delete controls.

**Depends On:**
Task 2 and Task 6 preferred.

**Estimated Risk:** High

### Task 8 (MP-008): Add PWA Offline Cache

**Purpose:**
Make local-first behavior reliable after reloads and app restarts.

**Description:**
Add a service worker or Vite PWA setup to cache app shell and static local content. Keep journal/profile data in local storage only.

**Likely Files:**

- `clearspace/vite.config.ts`
- `clearspace/public/*`
- `clearspace/src/main.tsx`
- `clearspace/package.json`

**Acceptance Criteria:**

- [ ] App shell loads offline after first install/load.
- [ ] SOS, breathing, grounding, education, settings, and local data remain usable offline.
- [ ] Update behavior is documented.
- [ ] Tests or manual verification cover offline reload.

**Verification:**

- `cd clearspace && npm run build`
- Local preview/manual offline test.

**Rollback Plan:**
Disable service worker registration and remove PWA plugin/config.

**Depends On:**
Task 2 preferred.

**Estimated Risk:** Medium

### Task 9 (MP-009): Add Automated Accessibility Tooling And Real-Device QA

**Purpose:**
Prevent accessibility regressions before release.

**Description:**
Add automated accessibility checks and record manual QA for desktop, narrow viewport, and real mobile or equivalent Playwright viewport checks.

**Likely Files:**

- `clearspace/package.json`
- `clearspace/src/**/*.test.tsx`
- `clearspace/ACCESSIBILITY_AUDIT.md`
- `clearspace/tests/*`

**Acceptance Criteria:**

- [ ] Automated a11y check runs from npm script.
- [ ] Main screens pass automated scan or documented exceptions.
- [ ] Manual screen-reader or real-device notes are recorded.
- [ ] Existing tests still pass.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- New a11y script.

**Rollback Plan:**
Remove tooling config while preserving accessibility fixes.

**Depends On:**
None.

**Estimated Risk:** Medium

### Task 10 (MP-010): Add Optional STT Input Experiment

**Purpose:**
Let users speak notes or simple tool-choice input without making microphone access part of the core flow.

**Description:**
Add a browser speech recognition wrapper where available. Start with journal dictation or "tell me what is happening" as a secondary path. Transcript must be previewed and deletable before save/use.

**Likely Files:**

- `clearspace/src/services/speechRecognition.ts`
- `clearspace/src/hooks/useSpeechRecognition.ts`
- `clearspace/src/components/JournalView.tsx`
- `clearspace/src/components/SettingsView.tsx`
- tests

**Acceptance Criteria:**

- [ ] STT is user-initiated only.
- [ ] Permission denied/unavailable states are calm and nonblocking.
- [ ] Transcript preview appears before save/use.
- [ ] Transcript can be discarded.
- [ ] Guardrails scan transcript before action.
- [ ] Tests cover unavailable, denied, success, discard, and guardrail cases.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- Manual browser permission smoke.

**Rollback Plan:**
Disable STT controls and retain typed input.

**Depends On:**
Task 3.

**Estimated Risk:** High

### Task 11 (MP-011): Design AI Readiness Layer

**Purpose:**
Prepare AI safely without connecting a live model.

**Description:**
Define scope, provider boundary, client/server split, data-sharing policy, redaction behavior, prompt templates, refusal rules, mocked AI client, and tests.

**Likely Files:**

- `clearspace/src/services/aiPolicy.ts`
- `clearspace/src/services/aiClient.ts`
- `clearspace/src/services/aiRedaction.ts`
- `clearspace/src/services/*.test.ts`
- `DECISIONS.md`

**Acceptance Criteria:**

- [ ] AI scope is explicit and constrained.
- [ ] Browser bundle contains no API key path.
- [ ] Redaction excludes journal/support contact by default.
- [ ] Guardrails wrap all user input and model output.
- [ ] Tests cover refusal, redaction, prompt injection, red flags, and network failure.
- [ ] No live network AI call is made.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- Inspect built source/config for absent API keys.

**Rollback Plan:**
Remove AI readiness modules; no user-facing behavior should depend on them yet.

**Depends On:**
Task 3 and Task 6.

**Estimated Risk:** High

### Task 12 (MP-012): Add Limited Opt-In AI Feature

**Purpose:**
Add AI only after readiness gates pass, with the smallest useful scope.

**Description:**
Preferred first scope is creative non-health Spark Joy variants or tool-selection support constrained to local deterministic tools. Must require opt-in and degrade to offline content.

**Likely Files:**

- `clearspace/src/components/SparkJoyView.tsx`
- `clearspace/src/services/aiClient.ts`
- `clearspace/src/services/aiPolicy.ts`
- `clearspace/src/data/joy.ts`
- tests

**Acceptance Criteria:**

- [ ] AI is off by default.
- [ ] User explicitly opts in.
- [ ] Network/API failure falls back to offline prompts.
- [ ] AI cannot generate diagnosis, medication advice, emergency triage, or absolute reassurance.
- [ ] Tests cover unsafe response replacement and fallback.

**Verification:**

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- Manual opt-in/offline fallback smoke.

**Rollback Plan:**
Disable AI setting and use offline content only.

**Depends On:**
Task 11.

**Estimated Risk:** High
