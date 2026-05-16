# UROK / ClearSpace

ClearSpace is a local-first panic-support app for pre-panic and active-panic moments. It keeps the critical support path fast, deterministic, and private: one-tap SOS guidance, paced breathing, 5-4-3-2-1 grounding, local personalization, optional scripted browser voice guidance, and local-only journaling.

This repository also keeps the planning and control documents used to guide autonomous implementation.

## Current Status

- Main app: `clearspace/`
- Stack: Vite, React, TypeScript, Vitest, React Testing Library, plain CSS
- Persistence: browser local storage under `clearspace:` keys
- Voice guide: optional browser Web Speech `speechSynthesis`, scripted only
- AI/STT: intentionally not connected until guardrails, privacy controls, storage validation, and fallbacks are implemented

## Try It Locally

```sh
cd clearspace
npm install
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

Then open `http://127.0.0.1:5173/`.

## Project Controls

Before implementation work, read:

- `GOAL.md`
- `STANDARDS.md`
- `IMPLEMENT.md`
- `DECISIONS.md`
- `PROGRESS.md`
- `TASK_QUEUE.md`
- `REPO_MAP.md`

The next queued engineering task is `TQ-017`: add storage schema validation and migrations.

## Safety Boundary

ClearSpace is a support tool, not a medical device. It does not diagnose, prescribe, replace emergency services, or replace professional care. Future AI or speech-input features must remain optional, opt-in, guarded, and nonessential to the SOS path.

## Landing Page

A static GitHub Pages-friendly landing page is available at `docs/index.html`.
