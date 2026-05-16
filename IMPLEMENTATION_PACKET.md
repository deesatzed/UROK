# IMPLEMENTATION_PACKET.md

## Task Being Attempted

Implement the first mitigation gate: resolve the dormant `Voice guide` preference by adding deterministic browser TTS for scripted guidance.

This covers:

- `TASKS.md` Task 1 (MP-001): Resolve Dormant Voice Guide Preference
- `TASKS.md` Task 4 (MP-004): Add Browser TTS Service
- `TASKS.md` Task 5 (MP-005): Wire TTS Into SOS, Breathing, And Grounding

## Actual User Goal

Proceed with the mitigation plan toward a full-function panic-support app while preserving the safe local-first panic path.

## Files Expected To Change

| File | Expected Change | Risk |
|---|---|---|
| `clearspace/src/services/speechSynthesis.ts` | New browser TTS service with support detection, speak/pause/resume/stop, and callbacks. | Medium |
| `clearspace/src/hooks/useSpeechGuide.ts` | New hook for component-safe speech state and cleanup. | Medium |
| `clearspace/src/components/SosWizard.tsx` | Read scripted SOS steps when voice guide is enabled; expose read/stop controls. | Medium |
| `clearspace/src/components/BreathingTool.tsx` | Read scripted inhale/exhale guidance when active and voice guide is enabled; expose stop control. | Medium |
| `clearspace/src/components/GroundingTool.tsx` | Read scripted grounding steps when voice guide is enabled; expose stop control. | Medium |
| `clearspace/src/components/SettingsView.tsx` | Make voice setting truthfully reflect browser support. | Low |
| `clearspace/src/App.tsx` | Compose `useSpeechGuide` and pass controls into tools. | Medium |
| `clearspace/src/test/setup.ts` | Add speech synthesis mocks for deterministic tests. | Low |
| `clearspace/src/**/*.test.*` | Add service/component coverage for voice behavior and cleanup. | Medium |
| `PROGRESS.md`, `TASK_QUEUE.md`, `DECISIONS.md`, `REPO_MAP.md` | Record completed mitigation work. | Low |

## Existing Patterns To Follow

- Keep app local-first and deterministic.
- Keep active SOS simple and visible.
- Use React hooks for feature state.
- Use Vitest and React Testing Library.
- Do not add runtime server, cloud TTS, AI, microphone access, or new dependencies.

## Assumptions

- Browser Web Speech `speechSynthesis` is acceptable for this gate.
- Voice output should only read app-authored deterministic scripts.
- If a browser lacks speech synthesis, the setting should not promise working voice behavior.
- STT and AI remain blocked until guardrails/privacy foundations are implemented.

## Non-Goals For This Pass

- No STT or microphone access.
- No AI connection.
- No cloud TTS.
- No voice selection UI.
- No reading journal entries aloud.
- No PWA/offline cache work.

## Step-by-Step Plan

1. Add a small speech synthesis service with support checks and queue controls.
2. Add `useSpeechGuide` for app-level speech state and cleanup.
3. Wire voice guide into `SosWizard`, `BreathingTool`, and `GroundingTool` using deterministic text only.
4. Update settings to disable or label voice guide as unavailable when browser support is missing.
5. Add tests for service behavior, enabled/disabled app behavior, and cleanup.
6. Run tests and build.
7. Update project-control docs.

## Acceptance Criteria

- Voice guide setting is no longer dormant.
- Voice reads only scripted local guidance.
- Voice guide is optional and off by default.
- Unsupported browsers fall back cleanly.
- Speech can be stopped.
- Speech stops on view changes/unmounts.
- Tests and build pass.

## Verification Plan

- `cd clearspace && npm test`
- `cd clearspace && npm run build`
- `curl -I http://127.0.0.1:5173/` if dev server remains active.

## Rollback Plan

Remove the new speech service/hook and revert component props/UI to the previous non-voice behavior. Stored `voice-guide-enabled` local storage can remain; it is harmless if unused.

## Risks

| Risk | Mitigation |
|---|---|
| Voice becomes intrusive in panic flow | Voice remains off by default and has visible stop controls. |
| Browser TTS unsupported | Disable/label the preference and hide active controls when unsupported. |
| Speech continues after navigation | Hook cleanup and component unmount cleanup call `cancel()`. |
| Tests become dependent on browser APIs | Use deterministic test mocks. |

## Proceed / Block Decision

Proceed. This task does not require API keys, network, microphone permission, destructive action, or production deployment.
