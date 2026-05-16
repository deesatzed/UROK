# PROGRESS.md

## Status Overview

Queued MVP build pass complete as of 2026-05-13.

First mitigation implementation pass complete as of 2026-05-15.

GitHub repository setup and landing page pass complete as of 2026-05-16.

GitHub Pages checkout mitigation complete as of 2026-05-16.

`redesign.md` implementation pass complete as of 2026-05-16.

`clearspace/` now contains a working local-first React/TypeScript panic-support app with:

- guided SOS flow,
- paced breathing tool,
- 5-4-3-2-1 grounding tool,
- local settings and personalization,
- local journal history,
- bounded safety/education copy,
- offline Spark Joy prompts,
- journal export/delete controls,
- deterministic local browser TTS voice guide for scripted SOS, breathing, and grounding cues,
- baseline accessibility improvements,
- redesigned local CSS shell with desktop side navigation, mobile bottom navigation, bento home cards, and calmer breathing/grounding surfaces from `redesign.md`,
- automated tests for the core flows.

The root `/Volumes/WS4TB/UROK` is now initialized as the main Git repository for `https://github.com/deesatzed/UROK.git`.

## Current Assumptions

- Repo root is `/Volumes/WS4TB/UROK`.
- Main app directory is `clearspace/`.
- Primary build source remains `prefile.md`, with `GOAL.md`, `STANDARDS.md`, `IMPLEMENT.md`, `DECISIONS.md`, `TASK_QUEUE.md`, and `REPO_MAP.md` as active project memory.
- Supporting directories `lumina/` and `virtual-puppet-theater/` are read-only references unless a future task explicitly changes that.
- The MVP must stay local-first: no account, cloud sync, telemetry, AI, camera, microphone, or required server.
- Browser TTS may use local Web Speech `speechSynthesis`; cloud TTS remains out of scope.
- Any future AI, voice, character, export, PWA, or deployment feature requires explicit privacy/safety review.
- `lumina/` and `virtual-puppet-theater/` remain local-only support references. They are ignored by the root Git repo because the `lumina` submodule URL was not publicly cloneable by GitHub Pages.
- `redesign.md` is treated as visual direction only; its runtime Tailwind CDN, Google Fonts, Material Symbols, and external image references are not production dependencies.

## Task Tracker

| Task | Status | Owner | Notes |
| --- | --- | --- | --- |
| Project initialization and recon | Done | Codex | Created the control docs and `REPO_MAP.md`; assessed `prefile.md`, `lumina/`, and `virtual-puppet-theater/`. |
| TQ-000: Confirm repository boundary and root Git strategy | Done | Codex | Root remains a non-Git planning workspace; no Git initialization performed. |
| TQ-001: Create main app scaffold | Done | Codex | Created `clearspace/` Vite React TypeScript app with npm scripts and tests. |
| TQ-002: Convert `prefile.md` into component map | Done | Codex | Added `clearspace/src/COMPONENT_MAP.md`. |
| TQ-003: Implement app shell and navigation | Done | Codex | Added `AppShell`, `HomeView`, low-stimulation toggle, and top-level routing. |
| TQ-004: Implement active SOS wizard | Done | Codex | Added guided SOS steps, stable reassurance phrase, exit paths, branch actions, and support-contact link behavior. |
| TQ-005: Implement breathing and grounding tools | Done | Codex | Added paced breathing timer and 5-4-3-2-1 grounding checklist. |
| TQ-006: Add typed local persistence | Done | Codex | Added namespaced `clearspace:` local storage hook and typed app data. |
| TQ-007: Implement settings and personalization | Done | Codex | Added persisted phrases, toolkit items, support contact, voice preference, and low-stimulation preference. |
| TQ-008: Rewrite and verify safety/education copy | Done | Codex | Added bounded, non-diagnostic education and urgent-help guidance. |
| TQ-009: Implement journal history | Done | Codex | Added local-only optional journal save/skip and history display. |
| TQ-010: Add offline fun/pre-panic tools | Done | Codex | Added Spark Joy prompts outside the critical SOS path. |
| TQ-011: Add automated tests for core flows | Done | Codex | Core flows are covered by Vitest/Testing Library tests. |
| TQ-012: Run build, tests, and responsive manual checks | Done | Codex | Build/tests passed; desktop and narrow-window guest Chrome smoke checks completed. |
| TQ-013: Accessibility audit and baseline fixes | Done | Codex | Added audit doc, skip link, named/focusable main landmark, focus-to-main on view changes, focus outlines, and narrow-layout fixes. |
| TQ-014: Journal export/delete controls | Done | Codex | Added local JSON download, per-note delete, and two-step delete-all controls. |
| Critical full-function review | Done | Codex | Created `REVIEW.md`; identified AI/TTS/STT, personalization, guardrail, storage validation, PWA, and QA gaps. |
| Mitigation plan | Done | Codex | Created `MITIGATION_PLAN.md` and `TASKS.md`; added D-016 and mapped the next full-function work into gated atomic tasks. |
| TQ-016: Scripted browser TTS voice guide | Done | Codex | Resolved dormant voice preference with local `speechSynthesis` service/hook, deterministic read/stop controls in SOS/breathing/grounding, unsupported-browser fallback, and tests. |
| TQ-018: GitHub repo setup and landing page | Done | Codex | Added root Git config, README landing surface, `docs/index.html` GitHub Pages landing page, and submodule metadata for support references. |
| TQ-019: Fix GitHub Pages checkout failure | Done | Codex | Removed support folders from root Git tracking, ignored them locally, and added `docs/.nojekyll` so Pages can deploy from `docs/`. |
| TQ-020: Implement `redesign.md` visual refresh | Done | Codex | Added redesigned shell/navigation, home bento layout, red SOS action, calm visual, grounding progress rail, updated CSS tokens, and kept existing safety/privacy behavior. |

Claude Code was not invoked in this pass because the implementation tasks were small, sequential, and directly verified locally.

## Verification

- `cd clearspace && npm run build`: passed.
- `cd clearspace && npm test`: passed, 6 test files and 31 tests.
- Redesign verification on 2026-05-16: `cd clearspace && npm test` passed, 6 test files and 31 tests; `cd clearspace && npm run build` passed; `curl -sS -I http://127.0.0.1:5173/` returned HTTP 200.
- Test note: Node prints nonfatal `ExperimentalWarning: localStorage is not available because --localstorage-file was not provided`; tests use a controlled memory storage fallback and still pass.
- Voice guide checks: automated tests cover enabled, disabled, unsupported, stop, cleanup, pause/resume service controls, and deterministic scripted SOS, breathing, and grounding reading.
- Live smoke check from the MVP pass: guest Chrome confirmed corrected home copy, dominant SOS action, SOS branch to breathing, breathing timer start/pause, and narrow-window responsive layout without visible overlap.
- Accessibility smoke check: guest Chrome accessibility tree shows the skip link and `Home content` main landmark; automated tests cover view focus and main landmark naming.
- Journal controls check: automated tests cover local JSON export link, per-entry delete, and two-click delete-all behavior.
- Dev server is serving at `http://127.0.0.1:5173/`; `curl -I` returned HTTP 200 after the latest changes.
- Repository setup: root Git repository initialized on `main` with remote `https://github.com/deesatzed/UROK.git`; initial push to `origin/main` completed.
- Pages mitigation: removed inaccessible support submodules from root Git tracking after GitHub Pages failed during checkout of `lumina`.

## Decision Links

- D-001: `prefile.md` is primary.
- D-004: build the main app separately from support directories.
- D-005: local-first offline MVP.
- D-007: defer Virtual Puppet Theater's heavy stack.
- D-008: no AI-generated health guidance in MVP.
- D-011: root remains a non-Git planning workspace; app work proceeds under `clearspace/`.
- D-012: main app uses Vite/React/TypeScript/Vitest with plain CSS.
- D-013: user data is stored only in namespaced local storage for MVP.
- D-014: journal export/delete stays local-only.
- D-015: baseline SPA accessibility affordances are part of the MVP.
- D-016: full-function expansion is gated; no live AI/STT before guardrails, privacy controls, storage validation, and fallbacks.
- D-017: use local browser Web Speech `speechSynthesis` for scripted TTS; no cloud TTS or AI-spoken health guidance.
- D-018: root Git repository uses the requested UROK remote and tracks support folders as submodules.
- D-019: support folders are local-only references, not root Git submodules, so GitHub Pages can check out the repo.
- D-020: `redesign.md` is implemented as local bundled React/CSS/lucide visual direction, not as runtime CDN dependencies.

## Current Milestone

M4: `redesign.md` visual refresh complete.

## Next Actions

1. Implement `TASKS.md` Task 2: storage schema validation and migrations.
2. Implement `TASKS.md` Task 3 before any STT/AI work: deterministic guardrail module and tests.
3. Add local focus profiles and privacy controls before optional STT.
4. Decide whether to make the first release a PWA with offline cache.
5. Decide whether to enable GitHub Pages from `docs/` for the landing page.

## Blockers

None for the local MVP.

Potential future blockers:

- User approval is required before production deployment or destructive filesystem changes.
- User approval and privacy/safety review are required before adding AI, camera, microphone, account, cloud sync, external telemetry, or generated health guidance.
- Network access or approval may be needed for future dependency installs.

## Questions For User

These are nonblocking:

- Should the final app name remain `ClearSpace`?
- Should the first release be a PWA?
- Should emergency copy be region-specific or configurable?
