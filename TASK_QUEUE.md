# TASK_QUEUE.md

## Queue Rules

- Work one atomic task at a time unless tasks are explicitly independent.
- Before coding, read all project-control files.
- Update `PROGRESS.md` and this queue after each task.
- Update `DECISIONS.md` for safety, privacy, dependency, data, deployment, or scope decisions.
- Do not modify `lumina` or `virtual-puppet-theater` unless a task explicitly says to.

## Ready Queue

| ID | Phase | Task | Priority | Status | Dependencies |
| --- | --- | --- | --- | --- | --- |
| TQ-000 | 0 | Confirm repository boundary and root Git strategy | High | Done | None |
| TQ-001 | 0 | Create main app scaffold | High | Done | None |
| TQ-002 | 1 | Convert `prefile.md` into component map | High | Done | TQ-001 |
| TQ-003 | 1 | Implement app shell and navigation | High | Done | TQ-002 |
| TQ-004 | 1 | Implement active SOS wizard | High | Done | TQ-003 |
| TQ-005 | 1 | Implement breathing and grounding tools | High | Done | TQ-003 |
| TQ-006 | 2 | Add typed local persistence | High | Done | TQ-003 |
| TQ-007 | 2 | Implement settings and personalization | High | Done | TQ-006 |
| TQ-008 | 3 | Rewrite and verify safety/education copy | High | Done | TQ-004 |
| TQ-009 | 2 | Implement journal history | Medium | Done | TQ-006 |
| TQ-010 | 4 | Add offline fun/early-stress tools | Medium | Done | TQ-006 |
| TQ-011 | 5 | Add automated tests for core flows | High | Done | TQ-004, TQ-005, TQ-006 |
| TQ-012 | 5 | Run build, tests, and responsive manual checks | High | Done | TQ-011 |
| TQ-013 | 6 | Accessibility audit and baseline fixes | High | Done | TQ-012 |
| TQ-014 | 6 | Add journal export/delete controls | Medium | Done | TQ-009 |
| TQ-015 | 7 | Create full-function mitigation plan | High | Done | REVIEW.md |
| TQ-016 | 8 | Add scripted browser TTS voice guide | High | Done | TQ-015 |
| TQ-017 | 8 | Add storage schema validation and migrations | High | Done | TQ-016 |
| TQ-018 | 9 | Initialize GitHub repo and create landing page | High | Done | User request |
| TQ-019 | 9 | Fix GitHub Pages checkout failure | High | Done | TQ-018 |
| TQ-020 | 10 | Implement `redesign.md` visual refresh | High | Done | User request |
| TQ-021 | 11 | Implement UX theory mitigations | High | Done | User `/goal` |
| TQ-022 | 12 | Replace user-facing stronger symptom labels with stress language and clarify AI/TTS/STT status | High | Done | User request |
| TQ-023 | 13 | Expand deterministic guardrails before AI/STT | High | Ready | TQ-017 |

The MVP queue, first mitigation voice-guide pass, storage validation pass, GitHub Pages mitigation, `redesign.md` visual refresh, UX theory mitigation pass, and stress-language UX correction are complete. The next unblocked task is TQ-023: expand deterministic guardrails before any STT/AI work.

## Task Details

### TQ-000: Confirm Repository Boundary And Root Git Strategy

- Goal: Make the working boundary explicit before substantial build work.
- Likely files: `PROGRESS.md`, possibly `DECISIONS.md`.
- Status: Done.
- Outcome: Root remains a non-Git planning workspace for now; app work proceeds under `clearspace/`. `git status --short` at root fails with "not a git repository", and no Git initialization was performed.
- Acceptance criteria:
  - Future agent documents whether `/Volumes/WS4TB/UROK` should remain a non-Git planning workspace or become the Git root for the new app.
  - If Git initialization is desired, user approval is obtained before creating or moving repository state.
  - Existing standalone support repos remain untouched.
- Verification:
  - `git status --short` behavior is documented for the chosen root.
- Rollback:
  - Documentation-only if no Git changes are made.

### TQ-001: Create Main App Scaffold

- Goal: Create a first-party React/TypeScript app, preferably in `clearspace/`.
- Likely files: `clearspace/package.json`, `clearspace/src/*`, `clearspace/index.html`, config files.
- Status: Done.
- Outcome: Created `clearspace/` Vite React TypeScript scaffold with build/test scripts, local CSS, one smoke test, bundled dependencies, and no API/media/server dependency.
- Acceptance criteria:
  - App has `dev`, `build`, `preview`, and `test` scripts.
  - App renders a minimal placeholder without external API keys.
  - No source files inside `lumina` or `virtual-puppet-theater` are modified.
  - Scaffold does not depend on runtime CDNs, camera, microphone, AI APIs, or a server.
- Verification:
  - Install dependencies if needed.
  - Run build and initial test command.
- Rollback:
  - Remove only the newly created app directory if scaffold is wrong.

### TQ-002: Convert `prefile.md` Into Component Map

- Goal: Create an implementation map from prototype sections to real components before moving code.
- Likely files: `clearspace/src` planning comments or docs, `PROGRESS.md`.
- Status: Done.
- Outcome: Created `clearspace/src/COMPONENT_MAP.md` with target components, data modules, state ownership, and known prototype fixes.
- Acceptance criteria:
  - Components and shared types are named.
  - State ownership is clear.
  - Known prototype fixes are listed.
- Verification:
  - No runtime verification required if no app behavior changes.

### TQ-003: Implement App Shell And Navigation

- Goal: Build the mobile-first shell, top-level views, and home screen.
- Likely files: `App.tsx`, `components/AppShell.tsx`, `components/HomeView.tsx`, styles.
- Status: Done.
- Outcome: Split the scaffold into `AppShell` and `HomeView`, added placeholder view routing, secondary Practice/Settings paths, and a low-stimulation toggle.
- Acceptance criteria:
  - First screen has one dominant SOS action.
  - Practice/settings are secondary and not confusing.
  - Low-stimulation state can be represented in the shell.
- Verification:
  - Manual desktop and mobile viewport check.

### TQ-004: Implement Active SOS Wizard

- Goal: Implement the guided stress support flow from `prefile.md`.
- Likely files: `components/SosWizard.tsx`, `data/reassurance.ts`, tests.
- Status: Done.
- Outcome: Added `SosWizard`, default reassurance data, branch wiring, exit controls, and tests for progression/support-contact behavior.
- Acceptance criteria:
  - Steps progress predictably.
  - Random reassurance phrase is stable for the current step/session.
  - User can exit to journal or home.
  - Support contact link appears only when configured.
- Verification:
  - Component test for step progression and branch buttons.

### TQ-005: Implement Breathing And Grounding Tools

- Goal: Build paced breathing and 5-4-3-2-1 grounding as separate tools.
- Likely files: `components/BreathingTool.tsx`, `components/GroundingTool.tsx`, tests.
- Status: Done.
- Outcome: Added `BreathingTool`, `GroundingTool`, grounding data, app routing, and tests for breathing timer controls and grounding step advancement.
- Acceptance criteria:
  - Breathing timer can start, pause, resume, and clean up timers.
  - Grounding checklist advances only when current step is complete.
  - Reduced-motion and low-stimulation modes remain usable.
- Verification:
  - Timer and checklist tests.
  - Manual mobile viewport check.

### TQ-006: Add Typed Local Persistence

- Goal: Add robust local storage persistence modeled after Lumina's `useLocalStorage` pattern.
- Likely files: `hooks/useLocalStorage.ts`, `types.ts`, tests.
- Status: Done.
- Outcome: Added namespaced typed local storage helpers/hook, app data types, and tests for namespacing, malformed JSON fallback, persistence, and functional updates.
- Acceptance criteria:
  - Preferences and user content persist across reloads.
  - Malformed local storage falls back safely.
  - Stored keys are namespaced to this app.
- Verification:
  - Hook tests for read/write/fallback behavior.

### TQ-007: Implement Settings And Personalization

- Goal: Build settings for reassurance phrases, toolkit, support contact, voice toggle, and low-stimulation preference.
- Likely files: `components/SettingsView.tsx`, shared form controls, tests.
- Status: Done.
- Outcome: Added persisted settings for phrases, toolkit items, support contact, voice preference, and low-stimulation preference, with integration tests.
- Acceptance criteria:
  - User can add/remove phrases and toolkit items.
  - User can configure/delete support contact.
  - Preferences persist locally.
  - No settings path blocks SOS.
- Verification:
  - Component tests for add/remove/toggle flows.

### TQ-008: Rewrite And Verify Safety/Education Copy

- Goal: Make stress education helpful, safe, bounded, and non-diagnostic.
- Likely files: `data/education.ts`, `components/EducationView.tsx`, `components/SafetyNotice.tsx`.
- Status: Done.
- Outcome: Added bounded education content, `EducationView`, and reusable `SafetyNotice`, with tests asserting urgent-help and non-diagnostic copy.
- Acceptance criteria:
  - Copy avoids diagnosis and absolute medical reassurance.
  - Severe/new/unusual symptoms point to emergency or trusted human support.
  - Disclaimers are visible but not stress-path blockers.
- Verification:
  - Reviewer pass against `STANDARDS.md`.

### TQ-009: Implement Journal History

- Goal: Add optional post-episode journaling and review.
- Likely files: `components/JournalView.tsx`, `types.ts`, tests.
- Status: Done.
- Outcome: Added local-only `JournalView`, SOS journal exit wiring, persisted journal entries, calm empty state, and integration tests.
- Acceptance criteria:
  - User can save or skip.
  - Entries are local-only and timestamped.
  - Empty state is calm and nonjudgmental.
- Verification:
  - Component and persistence tests.

### TQ-010: Add Offline Fun/Pre-Stress Tools

- Goal: Add gentle playful support inspired by Lumina's Spark Joy and Virtual Puppet Theater's embodied fun, without heavy dependencies.
- Likely files: `data/joy.ts`, `components/SparkJoyView.tsx`, `components/PracticeView.tsx`.
- Status: Done.
- Outcome: Added offline `SparkJoyView`, local prompt data, home navigation, and tests confirming it stays outside the SOS path.
- Acceptance criteria:
  - Content works offline.
  - Fun tools are optional and outside the critical SOS path.
  - No AI, microphone, camera, WebSocket, or server requirement.
- Verification:
  - Manual UX check and simple component tests.

### TQ-011: Add Automated Tests For Core Flows

- Goal: Cover the highest-risk user flows.
- Likely files: `*.test.tsx`, test setup.
- Status: Done.
- Outcome: Test suite now covers SOS progression, breathing timer controls and cleanup, grounding advancement, local storage fallback, settings persistence, journal save/skip, safety copy, and offline fun prompts.
- Acceptance criteria:
  - Tests cover SOS progression, breathing timer cleanup, grounding checklist, local storage fallback, settings persistence, and journal save/skip.
  - Tests are deterministic.
- Verification:
  - Run test suite.

### TQ-012: Run Build, Tests, And Responsive Manual Checks

- Goal: Validate the MVP implementation before handoff.
- Likely files: `PROGRESS.md`, maybe screenshots or notes.
- Status: Done.
- Outcome: Build and test commands passed; live guest Chrome smoke checks confirmed the corrected home screen, SOS flow into breathing, breathing timer controls, and narrow-window responsive layout. A stale home-screen placeholder line was found during smoke testing and corrected.
- Acceptance criteria:
  - Build passes.
  - Tests pass.
  - Manual checks cover mobile and desktop.
  - Known gaps are documented.
- Verification:
  - `cd clearspace && npm run build`: passed.
  - `cd clearspace && npm test`: passed, 5 test files and 20 tests.
  - Guest Chrome desktop smoke: home screen, SOS branch, and breathing timer usable.
  - Guest Chrome narrow-window smoke: layout reflowed without visible overlap and kept the primary SOS action visible.
  - Dev server restarted at `http://127.0.0.1:5173/`; `curl -I` returned HTTP 200.
- Known gaps:
  - No real-device mobile browser pass has been run yet.
  - Vitest prints nonfatal Node localStorage experimental warnings.

### TQ-013: Accessibility Audit And Baseline Fixes

- Goal: Improve release readiness for keyboard and assistive-technology use.
- Likely files: `clearspace/src/components/AppShell.tsx`, `clearspace/src/styles.css`, tests, audit notes.
- Status: Done.
- Outcome: Added `clearspace/ACCESSIBILITY_AUDIT.md`, a skip link, named/focusable main landmark, focus-to-main behavior on view changes, visible focus styles, and narrow-layout fixes for tool and journal controls.
- Acceptance criteria:
  - Main content has a landmark and accessible name.
  - Keyboard users can skip past header controls.
  - Focus movement after view changes is predictable.
  - Residual accessibility gaps are documented.
- Verification:
  - `cd clearspace && npm test`: passed, 5 test files and 20 tests.
  - `cd clearspace && npm run build`: passed.
  - Guest Chrome accessibility tree showed `Skip to main content` and `Home content`.
- Known gaps:
  - No automated axe/pa11y audit yet.
  - No screen-reader or real-device pass yet.

### TQ-014: Add Journal Export/Delete Controls

- Goal: Give users local control over sensitive journal data.
- Likely files: `clearspace/src/components/JournalView.tsx`, `clearspace/src/App.tsx`, tests, styles.
- Status: Done.
- Outcome: Added a local JSON download link, per-entry delete buttons, and a two-click delete-all flow. Journal entry IDs now use `crypto.randomUUID()` when available with a fallback to avoid collisions.
- Acceptance criteria:
  - Journal export does not require a server, account, clipboard, or third-party API.
  - Users can delete one note.
  - Users can delete all notes with a confirmation step.
  - Tests cover export and delete behavior.
- Verification:
  - `cd clearspace && npm test`: passed, 5 test files and 20 tests.
  - `cd clearspace && npm run build`: passed.

### TQ-015: Create Full-Function Mitigation Plan

- Goal: Convert `REVIEW.md` findings into a gated execution plan for AI, TTS, STT, personalization, preferences, guardrails, and release readiness.
- Likely files: `MITIGATION_PLAN.md`, `TASKS.md`, `PROGRESS.md`, `DECISIONS.md`, `TASK_QUEUE.md`.
- Status: Done.
- Outcome: Added `MITIGATION_PLAN.md` with risk register and phase gates, added `TASKS.md` with atomic Codex-sized mitigation tasks, and logged D-016.
- Acceptance criteria:
  - Risks from the review are mapped to mitigations.
  - AI/STT prerequisites are explicit.
  - Tasks are small enough for future focused Codex runs.
  - Project-control docs reflect the new plan.
- Verification:
  - Documentation-only; no build required.

### TQ-016: Add Scripted Browser TTS Voice Guide

- Goal: Resolve the dormant voice-guide preference and add deterministic local browser TTS for core tools.
- Likely files: `clearspace/src/services/speechSynthesis.ts`, `clearspace/src/hooks/useSpeechGuide.ts`, `clearspace/src/components/SosWizard.tsx`, `clearspace/src/components/BreathingTool.tsx`, `clearspace/src/components/GroundingTool.tsx`, `clearspace/src/components/SettingsView.tsx`, `clearspace/src/App.tsx`, tests.
- Status: Done.
- Outcome: Added a local Web Speech `speechSynthesis` service and `useSpeechGuide` hook, disabled the preference when unsupported, and wired scripted read/stop controls into SOS, breathing, and grounding without adding AI, STT, microphone access, cloud TTS, or a server.
- Acceptance criteria:
  - No visible voice setting promises inactive behavior.
  - Missing browser speech support falls back gracefully.
  - Speech can start, pause, resume, and stop.
  - Voice guide reads SOS, breathing, and grounding guidance only when enabled.
  - Speech stops on explicit stop and view changes.
  - Tests cover enabled, disabled, unsupported, and cleanup behavior.
- Verification:
  - `cd clearspace && npm test`: passed, 6 test files and 31 tests.
  - `cd clearspace && npm run build`: passed.
  - `curl -sS -I http://127.0.0.1:5173/`: HTTP 200.
- Rollback:
  - Remove the speech service/hook and revert component speech props/UI; stored `voice-guide-enabled` data can remain harmlessly.

### TQ-017: Add Storage Schema Validation And Migrations

- Goal: Prevent malformed but parseable local storage from creating broken UI states.
- Likely files: `clearspace/src/hooks/useLocalStorage.ts`, `clearspace/src/storage/*`, `clearspace/src/types.ts`, tests.
- Status: Done.
- Outcome: Added generic local-storage validator/migrator options, safe write-failure handling, concrete app storage validators, and a legacy toolkit text-array migration.
- Acceptance criteria:
  - Wrong-shape data falls back or migrates safely.
  - Existing valid data remains readable.
  - Storage write failures are handled without crashing the UI.
  - Tests cover invalid JSON, wrong shapes, missing fields, and migration.
- Verification:
  - `cd clearspace && npm test`: passed, 7 test files and 46 tests.
  - `cd clearspace && npm run build`: passed.
- Rollback:
  - Keep previous `clearspace:` keys readable; revert validators without deleting user data.

### TQ-018: Initialize GitHub Repo And Create Landing Page

- Goal: Commit and push the current project to `https://github.com/deesatzed/UROK.git` and add a lightweight landing surface.
- Likely files: `.gitignore`, `.gitmodules`, `README.md`, `docs/index.html`, `PROGRESS.md`, `DECISIONS.md`, `REPO_MAP.md`, `TASK_QUEUE.md`.
- Status: Done.
- Outcome: Root repository initialized on `main`, remote set to the requested GitHub URL, support repos represented as submodules, and landing page added under `docs/index.html`.
- Acceptance criteria:
  - Root Git repository exists on `main`.
  - Remote `origin` points at `https://github.com/deesatzed/UROK.git`.
  - Local build/test still pass.
  - Landing page exists without adding external runtime dependencies.
  - Initial commit is pushed.
- Verification:
  - `git status --short`
  - `git remote -v`
  - `cd clearspace && npm test`
  - `cd clearspace && npm run build`
  - `git push -u origin main`
- Rollback:
  - Remove the remote or Git metadata only if explicitly requested; do not delete project files.

### TQ-019: Fix GitHub Pages Checkout Failure

- Goal: Let GitHub Pages deploy from `docs/` after checkout failed on the private/missing `lumina` submodule.
- Likely files: `.gitignore`, `.gitmodules`, `docs/.nojekyll`, `PROGRESS.md`, `DECISIONS.md`, `REPO_MAP.md`, `TASK_QUEUE.md`.
- Status: Done.
- Outcome: Removed support-folder gitlinks from the root index, deleted `.gitmodules`, ignored local support folders, and added `docs/.nojekyll`.
- Acceptance criteria:
  - `git submodule status` has no root submodules.
  - Local support folders remain on disk but are not tracked by root Git.
  - GitHub Pages can check out the repo without cloning support references.
- Verification:
  - `git status --short`
  - `git submodule status`
  - `git push`
- Rollback:
  - Re-add submodules only if their URLs are public/access-controlled correctly and Pages checkout can clone them.

### TQ-020: Implement `redesign.md` Visual Refresh

- Goal: Translate the supplied ClearSpace redesign mockups into the existing local-first React app without adding runtime CDN, external font, Material Symbols, or remote image dependencies.
- Likely files: `redesign.md`, `clearspace/src/App.tsx`, `clearspace/src/components/AppShell.tsx`, `clearspace/src/components/HomeView.tsx`, `clearspace/src/components/GroundingTool.tsx`, `clearspace/src/styles.css`, tests, project-control docs.
- Status: Done.
- Outcome: Added desktop side navigation, mobile bottom navigation, redesigned home hero/bento cards, red SOS treatment, calm visual, grounding progress rail, local design tokens, and updated tests for the new home headline.
- Acceptance criteria:
  - Existing stress-support flows still work.
  - No new network/CDN/runtime service dependency is added.
  - Existing safety, local storage, and voice guide behavior remains intact.
  - Build and tests pass.
- Verification:
  - `cd clearspace && npm test`: passed, 6 test files and 31 tests.
  - `cd clearspace && npm run build`: passed.
  - `curl -sS -I http://127.0.0.1:5173/`: HTTP 200.
- Rollback:
  - Revert the redesign component/CSS/test changes and keep `redesign.md` as a reference input.

### TQ-021: Implement UX Theory Mitigations

- Goal: Reduce ClearSpace UX risks around active-stress choice overload, repeated-use staleness, shallow personalization, breathing backfire, safety-behavior reinforcement, unproven effectiveness, and crisis ambiguity.
- Likely files: `clearspace/UX_MITIGATION_AUDIT.md`, `clearspace/src/App.tsx`, `clearspace/src/types.ts`, `clearspace/src/components/*`, `clearspace/src/data/focusProfiles.ts`, `clearspace/src/services/guardrails.ts`, tests, styles, project-control docs.
- Status: Done.
- Outcome: Added SOS focus mode, breathing-to-grounding escape, local focus profiles/tool ordering, optional post-tool check-ins saved to local storage, deterministic journal red-flag routing, and audit notes.
- Acceptance criteria:
  - SOS mode hides shell navigation shortcuts during active support.
  - Breathing can switch to grounding if it feels uncomfortable.
  - Optional check-ins are stored locally and are not required.
  - Focus profile context changes tool suggestions without hiding SOS.
  - Red-flag free text routes to deterministic urgent support guidance instead of ordinary journaling.
- Verification:
  - `cd clearspace && npm test`: passed, 6 test files and 36 tests.
  - `cd clearspace && npm run build`: passed.
  - Desktop Chrome smoke: side navigation and home layout visible without obvious overlap.
  - Mobile-width Chrome smoke: primary SOS and secondary actions clear of bottom navigation; SOS focus mode hides shell navigation.
- Rollback:
  - Revert the TQ-021 component/data/service/test/style changes; local `support-check-ins`, `focus-profile`, and `sos-session-count` keys can remain harmlessly unused.

### TQ-022: Replace User-Facing Symptom Labels With Stress Language

- Goal: Make ClearSpace calmer for high-anxiety users by using stress-support language in product UX and public docs, while clearly stating what AI, TTS, and STT capabilities are actually present.
- Likely files: `clearspace/src/**`, `README.md`, `docs/index.html`, project-control docs.
- Status: Done.
- Outcome: User-facing app copy, public docs, and active project-control docs now use stress-support language; Settings, README, and the landing page state that AI/STT are not connected and that the only voice feature is optional scripted local browser `speechSynthesis`.
- Acceptance criteria:
  - App UI does not use stronger symptom-label product copy.
  - AI status is explicit: no live model/API connection.
  - TTS status is explicit: optional local scripted browser speech output.
  - STT status is explicit: no microphone access or speech transcription.
  - Existing SOS, breathing, grounding, settings, safety, and test behavior remain intact.
- Verification:
  - Run `cd clearspace && npm test`.
  - Run `cd clearspace && npm run build`.
  - Search app and public docs for the removed product wording.
- Rollback:
  - Revert copy-only changes if a future clinical/legal review requires different wording.

### TQ-023: Expand Deterministic Guardrails

- Goal: Extend local red-flag routing beyond the first journal integration before any STT or AI work.
- Likely files: `clearspace/src/services/guardrails.ts`, `clearspace/src/services/guardrails.test.ts`, `clearspace/src/components/*`, safety copy/docs.
- Status: Ready.
- Dependencies: TQ-017.
- Acceptance criteria:
  - Red-flag inputs route to emergency/trusted-person guidance.
  - Guardrails never depend on AI.
  - Refusal/help templates avoid diagnosis and absolute reassurance.
  - Tests cover self-harm, chest pain, fainting, severe breathing trouble, stroke-like symptoms, medical uncertainty, unsafe diagnosis/medication requests, and benign text.
- Verification:
  - `cd clearspace && npm test`
  - `cd clearspace && npm run build`
- Rollback:
  - Remove expanded guardrail categories/templates; retain existing static safety copy.

## Backlog

| ID | Task | Priority | Notes |
| --- | --- | --- | --- |
| BL-003 | Add lightweight friendly guide character | Low | Use local CSS/SVG/canvas first, not Virtual Puppet Theater stack. |
| BL-004 | Add optional voice selection and richer speech queue | Low | Basic browser TTS exists; consider Virtual Puppet Theater's speech hardening only if richer voice features stay. |
| BL-005 | Add optional AI-generated joy content | Low | Requires API/privacy decision and offline fallback. |
| BL-007 | Add release-readiness checklist | High | Required before deploy. |
| BL-008 | Run real-device or Playwright viewport visual QA | Medium | Helpful before release; current responsive check used a narrow guest Chrome window. |
| BL-009 | Add automated accessibility tooling | Medium | Consider axe/pa11y or equivalent before release. |
| BL-012 | Add guardrail module and tests | High | Required before AI or STT: red flags, self-harm, severe symptoms, refusal templates, emergency routing. |
| BL-013 | Add local focus profiles and richer preferences | High | Include preferred tool order, sensory profile, support scripts, "do not say" phrases, and context modes. |
| BL-014 | Add storage schema validation and migrations | High | Current local storage fallback handles invalid JSON but not wrong shapes or versioned migrations. |
| BL-015 | Design AI readiness layer | High | Define scope, opt-in, provider boundary, no-client-secret policy, redaction, fallback, and tests before any live AI call. |
| BL-016 | Add optional STT input experiment | Medium | User-initiated only; include permission UX, transcript preview/delete, and non-network fallback. |
| BL-017 | Add privacy/private mode controls | Medium | Consider local passcode, session-only mode, auto-clear options, and per-profile data isolation. |
| BL-018 | Add PWA install/offline cache | High | Required if release target needs reliable offline reload/install behavior. |
