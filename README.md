# UROK / ClearSpace

ClearSpace opens with four choices in the person’s own words. **Help me through this** starts immediate support. **I’m afraid it might happen** recalls or creates a manageable plan. **It just happened** opens aftercare directly. **I want to practice** offers short activities informed by CBT.

## Try the app

```sh
cd clearspace
npm ci
npm test
npm run dev
```

Open the local address printed by Vite. For the production build and offline behavior run `npm run build` followed by `npm run preview`. Serve the built `dist/` directory over HTTPS or localhost. After the first online visit completes caching, the core app and its included audio can reopen offline. Browser storage eviction or clearing site data removes that cache.

To repeat the small-screen and offline browser checks, run `npx playwright install chromium` and `npm run test:browser` in `clearspace/`.

[View the current home screen](docs/clearspace-home.png)

## Design and evidence

- **Before an activity** a short plan names something the person wants to do, a manageable action and an optional feared outcome. New plans, edits and reflection drafts survive interruptions. The home shortcut recalls the last chosen plan. Browser Back and Forward move between sections. Saved plans can be recalled, changed, reflected on or removed. Reflections preserve the person’s words about what happened.
- **After an episode** a quiet, untimed screen lets the person pause, return to the day, contact someone or choose support again. Journaling and the existing check-in are optional.
- **During support** the user can ground through touch or sight, switch exercises immediately, call a saved person, or exit. Sound starts only on request or through an explicitly saved preference. Breathing begins at the person's own pace. Counting is optional for both breathing and the senses sequence.
- **Between episodes** Practice offers a small-step planner, a sensation/thought/response exercise, a practical-action or uncertainty exercise, and the familiar breathing and grounding tools. Source notes link to CCI, NHS, NHS inform, NIMH and NICE guidance. Settings lets the person choose a first cue, pin a reminder and prepare optional audio. The optional check-in asks how things changed, including whether they were more intense. No answer or cause of improvement is assumed.
- **Voice** defaults to gentler spoken guidance with context and pauses while keeping visible cues short. Settings offers brief cues for people who prefer fewer words. Listening can be paused, resumed, muted or repeated, and never advances a support step. Bundled recordings serve the fixed cues and default reminders. On supported devices an optional WebGPU ZONOS3-Mini studio renders a different voice in advance in the chosen guidance style. During support the app plays saved audio, with one active guide and no automatic operating-system voice fallback. Custom reminders need prepared audio to be spoken. Prepared voices stay in the browser where they were created. [Voice assets and provenance](clearspace/VOICE_ASSETS.md)
- **Local data** includes preferences, contact, small plans and reflections, an optional personal pattern, journal and check-ins in browser local storage, plus explicitly prepared clips in IndexedDB. Users can delete notes and remove prepared clips. A blocked local save is reported with a retry option while the current tab retains the changes. The app has no account, analytics, cloud transcription, microphone input or generated medical advice.

The exercise guidance draws on self-help resources. ClearSpace has no patient outcome validation. [Clinical sources and usability evaluation](clearspace/UX_MITIGATION_AUDIT.md#support-flow-evaluation)

## Repository

The React, TypeScript and Vite app lives in `clearspace/`. The project landing page is in `docs/index.html`. Engineering records are in `DECISIONS.md`, `PROGRESS.md`, `TASK_QUEUE.md` and `REPO_MAP.md`.
