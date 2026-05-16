# DECISIONS.md

## Decision Log Overview

This file records durable project decisions. Future agents should add rows rather than overwrite history. If a decision changes, move the old row to "Superseded Decisions" and add the replacement as a new active decision.

## Active Decisions

| ID | Date | Decision | Status | Rationale |
| --- | --- | --- | --- | --- |
| D-001 | 2026-05-13 | Use `prefile.md` as the primary build source. | Active | It contains the clearest panic-support app prototype and aligns directly with the user goal. |
| D-002 | 2026-05-13 | Treat `prefile.dm` as a typo for `prefile.md`. | Active | The repo contains `prefile.md` and no `prefile.dm`. |
| D-003 | 2026-05-13 | Use `ClearSpace` as a provisional name only. | Active | The prototype already uses it, but the user has not confirmed final branding. |
| D-004 | 2026-05-13 | Build the main app separately from support directories. | Active | `lumina` and `virtual-puppet-theater` are reference projects with different goals and heavier dependencies. |
| D-005 | 2026-05-13 | Default to local-first, no-account, offline-capable MVP. | Active | Panic support must work when network, login, or API calls are unavailable. |
| D-006 | 2026-05-13 | Borrow Lumina patterns for local storage, offline content, safety boundaries, and tests. | Active | These patterns help the panic app without importing Lumina's clinical/provider scope. |
| D-007 | 2026-05-13 | Defer Virtual Puppet Theater's webcam/server/LLM stack. | Active | It is fun and technically rich but too complex and privacy-sensitive for the initial panic-support MVP. |
| D-008 | 2026-05-13 | Do not include AI-generated health guidance in the MVP. | Active | Health-safety risk and API dependency are unnecessary for the first version. |
| D-009 | 2026-05-13 | Avoid production reliance on runtime CDN dependencies. | Active | A bundled app is more reliable, testable, and offline-friendly. |
| D-010 | 2026-05-13 | Initialization run creates control docs only. | Active | The user explicitly requested no code implementation yet. |
| D-011 | 2026-05-13 | Leave `/Volumes/WS4TB/UROK` as a non-Git planning workspace for now and scaffold the app in `clearspace/`. | Active | `git status --short` confirms the root is not a Git repository; initializing Git is unnecessary for the next build step and should remain a separate explicit user decision. |
| D-012 | 2026-05-13 | Implement the MVP as a Vite React TypeScript app under `clearspace/` with Vitest, React Testing Library, lucide-react, and plain CSS. | Active | This matches the project plan, keeps the app bundled and local, avoids runtime CDNs, and is enough for the current UI without adding Tailwind or a server. |
| D-013 | 2026-05-13 | Store MVP preferences, support contact, toolkit items, reassurance phrases, and journal entries only in browser local storage using the `clearspace:` namespace. | Active | Local-only persistence supports privacy and offline use while avoiding account, sync, or backend data-retention obligations in the panic path. |
| D-014 | 2026-05-13 | Provide journal export through a local JSON data download and deletion through in-app local-storage controls. | Active | This gives users agency over sensitive journal data without adding accounts, sync, clipboard permissions, external APIs, or backend retention. |
| D-015 | 2026-05-13 | Use baseline SPA accessibility affordances: skip link, named main landmark, visible focus outlines, and focus-to-main on view changes. | Active | The app is a single-page flow used during distress; predictable keyboard and assistive-technology navigation should be part of the baseline before release. |
| D-016 | 2026-05-13 | Treat full-function expansion as a gated mitigation program; no live AI or STT may ship before deterministic guardrails, privacy controls, storage validation, and fallback paths exist. | Active | Panic-support AI/STT can create safety and privacy regressions if added directly. Gating preserves the reliable local SOS path while allowing TTS, profiles, STT, and AI to be added deliberately. |
| D-017 | 2026-05-15 | Use local browser Web Speech `speechSynthesis` for scripted voice guidance; do not use cloud TTS or AI-generated spoken health guidance. | Active | This resolves the dormant voice preference without API keys, accounts, network dependency, microphone access, or generated medical content. The spoken content stays app-authored, deterministic, optional, and stoppable. |
| D-018 | 2026-05-16 | Initialize `/Volumes/WS4TB/UROK` as the `main` Git repository with remote `https://github.com/deesatzed/UROK.git`; keep `lumina` and `virtual-puppet-theater` as submodules. | Active | The user requested commit/push to the UROK GitHub repo. The support directories already have their own Git histories and remotes, so submodules preserve those boundaries instead of flattening or rewriting them. |
| D-019 | 2026-05-16 | Remove `lumina` and `virtual-puppet-theater` from root Git tracking and keep them as local-only support references. | Active | GitHub Pages failed because the `lumina` submodule URL was not publicly cloneable. Keeping support references local-only lets Pages check out and deploy the UROK landing page without changing the main app. |
| D-020 | 2026-05-16 | Treat `redesign.md` as the current visual direction, but implement it with bundled React/CSS/lucide patterns instead of runtime Tailwind CDN, Google Fonts, Material Symbols, or external mockup images. | Active | The mockups define a useful ClearSpace layout and palette, but production standards require offline-capable bundled assets and no runtime CDN dependency in the panic-support path. |
| D-021 | 2026-05-16 | Mitigate panic-support UX risks with deterministic local UX logic before adding AI/STT: SOS focus mode, breathing-to-grounding escape, focus profiles, optional local check-ins, and red-flag routing. | Active | These mitigations reduce choice overload, repeated-use staleness, breathing backfire risk, shallow personalization, false effectiveness claims, and crisis ambiguity without adding cloud, AI, telemetry, accounts, or microphone access. |

## Initial Default Decisions

- Preferred future app directory: `clearspace/`.
- Preferred stack: Vite, React, TypeScript, lucide-react, Vitest, React Testing Library, plain CSS.
- Preferred data layer: typed, namespaced local storage hook with validation/fallback.
- Preferred MVP feature order: SOS flow, breathing/grounding, settings/persistence, safety copy, fun pre-panic tools, tests.
- Preferred role for playful companion ideas: post-MVP optional enhancement.

## Superseded Decisions

| ID | Superseded Date | Replacement | Notes |
| --- | --- | --- | --- |
| None | N/A | N/A | No decisions have been superseded yet. |

## Decision Rules For Future Agents

- If a choice affects safety, privacy, data retention, dependencies, deployment, or user-facing scope, log it here.
- If a change only affects internal implementation details within an accepted task, log it in `PROGRESS.md` instead.
- Favor offline, local, deterministic behavior over API-dependent behavior in the panic path.
- Favor direct user control and clear exits over automation.
- Keep support projects read-only unless a task explicitly changes that boundary.

## Pending Decision Questions

- Confirm final app name and directory name.
- Decide whether first release should be installable as a PWA.
- Decide whether emergency copy should be region-specific or configurable.
