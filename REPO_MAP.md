# REPO_MAP.md

## Project Type

`/Volumes/WS4TB/UROK` is the root Git repository and planning/build workspace for a personal panic-support web app. The implemented main app lives in `clearspace/`.

The current project contains:

- `clearspace/`: the first-party MVP app.
- `prefile.md`: primary original build/prototype source.
- project-control docs: `GOAL.md`, `STANDARDS.md`, `IMPLEMENT.md`, `DECISIONS.md`, `PROGRESS.md`, `TASK_QUEUE.md`, `REPO_MAP.md`.
- supporting reference codebases: `lumina/` and `virtual-puppet-theater/`.
- landing surface: `README.md` and `docs/index.html`.

## Current Main App Stack

`clearspace/` uses:

- React 19
- TypeScript
- Vite
- npm/package-lock
- lucide-react
- Vitest + React Testing Library
- plain CSS
- browser local storage via namespaced `clearspace:` keys
- browser Web Speech `speechSynthesis` for optional scripted local TTS
- no required server, account, AI API, camera, microphone, analytics, telemetry, or runtime CDN dependency for MVP

## Package Manager

| Area | Package Manager | Evidence |
| --- | --- | --- |
| Root workspace | None | No root `package.json`; root is a Git repo for project coordination only. |
| `clearspace/` | npm | `clearspace/package.json` and `clearspace/package-lock.json`. |
| `lumina/` | npm | `lumina/package.json` and `lumina/package-lock.json`. |
| `virtual-puppet-theater/` | Bun | `virtual-puppet-theater/package.json` scripts and `bun.lock`. |

## Commands

| Purpose | Command | Verified |
| --- | --- | --- |
| Main app dev | `cd clearspace && npm run dev -- --host 127.0.0.1` | Verified; server at `http://127.0.0.1:5173/`, HTTP 200. |
| Main app build | `cd clearspace && npm run build` | Passed. |
| Main app tests | `cd clearspace && npm test` | Passed: 6 test files, 31 tests. |
| Main app preview | `cd clearspace && npm run preview` | Not run. |
| Root Git status | `git status --short` | Root Git repository initialized on `main`. |
| Lumina dev/build | `cd lumina && npm run dev` / `npm run build` | Not run; reference only. |
| Virtual Puppet Theater dev/build/test | `cd virtual-puppet-theater && bun run dev` / `bun run build` / `bun test` | Not run; reference only. |

## Entry Points

Main app:

- `clearspace/index.html`
- `clearspace/src/main.tsx`
- `clearspace/src/App.tsx`
- `clearspace/src/styles.css`

Main app planning map:

- `clearspace/src/COMPONENT_MAP.md`
- `clearspace/ACCESSIBILITY_AUDIT.md`

Public landing:

- `README.md`
- `docs/index.html`

Primary build-direction entry point:

- `prefile.md`

Agent/workflow entry point:

- `codex_dual_agent_build_pack/AGENTS.md`

Git remote:

- `origin`: `https://github.com/deesatzed/UROK.git`

Reference app entry points:

- `lumina/index.html`, `lumina/index.tsx`, `lumina/App.tsx`
- `virtual-puppet-theater/index.html`, `virtual-puppet-theater/src/main.ts`, `virtual-puppet-theater/server/index.ts`

## Main App Structure

| Path | Role |
| --- | --- |
| `clearspace/src/App.tsx` | View router and app-level state coordinator. |
| `clearspace/src/types.ts` | Shared app types for views, storage-backed data, support contact, toolkit, and journal entries. |
| `clearspace/src/components/AppShell.tsx` | Shared frame, brand/home control, and low-stimulation toggle. |
| `clearspace/src/components/HomeView.tsx` | First screen with dominant SOS action and secondary Practice/Spark Joy/Settings paths. |
| `clearspace/src/components/SosWizard.tsx` | Active guided SOS flow and branch to breathing or grounding. |
| `clearspace/src/components/BreathingTool.tsx` | Paced breathing timer. |
| `clearspace/src/components/GroundingTool.tsx` | 5-4-3-2-1 grounding checklist. |
| `clearspace/src/components/EducationView.tsx` | Panic-support education copy. |
| `clearspace/src/components/SafetyNotice.tsx` | Reusable bounded safety guidance. |
| `clearspace/src/components/SettingsView.tsx` | Local personalization settings. |
| `clearspace/src/components/JournalView.tsx` | Optional local journal save/skip and history display. |
| `clearspace/ACCESSIBILITY_AUDIT.md` | Current accessibility audit notes, fixes, and remaining gaps. |
| `clearspace/src/components/SparkJoyView.tsx` | Offline fun/pre-panic prompts. |
| `clearspace/src/data/*.ts` | Default copy/content for education, grounding, joy, reassurance, and toolkit. |
| `clearspace/src/hooks/useLocalStorage.ts` | Typed namespaced local storage hook. |
| `clearspace/src/hooks/useSpeechGuide.ts` | React wrapper for optional voice-guide status and cleanup. |
| `clearspace/src/services/speechSynthesis.ts` | Local Web Speech service for scripted TTS support detection, speak, pause, resume, and stop. |
| `clearspace/src/**/*.test.tsx` | Component/integration tests. |
| `clearspace/src/services/speechSynthesis.test.ts` | Speech service tests with deterministic browser API mocks. |

## Supporting Examples

`lumina/` remains useful for:

- localStorage hook patterns,
- offline fallback content,
- Vite/Vitest/React Testing Library setup,
- component split examples,
- safety-boundary thinking.

`virtual-puppet-theater/` remains useful for:

- optional future speech synthesis hardening,
- playful embodied-interaction ideas,
- state-machine discipline,
- browser-state tests and hardening notes.

Do not reuse these `virtual-puppet-theater/` pieces in the current MVP without a new decision:

- webcam/camera flow,
- MediaPipe hand tracking,
- WebSocket brain,
- Anthropic or ElevenLabs integrations,
- Three.js stage as a required shell,
- Bun server deployment.

The support folders are tracked from the root as submodules:

- `lumina`: `https://github.com/deesatzed/lumina.git`
- `virtual-puppet-theater`: `https://github.com/rhmoller/virtual-puppet-theater.git`

## Existing Patterns To Preserve

- Read project-control docs before coding.
- Keep support directories read-only unless a task explicitly modifies them.
- Keep the panic path local, deterministic, and offline-capable.
- Keep health copy bounded and non-diagnostic.
- Keep fun features optional and outside the critical SOS path.
- Prefer componentized React/TypeScript over the single-file prototype.
- Prefer bundled dependencies over runtime CDNs.
- Update `PROGRESS.md`, `DECISIONS.md`, and `TASK_QUEUE.md` after meaningful work.

## Tests and Verification

Current main app verification:

- `cd clearspace && npm run build`: passed.
- `cd clearspace && npm test`: passed, 6 test files and 31 tests.
- Guest Chrome desktop smoke: passed for home, SOS branching, and breathing timer.
- Guest Chrome narrow-window smoke: passed without visible overlap.
- Accessibility smoke: skip link and named main landmark present in Chrome accessibility tree.
- Dev server check: `curl -sS -I http://127.0.0.1:5173/` returned HTTP 200 after the voice-guide changes.

Known gaps:

- No automated axe/pa11y audit yet.
- No screen-reader pass yet.
- No real-device mobile browser pass yet.
- No release-readiness review yet.
- PWA/offline cache is not implemented yet.
- No real-browser audio-output TTS smoke has been recorded yet; automated tests cover the wiring with Web Speech mocks.

## Likely Architecture

The main app is a standalone Vite React TypeScript SPA using:

- `App` as a small view router/state coordinator,
- `AppShell` for layout, low-stimulation mode, and navigation,
- feature components for SOS, breathing, grounding, education, settings, journal, and fun/pre-panic tools,
- typed data modules for default copy and offline content,
- typed local storage for preferences and journal entries,
- optional local browser TTS composed through a speech service/hook and deterministic scripts,
- local JSON journal export and local delete controls,
- component tests for state transitions and persistence.

## Likely Next Build Task

The next queued task is `TQ-017`: add storage schema validation and migrations. After that, implement the deterministic guardrail module before any STT or AI work.
