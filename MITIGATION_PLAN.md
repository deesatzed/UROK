# MITIGATION_PLAN.md

## Purpose

This plan mitigates the gaps found in `REVIEW.md` before turning ClearSpace from a local MVP into a full-function stress-support app with voice, richer personalization, optional STT, and optional AI.

The central rule: do not make the active SOS path dependent on network, AI, microphone, account, telemetry, or cloud sync. Full-function features must layer around the deterministic local support flow, not replace it.

## Summary Judgment

Proceed in gated phases.

The current app is safe because it is local, deterministic, and limited. The highest-risk next step is not "connect AI"; it is building the guardrails, privacy controls, storage validation, and voice behavior that would make advanced features safe enough to add.

## Non-Negotiable Guardrails

- No live AI call before explicit opt-in, data-sharing controls, redaction, refusal rules, and tests exist.
- No client-side API keys in the browser bundle.
- No AI-generated diagnosis, medication advice, emergency triage, or medical reassurance.
- No microphone access unless the user starts it directly from a clearly labeled control.
- No always-listening behavior.
- No journal entries, support contacts, or stress logs sent to third parties by default.
- SOS, breathing, grounding, support contact, and local reassurance must continue to work offline.
- AI/STT failure must degrade to deterministic local tools.
- Emergency/self-harm/severe-symptom routing must be deterministic, not model-dependent.

## Risk Register

| Risk | Current Exposure | Mitigation | Gate |
| --- | --- | --- | --- |
| Dormant voice preference reduces trust | Mitigated: setting now controls scripted local browser TTS when supported | Keep TTS deterministic, optional, and stoppable | Gate 1 |
| AI gives unsafe health guidance | Not active yet | Guardrail module, refusal templates, deterministic red-flag routing, AI tests | Gate 2 and Gate 7 |
| AI leaks local sensitive data | Not active yet | Explicit data-sharing policy, redaction, default no journal/contact upload | Gate 7 |
| STT leaks microphone/transcript data | Not active yet | User-initiated microphone UX, local transcript preview/delete, no silent upload | Gate 6 |
| Local storage accepts wrong data shape | Medium | Versioned schema validation and migrations | Gate 2 |
| One shared profile exposes sensitive data | Medium | Local profiles, session-only/private mode, auto-clear options | Gate 4 |
| App unavailable offline after reload | Medium | PWA/service worker offline cache | Gate 5 |
| Accessibility regressions | Medium | Automated accessibility tooling, screen-reader/real-device pass | Gate 5 |
| Feature creep buries SOS | Medium | Keep SOS first screen dominant; advanced tools secondary | All gates |

## Gate Plan

### Gate 0: Baseline Freeze

Current state:

- Local MVP is implemented.
- Build/tests pass.
- Journal export/delete and baseline accessibility fixes are present.
- No AI/STT behavior is active; scripted local browser TTS is now active only when the user enables it.

Exit criteria:

- `REVIEW.md`, `MITIGATION_PLAN.md`, and `TASKS.md` exist.
- `TASK_QUEUE.md`, `DECISIONS.md`, and `PROGRESS.md` reflect the gated mitigation path.

### Gate 1: Fix Voice Trust Gap

Objective:

Make the voice preference truthful.

Status:

- Complete as of 2026-05-15. The preference now uses local Web Speech `speechSynthesis` when supported and is disabled when unsupported.

Required outcome:

- Either remove/hide the toggle until TTS exists, or implement browser TTS for scripted guidance.
- If implemented, TTS must have start/stop/pause cleanup on view changes.
- Voice must read only deterministic app-authored scripts.

Do not:

- Use AI-generated speech text.
- Use cloud TTS.
- Add microphone access.

### Gate 2: Deterministic Safety and Data Foundations

Objective:

Create the modules that every future AI/STT path must use.

Required outcome:

- `guardrails` module detects red-flag terms and routes to emergency/trusted support copy.
- Storage schema validation and versioned migrations exist.
- Tests cover self-harm, severe symptoms, chest pain, fainting, severe breathing trouble, malformed storage, and migration.

Do not:

- Delegate red-flag routing to AI.
- Store new sensitive data without validation and deletion path.

### Gate 3: Scripted TTS Experience

Objective:

Make TTS useful for stress without increasing risk.

Status:

- Complete as of 2026-05-15 for SOS, breathing, and grounding scripted guidance. No cloud TTS, AI-generated speech, or microphone access was added.

Required outcome:

- Voice guide works in SOS, breathing, and grounding.
- User can stop speech from the active screen.
- Speech queue cleans up when navigating away.
- Reduced-stimulation and no-voice preferences are respected.

Do not:

- Read journal entries aloud by default.
- Speak unexpectedly after the user leaves a flow.

### Gate 4: Local Focus Profiles and Preferences

Objective:

Make the app adapt to the person and context while staying local.

Required outcome:

- Local profile/focus plan model.
- Context modes such as early-stress, active stress, post-stress, nighttime, public place, sensory overload.
- Preferred tool order, "do not say" phrases, sensory profile, support scripts, emergency region, modality preference.
- Profile data can be exported/deleted.

Do not:

- Require accounts.
- Sync profiles to cloud.

### Gate 5: Offline and QA Readiness

Objective:

Make the app more reliable before adding microphone or AI features.

Required outcome:

- PWA/offline cache for app shell and local content.
- Automated accessibility tooling.
- Real-device or Playwright viewport QA.
- Release-readiness checklist.

Do not:

- Deploy publicly until release checklist passes.

### Gate 6: Optional STT

Objective:

Add speech input safely for users who benefit from talking instead of typing.

Required outcome:

- STT is user-initiated and optional.
- Permission prompt is clear and calm.
- Transcript preview appears before saving or using the text.
- Transcript can be discarded.
- Permission denied/unavailable states fall back to buttons/text.
- Guardrails scan transcript before any action.

Do not:

- Always listen.
- Send transcript to AI by default.
- Use STT in the active SOS path unless it is clearly optional and nonblocking.

### Gate 7: AI Readiness Layer

Objective:

Design safe AI integration before connecting a model.

Required outcome:

- Explicit AI scope: creative prompts, tool choice, or conversational coaching.
- Provider/API architecture chosen.
- No API keys in browser bundle.
- Opt-in UX exists.
- Data-sharing controls exist.
- Redaction tests prove journal/support contact are excluded by default.
- Prompt-injection and unsafe-response tests exist.
- Offline fallback remains available.

Do not:

- Add live AI calls in the browser.
- Use AI for emergency assessment.
- Send raw journal/contact data by default.

### Gate 8: Limited AI Feature

Objective:

Add the smallest useful AI feature after all safety foundations exist.

Preferred first AI scope:

- Creative, non-health Spark Joy prompt variants, or
- tool-selection helper constrained to deterministic local options.

Required outcome:

- AI output cannot become medical advice.
- Unsafe output is refused or replaced by local fallback.
- User can disable AI.
- Network failure is calm and nonblocking.

Do not:

- Build a general mental-health chatbot as the core product.
- Let AI override deterministic SOS guidance.

## Recommended Execution Order

1. `MP-001`: Resolve dormant voice guide truthfully. Complete.
2. `MP-002`: Add storage schema validation and migrations.
3. `MP-003`: Add deterministic guardrails.
4. `MP-004`: Add scripted browser TTS service. Complete.
5. `MP-005`: Wire TTS into SOS/breathing/grounding. Complete.
6. `MP-006`: Add local focus profiles and richer preferences.
7. `MP-007`: Add privacy/private mode controls.
8. `MP-008`: Add PWA/offline cache.
9. `MP-009`: Add automated accessibility tooling and real-device QA.
10. `MP-010`: Add optional STT with transcript controls.
11. `MP-011`: Design AI readiness layer with mocked tests.
12. `MP-012`: Add limited opt-in AI feature only after readiness gates pass.

## Definition Of Full-Function Ready

ClearSpace can be called full-function only when:

- SOS remains one-tap, local, and offline.
- Voice guide works or is not shown.
- TTS has visible controls and cleanup.
- STT is optional, permissioned, previewed, deletable, and guarded.
- Local focus profiles adapt the app to user context.
- Guardrails are deterministic and tested.
- Storage is validated and migratable.
- User data can be exported/deleted.
- PWA/offline cache is present.
- Accessibility tooling and real-device QA pass.
- AI, if present, is opt-in, constrained, redacted, tested, and never responsible for crisis triage.
